package storage

import (
	"database/sql"
	"fmt"
	"github.com/apsdehal/go-logger"
	"github.com/vadimpk/db-project-zlagoda/api/internal/entity"
	"github.com/vadimpk/db-project-zlagoda/api/internal/service"
)

type statisticsStorage struct {
	logger *logger.Logger
	db     *sql.DB
}

func NewStatisticsStorage(logger *logger.Logger, db *sql.DB) service.StatisticsStorage {
	return &statisticsStorage{
		logger: logger,
		db:     db,
	}
}

var _ service.StatisticsService = (*statisticsStorage)(nil)

func (s *statisticsStorage) GetSalesByCategory(opts *service.GetSalesByCategoryOptions) ([]*entity.CategorySale, error) {

	var dateFilter string
	var args []interface{}
	if opts.StartDate != nil && opts.EndDate != nil {
		dateFilter = "WHERE ch.print_date BETWEEN $1 AND $2 "
		args = append(args, opts.StartDate, opts.EndDate)
	}

	query := fmt.Sprintf(`
SELECT
    c.category_number,
    c.category_name,
    COUNT(DISTINCT s.fk_check_number) AS total_sales,
    AVG(cc.discount) AS avg_discount,
    SUM(s.product_number) AS total_products_sold,
    AVG(s.selling_price) AS avg_selling_price
FROM
    sale s
JOIN
    checks ch ON s.fk_check_number = ch.check_number
JOIN
    store_product sp ON s.fk_UPC = sp.UPC
JOIN
    product p ON sp.fk_id_product = p.id_product
JOIN
    category c ON p.fk_category_number = c.category_number
LEFT JOIN
    customer_card cc ON ch.fk_card_number = cc.card_number
 %s 
GROUP BY
    c.category_number, c.category_name
ORDER BY
    total_sales DESC, c.category_number;
`, dateFilter)

	s.logger.Infof("executing query: %s", query)
	rows, err := s.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []*entity.CategorySale
	for rows.Next() {
		var sale entity.CategorySale
		err := rows.Scan(
			&sale.CategoryNumber,
			&sale.CategoryName,
			&sale.TotalSales,
			&sale.AvgDiscount,
			&sale.TotalProductsSold,
			&sale.AvgSellingPrice,
		)
		if err != nil {
			return nil, err
		}
		results = append(results, &sale)
	}

	return results, nil
}

func (s *statisticsStorage) GetEmployeesChecks(opts *service.GetEmployeesChecksOptions) ([]*entity.EmployeeCheck, error) {
	var dateFilter string
	var args []interface{}
	if opts.StartDate != nil && opts.EndDate != nil {
		dateFilter = "WHERE ch.print_date BETWEEN $1 AND $2 "
		args = append(args, opts.StartDate, opts.EndDate)
	}

	query := fmt.Sprintf(`
SELECT
    e.id_employee,
    e.empl_surname,
    e.empl_name,
    COUNT(ch.check_number) AS check_count,
    SUM(ch.sum_total) AS total_price,
    AVG(ch.sum_total) AS avg_check_price,
    SUM(ch.sum_total * cc.discount / 100) AS total_discount,
    COUNT(DISTINCT ch.fk_card_number) AS different_customers
FROM
    employee e
JOIN
    checks ch ON e.id_employee = ch.fk_id_employee
LEFT JOIN
    customer_card cc ON ch.fk_card_number = cc.card_number
 %s 
GROUP BY
    e.id_employee, e.empl_surname, e.empl_name
ORDER BY
    check_count DESC;
`, dateFilter)

	s.logger.Infof("executing query: %s", query)
	rows, err := s.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []*entity.EmployeeCheck
	for rows.Next() {
		var check entity.EmployeeCheck
		err := rows.Scan(
			&check.IdEmployee,
			&check.EmplSurname,
			&check.EmplName,
			&check.CheckCount,
			&check.TotalCheckPrice,
			&check.AverageCheckPrice,
			&check.TotalDiscount,
			&check.DifferentCustomers,
		)
		if err != nil {
			return nil, err
		}
		results = append(results, &check)
	}

	return results, nil
}
