package storage

import (
	"database/sql"
	"fmt"
	"github.com/apsdehal/go-logger"
	"github.com/vadimpk/db-project-zlagoda/api/internal/entity"
	"github.com/vadimpk/db-project-zlagoda/api/internal/service"
	"strings"
)

type checkStorage struct {
	logger *logger.Logger
	db     *sql.DB
}

func NewCheckStorage(logger *logger.Logger, db *sql.DB) service.CheckStorage {
	return &checkStorage{
		logger: logger,
		db:     db,
	}
}

var _ service.CheckStorage = (*checkStorage)(nil)

func (s *checkStorage) CreateCheck(check *entity.Check) (*entity.Check, error) {
	_, err := s.db.Exec("INSERT INTO checks (check_number, fk_id_employee, fk_card_number, print_date, sum_total, vat) VALUES ($1, $2, $3, $4, $5, $6)",
		check.ID, check.EmployeeID, check.CustomerCardID, check.Date, check.TotalPrice, check.VAT)
	if err != nil {
		s.logger.Errorf("error while creating check: %s", err)
		return nil, err
	}
	return check, err
}

func (s *checkStorage) GetCheck(id string) (*entity.Check, error) {
	check := entity.Check{}
	err := s.db.QueryRow("SELECT * FROM checks WHERE check_number = $1", id).
		Scan(&check.ID, &check.EmployeeID, &check.CustomerCardID, &check.Date, &check.TotalPrice, &check.VAT)
	if err != nil {
		if err == sql.ErrNoRows {
			s.logger.Infof("check with id %s not found", id)
			return nil, nil
		}
		s.logger.Errorf("error while getting check: %s", err)
	}
	return &check, nil
}

