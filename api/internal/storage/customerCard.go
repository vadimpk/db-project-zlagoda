package storage

import (
	"database/sql"
	"github.com/apsdehal/go-logger"
	"github.com/vadimpk/db-project-zlagoda/api/internal/entity"
	"github.com/vadimpk/db-project-zlagoda/api/internal/service"
)

type customerCardStorage struct {
	logger *logger.Logger
	db     *sql.DB
}

func NewCustomerCardStorage(logger *logger.Logger, db *sql.DB) service.CardStorage {
	return &customerCardStorage{
		logger: logger,
		db:     db,
	}
}

var _ service.CardStorage = (*customerCardStorage)(nil)

func (s *customerCardStorage) Get(id string) (*entity.CustomerCard, error) {
	customerCard := entity.CustomerCard{}
	err := s.db.QueryRow("SELECT * FROM customer_card WHERE card_number = $1", id).
		Scan(&customerCard.ID, &customerCard.Surname, &customerCard.Name, &customerCard.Patronymic,
			&customerCard.PhoneNumber, &customerCard.City, &customerCard.Street, &customerCard.Zip)
	if err != nil {
		s.logger.Errorf("error while getting customer card: %s", err)
	}

	s.logger.Infof("got customerCard: %v", customerCard)
	return &customerCard, nil
}
