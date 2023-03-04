package storage

import (
	"database/sql"
	"github.com/apsdehal/go-logger"
	"github.com/vadimpk/db-project-zlagoda/internal/entity"
	"github.com/vadimpk/db-project-zlagoda/internal/service"
)

type employeeStorage struct {
	logger *logger.Logger
	db     *sql.DB
}

func NewEmployeeStorage(logger *logger.Logger, db *sql.DB) service.EmployeeStorage {
	return &employeeStorage{
		logger: logger,
		db:     db,
	}
}

var _ service.EmployeeStorage = (*employeeStorage)(nil)

func (s *employeeStorage) Get(id string) (*entity.Employee, error) {
	employee := entity.Employee{}
	err := s.db.QueryRow("SELECT * FROM employee WHERE id_employee = $1", id).
		Scan(&employee.ID, &employee.Surname, &employee.Name, &employee.Patronymic,
			&employee.Role, &employee.Salary, &employee.DateOfBirth, &employee.DateOfStart,
			&employee.Phone, &employee.City, &employee.Street, &employee.Zip)
	if err != nil {
		s.logger.Errorf("error while getting employee: %s", err)
	}

	s.logger.Infof("got employee: %v", employee)
	return &employee, nil
}
