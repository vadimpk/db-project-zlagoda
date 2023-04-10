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
	existingCard, err := s.storages.CustomerCard.Get(card.ID)
	if err != nil {
		s.logger.Errorf("failed to get card: %v", err)
		return nil, err
	}
	if existingCard != nil {
		s.logger.Errorf("card already exists")
		return nil, ErrCreateCardAlreadyExists
	}
	s.logger.Infof("creating card: %#v", card)
	return s.storages.CustomerCard.Create(card)
}

func (s *customerCardService) Get(id string) (*entity.CustomerCard, error) {
	s.logger.Infof("getting card: %#v", id)
	return s.storages.CustomerCard.Get(id)
}

func (s *customerCardService) List(opts ListCardOptions) ([]*entity.CustomerCard, error) {
	s.logger.Infof("listing cards: %#v", opts)
	return s.storages.CustomerCard.List(opts)
}

func (s *customerCardService) Update(id string, card *entity.CustomerCard) (*entity.CustomerCard, error) {
	s.logger.Infof("updating card: %#v", card)
	return s.storages.CustomerCard.Update(id, card)
}

func (s *customerCardService) Delete(id string) error {
	s.logger.Infof("deleting card: %#v", id)
	checks, err := s.storages.Check.ListChecks(&ListChecksOptions{
		EmployeeID: &id,
	})
	if err != nil {
		s.logger.Errorf("failed to get checks: %v", err)
		return err
	}
	if len(checks) > 0 {
		s.logger.Errorf("card has checks")
		return ErrDeleteEmployeeChecksExist
	}
	return s.storages.CustomerCard.Delete(id)
}
