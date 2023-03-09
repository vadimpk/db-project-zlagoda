package service

import (
	"github.com/apsdehal/go-logger"
	"github.com/vadimpk/db-project-zlagoda/api/config"
	"github.com/vadimpk/db-project-zlagoda/api/internal/entity"
)

type cardService struct {
	logger   *logger.Logger
	config   *config.Config
	storages Storages
}

func NewCustomerCardService(opts Options) CustomerCardService {
	return &customerCardService{
		logger:   opts.Logger,
		config:   opts.Config,
		storages: opts.Storages,
	}
}

var _ CustomerCardService = (*customerCardService)(nil)

func (s *customerCardService) CreateCard(card *entity.CustomerCard) (*entity.CustomerCard, error) {
	s.logger.Infof("creating card: %#v", card)
	return s.storages.CustomerCard.Create(card)
}

func (s *cardService) GetCard(id string) (*entity.CustomerCard, error) {
	s.logger.Infof("getting card: %#v", id)
	return s.storages.Card.Get(id)
}

func (s *cardService) ListCard(opts ListCardOptions) ([]*entity.CustomerCard, error) {
	s.logger.Infof("listing cards: %#v", opts)
	return s.storages.Card.List(opts)
}

func (s *cardService) UpdateCard(id string, card *entity.CustomerCard) (*entity.CustomerCard, error) {
	s.logger.Infof("updating card: %#v", card)
	return s.storages.Card.Update(id, card)
}

func (s *cardService) DeleteCards(ids []string) error {
	s.logger.Infof("deleting cards: %#v", ids)
	return s.storages.Card.Delete(ids)
}
