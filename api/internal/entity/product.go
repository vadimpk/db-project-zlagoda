package entity

type Product struct {
	ID              int    `json:"id" validate:"required"`
	Name            string `json:"name" validate:"required,max=50"`
	Characteristics string `json:"characteristics" validate:"required,max=100"`

	CategoryID int `json:"category_id" validate:"required"`
}

type ProductCategory struct {
	ID   int    `json:"id" validate:"required"`
	Name string `json:"name" validate:"required,max=50"`
}

type StoreProduct struct {
	ID            string  `json:"id" validate:"required,max=12"`
	PromotionalID *string `json:"promotional_id" validate:"omitempty,max=12"`
	ProductID     int     `json:"product_id"`
	Price         float64 `json:"price"`
	Count         int     `json:"count"`
	Promotional   bool    `json:"promotional"`
}