func (s *checkStorage) ListChecks(opts *service.ListChecksOptions) ([]*entity.Check, error) {
	var checks []*entity.Check
	var query strings.Builder
	var args []interface{}

	query.WriteString("SELECT * FROM checks WHERE 1=1")

	nextArgIndex := 1

	if opts.CardID != nil {
		query.WriteString(fmt.Sprintf(" AND fk_card_number = $%d", nextArgIndex))
		args = append(args, *opts.CardID)
		nextArgIndex++
	}

	if opts.EmployeeID != nil {
		query.WriteString(fmt.Sprintf(" AND fk_id_employee = $%d", nextArgIndex))
		args = append(args, *opts.EmployeeID)
		nextArgIndex++
	}

	if opts.StartDate != nil {
		query.WriteString(fmt.Sprintf(" AND print_date >= $%d", nextArgIndex))
		args = append(args, *opts.StartDate)
		nextArgIndex++
	}

	if opts.EndDate != nil {
		query.WriteString(fmt.Sprintf(" AND print_date <= $%d", nextArgIndex))
		args = append(args, *opts.EndDate)
		nextArgIndex++
	}

	s.logger.Infof("query: %s", query.String())
	rows, err := s.db.Query(query.String(), args...)
	if err != nil {
		s.logger.Errorf("error while listing checks: %s", err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		check := entity.Check{}
		err := rows.Scan(&check.ID, &check.EmployeeID, &check.CustomerCardID,
			&check.Date, &check.TotalPrice, &check.VAT)
		if err != nil {
			s.logger.Errorf("error while scanning check row: %s", err)
			return nil, err
		}
		checks = append(checks, &check)
	}

	return checks, nil
}

func (s *checkStorage) UpdateCheck(id string, check *entity.Check) (*entity.Check, error) {
	_, err := s.db.Exec("UPDATE checks SET fk_id_employee = $1, fk_card_number = $2, print_date = $3, sum_total = $4, vat = $5 WHERE check_number = $6",
		check.EmployeeID, check.CustomerCardID, check.Date, check.TotalPrice, check.VAT, id)
	if err != nil {
		s.logger.Errorf("error while updating check: %s", err)
		return nil, err
	}
	return check, nil
}

func (s *checkStorage) DeleteCheck(id string) error {
	_, err := s.db.Exec("DELETE FROM checks WHERE check_number = $1", id)
	if err != nil {
		s.logger.Errorf("error while deleting check: %s", err)
		return err
	}
	return nil
}

func (s *checkStorage) CreateCheckItem(checkItem *entity.CheckItem) (*entity.CheckItem, error) {
	_, err := s.db.Exec("INSERT INTO sale (fk_UPC, fk_check_number, product_number, selling_price) VALUES ($1, $2, $3, $4)",
		checkItem.ID.StoreProductID, checkItem.ID.CheckID, checkItem.ProductCount, checkItem.ProductPrice)
	if err != nil {
		s.logger.Errorf("error while creating check item: %s", err)
		return nil, err
	}
	return checkItem, err
}

func (s *checkStorage) GetCheckItem(id entity.CheckItemID) (*entity.CheckItem, error) {
	checkItem := entity.CheckItem{}
	err := s.db.QueryRow("SELECT * FROM sale WHERE fk_check_number = $1 AND fk_upc = $2",
		id.CheckID, id.StoreProductID).
		Scan(&checkItem.ID.StoreProductID, &checkItem.ID.CheckID, &checkItem.ProductCount, &checkItem.ProductPrice)
	if err != nil {
		if err == sql.ErrNoRows {
			s.logger.Infof("check item with id %s not found", id)
			return nil, nil
		}
		s.logger.Errorf("error while getting check item: %s", err)
	}
	return &checkItem, nil
}

func (s *checkStorage) ListCheckItems(opts *service.ListCheckItemsOptions) ([]*entity.CheckItem, error) {
	var checkItems []*entity.CheckItem
	var query strings.Builder
	var args []interface{}

	query.WriteString("SELECT sale.* FROM sale JOIN checks ON sale.fk_check_number = checks.check_number WHERE 1=1")

	nextArgIndex := 1

	if opts.CheckID != nil {
		query.WriteString(fmt.Sprintf(" AND fk_check_number = $%d", nextArgIndex))
		args = append(args, *opts.CheckID)
		nextArgIndex++
	}

	if opts.StoreProductID != nil {
		query.WriteString(fmt.Sprintf(" AND fk_UPC = $%d", nextArgIndex))
		args = append(args, *opts.StoreProductID)
		nextArgIndex++
	}

	if opts.StartDate != nil {
		query.WriteString(fmt.Sprintf(" AND print_date >= $%d", nextArgIndex))
		args = append(args, *opts.StartDate)
		nextArgIndex++
	}

	if opts.EndDate != nil {
		query.WriteString(fmt.Sprintf(" AND print_date <= $%d", nextArgIndex))
		args = append(args, *opts.EndDate)
		nextArgIndex++
	}

	s.logger.Infof("query: %s", query.String())
	rows, err := s.db.Query(query.String(), args...)
	if err != nil {
		s.logger.Errorf("error while listing check items: %s", err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		checkItem := entity.CheckItem{}
		checkItemID := entity.CheckItemID{}
		err := rows.Scan(&checkItemID.StoreProductID, &checkItemID.CheckID,
			&checkItem.ProductCount, &checkItem.ProductPrice)
		if err != nil {
			s.logger.Errorf("error while scanning check item row: %s", err)
			return nil, err
		}
		checkItem.ID = checkItemID
		checkItems = append(checkItems, &checkItem)
	}

	return checkItems, nil
}

func (s *checkStorage) UpdateCheckItem(id entity.CheckItemID, checkItem *entity.CheckItem) (*entity.CheckItem, error) {
	_, err := s.db.Exec("UPDATE sale SET product_number = $1, selling_price = $2 WHERE fk_check_number = $3 AND fk_upc = $4",
		checkItem.ProductCount, checkItem.ProductPrice, id.CheckID, id.StoreProductID)
	if err != nil {
		s.logger.Errorf("error while updating check item: %s", err)
		return nil, err
	}
	return checkItem, nil
}

func (s *checkStorage) DeleteCheckItem(id entity.CheckItemID) error {
	_, err := s.db.Exec("DELETE FROM sale WHERE fk_check_number = $1 AND fk_UPC = $2", id.CheckID, id.StoreProductID)
	if err != nil {
		s.logger.Errorf("error while deleting check item: %s", err)
		return err
	}
	return nil
}
