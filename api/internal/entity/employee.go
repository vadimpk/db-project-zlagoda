package entity

import "time"

type Employee struct {
	ID          string    `json:"id"`
	Surname     string    `json:"surname"`
	Name        string    `json:"name"`
	Patronymic  string    `json:"patronymic"`
	Role        string    `json:"role"`
	Salary      float64   `json:"salary"`
	DateOfBirth time.Time `json:"date_of_birth"`
	DateOfStart time.Time `json:"date_of_start"`
	Phone       string    `json:"phone"`
	City        string    `json:"city"`
	Street      string    `json:"street"`
	Zip         string    `json:"zip"`
}
