package service

import (
	"github.com/vadimpk/db-project-zlagoda/api/internal/entity"
)

type Storages struct {
	Employee     EmployeeStorage
	CustomerCard CustomerCardStorage
	Product      ProductStorage
}

type EmployeeStorage interface {
	Get(id string) (*entity.Employee, error)
}

type CustomerCardStorage interface {
	Create(card *entity.CustomerCard) (*entity.CustomerCard, error)
	Get(id string) (*entity.CustomerCard, error)
	List(opts ListCardOptions) ([]*entity.CustomerCard, error)
	Update(id string, card *entity.CustomerCard) (*entity.CustomerCard, error)
	Delete(ids []string) error
}

type ProductStorage interface {
	CreateProduct(product *entity.Product) (*entity.Product, error)
	GetProduct(id string) (*entity.Product, error)
	ListProducts(opts ListProductsOptions) ([]*entity.Product, error)
	UpdateProduct(id string, product *entity.Product) (*entity.Product, error)
	DeleteProducts(ids []string) error

	CreateProductCategory(category *entity.ProductCategory) (*entity.ProductCategory, error)
	ListProductCategories() (*entity.Product, error)
	UpdateProductCategory(id string, product *entity.ProductCategory) (*entity.ProductCategory, error)
	DeleteProductCategories(ids []string) error

	CreateStoreProduct(storeProduct *entity.StoreProduct) (*entity.StoreProduct, error)
	GetStoreProduct(id string) (*entity.StoreProduct, error)
	ListStoreProducts(opts ListStoreProductsOptions) ([]*entity.StoreProduct, error)
	UpdateStoreProduct(id string, storeProduct *entity.StoreProduct) (*entity.StoreProduct, error)
	DeleteStoreProducts(ids []string) error
}
