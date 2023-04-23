package entity

type CategorySale struct {
	CategoryNumber    int
	CategoryName      string
	TotalSales        int
	AvgDiscount       float64
	TotalProductsSold int
	AvgSellingPrice   float64
}

type EmployeeCheck struct {
	IdEmployee         string
	EmplSurname        string
	EmplName           string
	CheckCount         int
	TotalCheckPrice    float64
	AverageCheckPrice  float64
	TotalDiscount      float64
	DifferentCustomers int
}

type CustomerBuyAllCategories struct {
	CustomerCardID  string
	CustomerName    string
	CustomerSurname string
	CustomerPatr    string
}
