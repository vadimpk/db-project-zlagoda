package service

import (
	"github.com/apsdehal/go-logger"
	"github.com/vadimpk/db-project-zlagoda/api/config"
	"github.com/vadimpk/db-project-zlagoda/api/internal/entity"
)

type customerCardService struct {
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

func (s *customerCardService) Create(card *entity.CustomerCard) (*entity.CustomerCard, error) {
	s.logger.Infof("creating card: %#v", card)
	return s.storages.CustomerCard.Create(card)
}

func (s *customerCardService) Get(id int) (*entity.CustomerCard, error) {
	s.logger.Infof("getting card: %#v", id)
	return s.storages.CustomerCard.Get(id)
}

func (s *customerCardService) List(opts ListCardOptions) ([]*entity.CustomerCard, error) {
	s.logger.Infof("listing cards: %#v", opts)
	return s.storages.CustomerCard.List(opts)
}

func (s *customerCardService) Update(id int, card *entity.CustomerCard) (*entity.CustomerCard, error) {
	s.logger.Infof("updating card: %#v", card)
	return s.storages.CustomerCard.Update(id, card)
}

func (s *customerCardService) Delete(ids []int) error {
	s.logger.Infof("deleting cards: %#v", ids)
	return s.storages.CustomerCard.Delete(ids)
}
