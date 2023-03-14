package entity

type CustomerCard struct {
	ID          int    `json:"id"`
	Surname     string `json:"surname"`
	Name        string `json:"name"`
	Patronymic  string `json:"patronymic"`
	PhoneNumber string `json:"phone_number"`
	City        string `json:"city"`
	Street      string `json:"street"`
	Zip         string `json:"zip_code"`
	Discount    int    `json:"discount"`
}
