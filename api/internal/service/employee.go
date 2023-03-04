package service

import (
	"github.com/apsdehal/go-logger"
	"github.com/vadimpk/db-project-zlagoda/api/config"
	"github.com/vadimpk/db-project-zlagoda/api/internal/entity"
)

type employeeService struct {
	logger   *logger.Logger
	config   *config.Config
	storages Storages
}

func NewEmployeeService(opts Options) EmployeeService {
	return &employeeService{
		logger:   opts.Logger,
		storages: opts.Storages,
		config:   opts.Config,
	}
}

var _ EmployeeService = (*employeeService)(nil)

func (s *employeeService) Get(id string) (*entity.Employee, error) {
	return s.storages.Employee.Get(id)
}
