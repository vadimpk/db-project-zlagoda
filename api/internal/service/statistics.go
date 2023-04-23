package service

import (
	"github.com/apsdehal/go-logger"
	"github.com/vadimpk/db-project-zlagoda/api/config"
	"github.com/vadimpk/db-project-zlagoda/api/internal/entity"
)

type statisticsService struct {
	logger   *logger.Logger
	config   *config.Config
	storages Storages
}

func NewStatisticsService(opts Options) StatisticsService {
	return &statisticsService{
		logger:   opts.Logger,
		storages: opts.Storages,
		config:   opts.Config,
	}
}

var _ StatisticsService = (*statisticsService)(nil)

func (s *statisticsService) GetSalesByCategory(opts *GetSalesByCategoryOptions) ([]*entity.CategorySale, error) {
	s.logger.Infof("GetSalesByCategory: opts=%v", opts)
	return s.storages.Statistics.GetSalesByCategory(opts)
}

func (s *statisticsService) GetEmployeesChecks(opts *GetEmployeesChecksOptions) ([]*entity.EmployeeCheck, error) {
	s.logger.Infof("GetEmployeesChecks: opts=%v", opts)
	return s.storages.Statistics.GetEmployeesChecks(opts)
}

func (s *statisticsService) GetCustomersBuyAllCategories(opts *GetCustomersBuyAllCategoriesOptions) ([]*entity.CustomerBuyAllCategories, error) {
	s.logger.Infof("GetCustomersBuyAllCategories: opts=%v", opts)
	return s.storages.Statistics.GetCustomersBuyAllCategories(opts)
}

func (s *statisticsService) GetCustomersChecks(opts *GetCustomersChecksOptions) ([]*entity.CustomerCheck, error) {
	s.logger.Infof("GetCustomersChecks: opts=%v", opts)
	return s.storages.Statistics.GetCustomersChecks(opts)
}

func (s *statisticsService) GetEmployeesWithNoChecks(opts *GetEmployeesWithNoChecksOptions) ([]*entity.Employee, error) {
	s.logger.Infof("GetEmployeesWithNoChecks: opts=%v", opts)
	return s.storages.Statistics.GetEmployeesWithNoChecks(opts)
}
