package entity

type Product struct {
	ID              int    `json:"id"`
	Name            string `json:"name"`
	Characteristics string `json:"characteristics"`

	CategoryID int `json:"category_id"`
}

type ProductCategory struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type StoreProduct struct {
	ID            string  `json:"id"`
	PromotionalID *string `json:"promotional_id"`
	ProductID     int     `json:"product_id"`
	Price         float64 `json:"price"`
	Count         int     `json:"count"`
	Promotional   bool    `json:"promotional"`
}
