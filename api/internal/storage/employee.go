package storage

import (
	"database/sql"
	"fmt"
	"github.com/apsdehal/go-logger"
	"github.com/vadimpk/db-project-zlagoda/api/internal/entity"
	"github.com/vadimpk/db-project-zlagoda/api/internal/service"
	"strings"
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
	_, err := s.db.Exec("INSERT INTO employee (id_employee,empl_name, empl_surname,empl_patronymic, empl_role, salary, date_of_birth, date_of_start, phone_number, city, street, zip_code, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)",
		employee.ID, employee.Name, employee.Surname, employee.Patronymic, employee.Role, employee.Salary, employee.DateOfBirth, employee.DateOfStart, employee.Phone, employee.City, employee.Street, employee.Zip, employee.Password)
	if err != nil {
		s.logger.Errorf("error while creating employee: %s", err)
		return nil, err
	}
	return employee, err
}

func (s *employeeStorage) Get(id string) (*entity.Employee, error) {
	employee := entity.Employee{}
	err := s.db.QueryRow("SELECT * FROM employee WHERE id_employee = $1", id).
		Scan(&employee.ID, &employee.Surname, &employee.Name, &employee.Patronymic,
			&employee.Role, &employee.Salary, &employee.DateOfBirth, &employee.DateOfStart,
			&employee.Phone, &employee.City, &employee.Street, &employee.Zip, &employee.Password)
	if err != nil {
		s.logger.Errorf("error while getting employee: %s", err)
	}
	s.logger.Infof("got employee: %v", employee)
	return &employee, nil
}

func (s *employeeStorage) List(opts service.ListEmployeeOptions) ([]*entity.Employee, error) {
	var employees []*entity.Employee
	var query strings.Builder
	var args []interface{}

	query.WriteString("SELECT * FROM employee WHERE 1=1")

	if opts.Search != nil {
		query.WriteString(" AND (empl_surname ILIKE $1 OR empl_name ILIKE $2 OR empl_patronymic ILIKE $3)")
		args = append(args, "%"+*opts.Search+"%", "%"+*opts.Search+"%", "%"+*opts.Search+"%")
	}

	nextArgIndex := len(args) + 1

	if opts.Role != nil {
		query.WriteString(fmt.Sprintf(" AND empl_role = $%d", nextArgIndex))
		args = append(args, *opts.Role)
		nextArgIndex++
	}

	if opts.SortSurname != nil {
		query.WriteString(" ORDER BY empl_surname")
		if opts.SortAscending != nil && *opts.SortAscending {
			query.WriteString(" ASC")
		} else {
			query.WriteString(" DESC")
		}
	}
	rows, err := s.db.Query(query.String(), args...)
	if err != nil {
		s.logger.Errorf("error while listing employees: %s", err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		employee := entity.Employee{}
		err := rows.Scan(&employee.ID, &employee.Surname, &employee.Name, &employee.Patronymic,
			&employee.Role, &employee.Salary, &employee.DateOfBirth, &employee.DateOfStart,
			&employee.Phone, &employee.City, &employee.Street, &employee.Zip, &employee.Password)
		if err != nil {
			s.logger.Errorf("error while scanning employee row: %s", err)
			return nil, err
		}
		employees = append(employees, &employee)
	}

	return employees, nil
}

func (s *employeeStorage) Update(id string, employee *entity.Employee) (*entity.Employee, error) {
	_, err := s.db.Exec("UPDATE employee SET empl_name = $1, empl_surname = $2, empl_patronymic = $3, empl_role = $4, salary = $5, date_of_birth = $6, date_of_start = $7, phone_number = $8, city = $9, street = $10, zip_code = $11, password = $12 WHERE id_employee = $13",
		employee.Name, employee.Surname, employee.Patronymic, employee.Role, employee.Salary, employee.DateOfBirth, employee.DateOfStart, employee.Phone, employee.City, employee.Street, employee.Zip, employee.Password, id)
	if err != nil {
		s.logger.Errorf("error while updating employee: %s", err)
		return nil, err
	}
	return employee, err
}

func (s *employeeStorage) Delete(id string) error {
	_, err := s.db.Exec("DELETE FROM employee WHERE id_employee = $1", id)
	if err != nil {
		s.logger.Errorf("error while deleting employee: %s", err)
		return err
	}
	return nil
}
