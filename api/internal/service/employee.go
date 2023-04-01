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

func (s *employeeService) Create(employee *entity.Employee) (*entity.Employee, error) {
	s.logger.Infof("creating employee: %#v", employee)
	return s.storages.Employee.Create(employee)
}

func (s *employeeService) Get(id string) (*entity.Employee, error) {
	s.logger.Infof("getting employee: %#v", id)
	return s.storages.Employee.Get(id)
}

func (s *employeeService) List(opts ListEmployeeOptions) ([]*entity.Employee, error) {
	s.logger.Infof("listing employees: %#v", opts)
	return s.storages.Employee.List(opts)
}

func (s *employeeService) Update(id string, employee *entity.Employee) (*entity.Employee, error) {
	s.logger.Infof("updating employee: %#v", employee)
	return s.storages.Employee.Update(id, employee)
}

func (s *employeeService) Delete(ids []string) error {
	s.logger.Infof("deleting employees: %#v", ids)
	return s.storages.Employee.Delete(ids)
}
