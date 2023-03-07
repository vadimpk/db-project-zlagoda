package service

import (
	"github.com/vadimpk/db-project-zlagoda/api/internal/entity"
)

type Storages struct {
	Employee     EmployeeStorage
	CustomerCard CardStorage
}

type EmployeeStorage interface {
	Get(id string) (*entity.Employee, error)
}

type CardStorage interface {
	Get(id string) (*entity.CustomerCard, error)
}
