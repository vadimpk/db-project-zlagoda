package entity

type CustomerCard struct {
	ID          string `json:"id"`
	Surname     string `json:"surname" validate:"required,max=50"`
	Name        string `json:"name" validate:"required,max=50"`
	Patronymic  string `json:"patronymic" validate:"required,max=50"`
	PhoneNumber string `json:"phone_number" validate:"required,max=13"`
	City        string `json:"city" validate:"required,max=50"`
	Street      string `json:"street" validate:"required,max=50"`
	Zip         string `json:"zip_code" validate:"required,max=9"`
	Discount    int    `json:"discount"`
}
