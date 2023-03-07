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

func (s *customerCardService) Get(id string) (*entity.CustomerCard, error) {
	return s.storages.CustomerCard.Get(id)
}
