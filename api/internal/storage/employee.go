package storage

import (
	"database/sql"
	"github.com/apsdehal/go-logger"
	"github.com/vadimpk/db-project-zlagoda/api/internal/entity"
	"github.com/vadimpk/db-project-zlagoda/api/internal/service"
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

func (s *employeeStorage) Create(employee *entity.Employee) (*entity.Employee, error) {
	_, err := s.db.Exec("INSERT INTO employee (id_employee,empl_name, empl_surname,empl_patronymic, empl_role, salary, date_of_birth, date_of_start, phone_number, city, street, zip_code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
		employee.ID, employee.Name, employee.Surname, employee.Patronymic, employee.Role, employee.Salary, employee.DateOfBirth, employee.DateOfStart, employee.Phone, employee.City, employee.Street, employee.Zip)
	if err != nil {
		s.logger.Errorf("error while creating employee: %s", err)
		return nil, err
	}
	return employee, err
}

func (s *employeeStorage) Get(id int) (*entity.Employee, error) {
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

func (s *employeeStorage) List(opts service.ListEmployeeOptions) ([]*entity.Employee, error) {
	return nil, nil
}

func (s *employeeStorage) Update(id int, employee *entity.Employee) (*entity.Employee, error) {
	_, err := s.db.Exec("UPDATE employee SET empl_name = $1, empl_surname = $2, empl_patronymic = $3, empl_role = $4, salary = $5, date_of_birth = $6, date_of_start = $7, phone_number = $8, city = $9, street = $10, zip_code = $11 WHERE id_employee = $12",
		employee.Name, employee.Surname, employee.Patronymic, employee.Role, employee.Salary, employee.DateOfBirth, employee.DateOfStart, employee.Phone, employee.City, employee.Street, employee.Zip, id)
	if err != nil {
		s.logger.Errorf("error while updating employee: %s", err)
		return nil, err
	}
	return employee, err
}

func (s *employeeStorage) Delete(ids []int) error {
	for _, id := range ids {
		_, err := s.db.Exec("DELETE FROM employee WHERE id_employee = $1", id)
		if err != nil {
			s.logger.Errorf("error while deleting employee: %s", err)
			return err
		}
	}
	return nil
}
