package service

import (
	"github.com/apsdehal/go-logger"
	"github.com/vadimpk/db-project-zlagoda/api/config"
	"github.com/vadimpk/db-project-zlagoda/api/internal/entity"
)

type checkService struct {
	logger   *logger.Logger
	config   *config.Config
	storages Storages
}

func NewCheckService(opts Options) CheckService {
	return &checkService{
		logger:   opts.Logger,
		config:   opts.Config,
		storages: opts.Storages,
	}
}

var _ CheckService = (*checkService)(nil)

func (s *checkService) CreateCheck(check *entity.Check) (*entity.Check, error) {
	s.logger.Infof("creating check: %#v", check)
	return s.storages.Check.CreateCheck(check)
}

func (s *checkService) GetCheck(id string) (*entity.Check, error) {
	s.logger.Infof("getting check: %#v", id)
	return s.storages.Check.GetCheck(id)
}

func (s *checkService) ListChecks(opts ListChecksOptions) ([]*entity.Check, error) {
	return nil, nil
}

func (s *checkService) UpdateCheck(id string, check *entity.Check) (*entity.Check, error) {
	s.logger.Infof("updating check: %#v", check)
	return s.storages.Check.UpdateCheck(id, check)
}

func (s *checkService) DeleteChecks(ids []string) error {
	s.logger.Infof("deleting checks: %#v", ids)
	return s.storages.Check.DeleteChecks(ids)
}

func (s *checkService) CreateCheckItem(checkItem *entity.CheckItem) (*entity.CheckItem, error) {
	s.logger.Infof("creating check item: %#v", checkItem)
	return s.storages.Check.CreateCheckItem(checkItem)
}

func (s *checkService) GetCheckItem(id entity.CheckItemID) (*entity.CheckItem, error) {
	s.logger.Infof("getting check item: %#v", id)
	return s.storages.Check.GetCheckItem(id)
}

func (s *checkService) ListCheckItems(opts ListCheckItemsOptions) ([]*entity.CheckItem, error) {
	return nil, nil
}

func (s *checkService) UpdateCheckItem(id entity.CheckItemID, checkItem *entity.CheckItem) (*entity.CheckItem, error) {
	s.logger.Infof("updating check item: %#v with id: %#v", checkItem, id)
	return s.storages.Check.UpdateCheckItem(id, checkItem)
}

func (s *checkService) DeleteCheckItems(ids []entity.CheckItemID) error {
	s.logger.Infof("deleting check items: %#v", ids)
	return s.storages.Check.DeleteCheckItems(ids)
}
