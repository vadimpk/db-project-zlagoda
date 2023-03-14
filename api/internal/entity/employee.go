package entity

import "time"

type Employee struct {
	ID          int       `json:"id"`
	Surname     string    `json:"surname"`
	Name        string    `json:"name"`
	Patronymic  string    `json:"patronymic"`
	Role        string    `json:"role"`
	Salary      float64   `json:"salary"`
	DateOfBirth time.Time `json:"date_of_birth" format:"date-time" example:"2000-01-01T00:00:00Z" validate:"required"`
	DateOfStart time.Time `json:"date_of_start" format:"date-time" example:"2021-01-01T00:00:00Z" validate:"required"`
	Phone       string    `json:"phone"`
	City        string    `json:"city"`
	Street      string    `json:"street"`
	Zip         string    `json:"zip"`
}
