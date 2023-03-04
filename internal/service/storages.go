package service

import "github.com/vadimpk/db-project-zlagoda/internal/entity"

type Storages struct {
	Employee EmployeeStorage
}

type EmployeeStorage interface {
	Get(id string) (*entity.Employee, error)
}
