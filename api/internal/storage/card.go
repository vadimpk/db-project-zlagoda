package storage

import (
	"database/sql"
	"github.com/apsdehal/go-logger"
	"github.com/vadimpk/db-project-zlagoda/api/internal/entity"
	"github.com/vadimpk/db-project-zlagoda/api/internal/service"
)

type cardStorage struct {
	logger *logger.Logger
	db     *sql.DB
}

func NewCardStorage(logger *logger.Logger, db *sql.DB) service.CardStorage {
	return &cardStorage{
		logger: logger,
		db:     db,
	}
}

var _ service.CardStorage = (*cardStorage)(nil)

func (s *cardStorage) CreateCard(card *entity.Card) (*entity.Card, error) {
	_, err := s.db.Exec("INSERT INTO customer_card (card_number, cust_surname, cust_name, cust_patronymic, phone_number, city, street, zip_code, discount) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
		card.ID, card.Surname, card.Name, card.Patronymic, card.PhoneNumber, card.City, card.Street, card.Zip, card.Discount)
	if err != nil {
		s.logger.Errorf("error while creating card: %s", err)
		return nil, err
	}
	return card, err
}
func (s *cardStorage) GetCard(id string) (*entity.Card, error) {
	card := entity.Card{}
	err := s.db.QueryRow("SELECT * FROM customer_card WHERE card_number = $1", id).
		Scan(&card.ID, &card.Surname, &card.Name, &card.Patronymic,
			&card.PhoneNumber, &card.City, &card.Street, &card.Zip)
	if err != nil {
		s.logger.Errorf("error while getting customer card: %s", err)
	}
	return &card, nil
}
func (s *cardStorage) ListCard(opts service.ListCardOptions) ([]*entity.Card, error) {
	return nil, nil
}
func (s *cardStorage) UpdateCard(id string, card *entity.Card) (*entity.Card, error) {
	_, err := s.db.Exec("UPDATE customer_card SET cust_surname = $1, cust_name = $2, cust_patronymic = $3, phone_number = $4, city = $5, street = $6, zip_code = $7, discount = $8 WHERE card_number = $9",
		card.Surname, card.Name, card.Patronymic, card.PhoneNumber, card.City, card.Street, card.Zip, card.Discount, id)
	if err != nil {
		s.logger.Errorf("error while updating card: %s", err)
		return nil, err
	}
	return card, nil
}

func (s *cardStorage) DeleteCards(ids []string) error {
	_, err := s.db.Exec("DELETE FROM customer_card WHERE card_number = ANY($1)", ids)
	if err != nil {
		s.logger.Errorf("error while deleting cards: %s", err)
		return err
	}
	return nil
}
