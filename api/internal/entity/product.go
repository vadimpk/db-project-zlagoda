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
	PromotionalID *string `json:"promotional_id" validate:"max=12"`
	ProductID     int     `json:"product_id" validate:"required"`
	Price         float64 `json:"price" validate:"required"`
	Count         int     `json:"count" validate:"required"`
	Promotional   bool    `json:"promotional" validate:"required"`
}
