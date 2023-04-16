package entity

import "time"

type Check struct {
	ID             string  `json:"id"`
	EmployeeID     string  `json:"employee_id"`
	CustomerCardID *string `json:"customer_card_id"`

	Date       time.Time `json:"date" format:"date-time"`
	TotalPrice float64   `json:"total_price"`
	VAT        float64   `json:"vat"`
}

type CheckItem struct {
	ID CheckItemID `json:"id"`

	ProductCount int     `json:"product_count"`
	ProductPrice float64 `json:"product_price"`
}

type CheckItemID struct {
	StoreProductID string `json:"store_product_id"`
	CheckID        string `json:"check_id"`
}
