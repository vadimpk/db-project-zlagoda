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
	Create(employee *entity.Employee) (*entity.Employee, error)
	Get(id int) (*entity.Employee, error)
	List(opts ListEmployeeOptions) ([]*entity.Employee, error)
	Update(id int, employee *entity.Employee) (*entity.Employee, error)
	Delete(ids []int) error
}

type CustomerCardStorage interface {
	Create(card *entity.CustomerCard) (*entity.CustomerCard, error)
	Get(id int) (*entity.CustomerCard, error)
	List(opts ListCardOptions) ([]*entity.CustomerCard, error)
	Update(id int, card *entity.CustomerCard) (*entity.CustomerCard, error)
	Delete(ids []int) error
}

type ProductStorage interface {
	CreateProduct(product *entity.Product) (*entity.Product, error)
	GetProduct(id int) (*entity.Product, error)
	ListProducts(opts ListProductsOptions) ([]*entity.Product, error)
	UpdateProduct(id int, product *entity.Product) (*entity.Product, error)
	DeleteProducts(ids []int) error

	CreateProductCategory(category *entity.ProductCategory) (*entity.ProductCategory, error)
	ListProductCategories() (*entity.Product, error)
	UpdateProductCategory(id int, product *entity.ProductCategory) (*entity.ProductCategory, error)
	DeleteProductCategories(ids []int) error

	CreateStoreProduct(storeProduct *entity.StoreProduct) (*entity.StoreProduct, error)
	GetStoreProduct(id string) (*entity.StoreProduct, error)
	ListStoreProducts(opts ListStoreProductsOptions) ([]*entity.StoreProduct, error)
	UpdateStoreProduct(id string, storeProduct *entity.StoreProduct) (*entity.StoreProduct, error)
	DeleteStoreProducts(ids []string) error
}
