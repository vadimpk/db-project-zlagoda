package service

import (
	"github.com/apsdehal/go-logger"
	"github.com/vadimpk/db-project-zlagoda/api/config"
	"github.com/vadimpk/db-project-zlagoda/api/internal/entity"
	"github.com/vadimpk/db-project-zlagoda/api/pkg/errs"
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
	Check        CheckStorage
}

type EmployeeService interface {
	Create(employee *entity.Employee) (*entity.Employee, error)
	Get(id string) (*entity.Employee, error)
	List(opts ListEmployeeOptions) ([]*entity.Employee, error)
	Update(id string, employee *entity.Employee) (*entity.Employee, error)
	Delete(ids []string) error

	Login(id string, password string) (*entity.Employee, string, error)
	VerifyAccessToken(authToken string) (*entity.Employee, error)
}

type ListEmployeeOptions struct {
	Search        *string `form:"search"`
	Role          *string `form:"role"`
	SortSurname   *bool   `form:"sortSurname"`
	SortAscending *bool   `form:"sortAscending"`
}

var (
	ErrLoginEmployeeNotFound        = errs.New("employee not found")
	ErrLoginEmployeeInvalidPassword = errs.New("invalid password")

	ErrVerifyAccessTokenInvalidAccessToken = errs.New("invalid access token")
	ErrVerifyAccessTokenEmployeeNotFound   = errs.New("employee not found")
)

type CustomerCardService interface {
	Create(card *entity.CustomerCard) (*entity.CustomerCard, error)
	Get(id string) (*entity.CustomerCard, error)
	List(opts ListCardOptions) ([]*entity.CustomerCard, error)
	Update(id string, card *entity.CustomerCard) (*entity.CustomerCard, error)
	Delete(ids []string) error
}

type ListCardOptions struct {
	Search        *string `form:"search"`
	Discount      *int    `form:"discount"`
	SortSurname   *bool   `form:"sortSurname"`
	SortAscending *bool   `form:"sortAscending"`
}

type ProductService interface {
	CreateProduct(product *entity.Product) (*entity.Product, error)
	GetProduct(id int) (*entity.Product, error)
	ListProducts(opts *ListProductsOptions) ([]*entity.Product, error)
	UpdateProduct(id int, product *entity.Product) (*entity.Product, error)
	DeleteProducts(ids []int) error

	CreateProductCategory(category *entity.ProductCategory) (*entity.ProductCategory, error)
	ListProductCategories(opts *ListProductCategoriesOptions) ([]*entity.ProductCategory, error)
	UpdateProductCategory(id int, product *entity.ProductCategory) (*entity.ProductCategory, error)
	DeleteProductCategories(ids []int) error

	CreateStoreProduct(storeProduct *entity.StoreProduct) (*entity.StoreProduct, error)
	GetStoreProduct(id string) (*entity.StoreProduct, error)
	ListStoreProducts(opts *ListStoreProductsOptions) ([]*entity.StoreProduct, error)
	UpdateStoreProduct(id string, storeProduct *entity.StoreProduct) (*entity.StoreProduct, error)
	DeleteStoreProducts(ids []string) error
}

type ListProductsOptions struct {
	Search        *string `form:"search"`
	CategoryID    *int    `form:"categoryID"`
	SortName      *bool   `form:"sortName"`
	SortAscending *bool   `form:"sortAscending"`
}

type SortProductsOptions struct {
	Name      *bool `form:"name"`
	Category  *bool `form:"category"`
	Ascending *bool `form:"ascending"`
}

type ListProductCategoriesOptions struct {
	Search        *string `form:"search"`
	SortName      *bool   `form:"sortName"`
	SortAscending *bool   `form:"sortAscending"`
}

type ListStoreProductsOptions struct {
	Search        *string `form:"search"`
	CategoryID    *int    `form:"categoryID"`
	Promotion     *bool   `form:"promotion"`
	SortName      *bool   `form:"sortName"`
	SortCount     *bool   `form:"sortCount"`
	SortPrice     *bool   `form:"sortPrice"`
	SortAscending *bool   `form:"sortAscending"`
}

type CheckService interface {
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

type ListChecksOptions struct {
	Search *string
}

type ListCheckItemsOptions struct {
	Search *string
}
