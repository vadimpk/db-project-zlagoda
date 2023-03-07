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

func NewCardService(opts Options) CardService {
	return &cardService{
		logger:   opts.Logger,
		config:   opts.Config,
		storages: opts.Storages,
	}
}

var _ CardService = (*cardService)(nil)

func (s *cardService) CreateCard(card *entity.Card) (*entity.Card, error) {
	s.logger.Infof("creating card: %#v", card)
	return s.storages.Card.CreateCard(card)
}
func (s *cardService) GetCard(id string) (*entity.Card, error) {
	s.logger.Infof("getting card: %#v", id)
	return s.storages.Card.GetCard(id)
}
func (s *cardService) ListCard(opts ListCardOptions) ([]*entity.Card, error) {
	s.logger.Infof("listing cards: %#v", opts)
	return s.storages.Card.ListCard(opts)
}
func (s *cardService) UpdateCard(id string, card *entity.Card) (*entity.Card, error) {
	s.logger.Infof("updating card: %#v", card)
	return s.storages.Card.UpdateCard(id, card)
}
func (s *cardService) DeleteCards(ids []string) error {
	s.logger.Infof("deleting cards: %#v", ids)
	return s.storages.Card.DeleteCards(ids)
}
