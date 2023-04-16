package service

import (
	"github.com/apsdehal/go-logger"
	"github.com/thanhpk/randstr"
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
	card.ID = randstr.String(13)
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
	previousCard, err := s.storages.CustomerCard.Get(id)
	if err != nil {
		s.logger.Errorf("error getting card: %#v", err)
		return nil, err
	}
	if previousCard == nil {
		s.logger.Infof("card with id %s not found", id)
		return nil, ErrUpdateCardNotFound
	}

	existingCard, err := s.storages.CustomerCard.Get(card.ID)
	if err != nil {
		s.logger.Errorf("error getting card: %#v", err)
		return nil, err
	}
	if existingCard != nil && existingCard.ID != id {
		s.logger.Infof("card already exists")
		return nil, ErrUpdateCardAlreadyExists
	}

	return s.storages.CustomerCard.Update(id, card)
}

func (s *customerCardService) Delete(id string) error {
	s.logger.Infof("deleting card: %#v", id)
	card, err := s.storages.CustomerCard.Get(id)
	if err != nil {
		s.logger.Errorf("error getting card: %#v", err)
		return err
	}
	if card == nil {
		s.logger.Infof("card with id %s not found", id)
		return ErrDeleteCardNotFound
	}
	checks, err := s.storages.Check.ListChecks(&ListChecksOptions{
		EmployeeID: &id,
	})
	if err != nil {
		s.logger.Errorf("failed to get checks: %v", err)
		return err
	}
	if len(checks) > 0 {
		s.logger.Infof("card has checks")
		return ErrDeleteEmployeeChecksExist
	}
	return s.storages.CustomerCard.Delete(id)
}
