package service

import (
	"github.com/vadimpk/db-project-zlagoda/api/internal/entity"
)

type Storages struct {
	Employee     EmployeeStorage
	CustomerCard CustomerCardStorage
	Product      ProductStorage
	Check        CheckStorage
}

type EmployeeStorage interface {
	Create(employee *entity.Employee) (*entity.Employee, error)
	Get(id string) (*entity.Employee, error)
	List(opts ListEmployeeOptions) ([]*entity.Employee, error)
	Update(id string, employee *entity.Employee) (*entity.Employee, error)
	Delete(ids []string) error
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

type CheckStorage interface {
	CreateCheck(check *entity.Check) (*entity.Check, error)
	GetCheck(id string) (*entity.Check, error)
	ListChecks(opts ListChecksOptions) ([]*entity.Check, error)
	UpdateCheck(id string, check *entity.Check) (*entity.Check, error)
	DeleteChecks(ids []string) error

	CreateCheckItem(checkItem *entity.CheckItem) (*entity.CheckItem, error)
	GetCheckItem(id entity.CheckItemID) (*entity.CheckItem, error)
	ListCheckItems(opts ListCheckItemsOptions) ([]*entity.CheckItem, error)
	UpdateCheckItem(id entity.CheckItemID, checkItem *entity.CheckItem) (*entity.CheckItem, error)
	DeleteCheckItems(ids []entity.CheckItemID) error
}
