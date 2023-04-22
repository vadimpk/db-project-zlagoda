package entity

import "time"

type Employee struct {
	ID          string    `json:"id" validate:"required,max=10"`
	Surname     string    `json:"surname" validate:"required,max=50"`
	Name        string    `json:"name" validate:"required,max=50"`
	Patronymic  string    `json:"patronymic" validate:"required,max=50"`
	Role        string    `json:"role" validate:"required,max=10"`
	Salary      float64   `json:"salary" validate:"required"`
	DateOfBirth time.Time `json:"date_of_birth" format:"date-time" example:"2000-01-01T00:00:00Z" validate:"required"`
	DateOfStart time.Time `json:"date_of_start" format:"date-time" example:"2021-01-01T00:00:00Z" validate:"required"`
	Phone       string    `json:"phone" validate:"required,max=13"`
	City        string    `json:"city" validate:"required,max=50"`
	Street      string    `json:"street" validate:"required,max=50"`
	Zip         string    `json:"zip" validate:"required,max=9"`
	Password    string    `json:"password"`
}
