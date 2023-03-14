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
	Create(employee *entity.Employee) (*entity.Employee, error)
	Get(id int) (*entity.Employee, error)
	List(opts ListEmployeeOptions) ([]*entity.Employee, error)
	Update(id int, employee *entity.Employee) (*entity.Employee, error)
	Delete(ids []int) error
}

type CustomerCardService interface {
	Create(card *entity.CustomerCard) (*entity.CustomerCard, error)
	Get(id int) (*entity.CustomerCard, error)
	List(opts ListCardOptions) ([]*entity.CustomerCard, error)
	Update(id int, card *entity.CustomerCard) (*entity.CustomerCard, error)
	Delete(ids []int) error
}

type ProductService interface {
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

type ListEmployeeOptions struct {
	Search *string
	Sort   SortEmployeeOptions
}

type SortEmployeeOptions struct {
	Surname     *bool
	Name        *bool
	Patronymic  *bool
	Role        *bool
	Salary      *bool
	DateOfBirth *bool
	DateOfStart *bool
	Phone       *bool
	City        *bool
	Street      *bool
	Zip         *bool
}

type ListCardOptions struct {
	Search *string
	Sort   SortCardOptions
}

type SortCardOptions struct {
	Name       *bool
	Surname    *bool
	Patronymic *bool
	Phone      *bool
	City       *bool
	Street     *bool
	Zip        *bool
	Discount   *bool
	Ascending  *bool
}

type ListProductsOptions struct {
	Search     *string
	CategoryID *int
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
