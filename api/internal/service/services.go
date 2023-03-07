package service

import (
	"github.com/apsdehal/go-logger"
	"github.com/vadimpk/db-project-zlagoda/api/config"
	"github.com/vadimpk/db-project-zlagoda/api/internal/entity"
)

type Options struct {
	Logger   *logger.Logger
	Config   *config.Config
	Storages Storages
}

type Services struct {
	Employee     EmployeeService
	CustomerCard CustomerCardService
	Product      ProductService
}

type EmployeeService interface {
	Get(id string) (*entity.Employee, error)
}
type CustomerCardService interface {
	Get(id string) (*entity.CustomerCard, error)
}

type ProductService interface {
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

type ListProductsOptions struct {
	Search     *string
	CategoryID *string
	Sort       SortProductsOptions
}

type SortProductsOptions struct {
	Name      *bool
	Category  *bool
	Ascending *bool
}

type ListProductCategoriesOptions struct {
	Search *string
	Sort   SortProductCategoriesOptions
}

type SortProductCategoriesOptions struct {
	Name      *bool
	Ascending *bool
}

type ListStoreProductsOptions struct {
	Search    *string
	Promotion *bool
	Sort      SortStoreProductsOptions
}

type SortStoreProductsOptions struct {
	Name      *bool
	Price     *bool
	Ascending *bool
}
