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
	Check        CheckService
}

type EmployeeService interface {
	Create(employee *entity.Employee) (*entity.Employee, error)
	Get(id string) (*entity.Employee, error)
	List(opts ListEmployeeOptions) ([]*entity.Employee, error)
	Update(id string, employee *entity.Employee) (*entity.Employee, error)
	Delete(id string) error

	Login(id string, password string) (*entity.Employee, string, error)
	VerifyAccessToken(authToken string) (*entity.Employee, error)
}

var (
	ErrCreateEmployeeAlreadyExists = errs.New("employee already exists")

	ErrEmployeeNotFound            = errs.New("employee not found")
	ErrEmployeeWithIDAlreadyExists = errs.New("employee with id already exists")

	ErrDeleteEmployeeChecksExist = errs.New("employee has checks")

	ErrLoginEmployeeNotFound        = errs.New("employee not found")
	ErrLoginEmployeeInvalidPassword = errs.New("invalid password")

	ErrVerifyAccessTokenInvalidAccessToken = errs.New("invalid access token")
	ErrVerifyAccessTokenEmployeeNotFound   = errs.New("employee not found")
)

type ListEmployeeOptions struct {
	Search        *string `form:"search"`
	Role          *string `form:"role"`
	SortSurname   *bool   `form:"sortSurname"`
	SortAscending *bool   `form:"sortAscending"`
}

type CustomerCardService interface {
	Create(card *entity.CustomerCard) (*entity.CustomerCard, error)
	Get(id string) (*entity.CustomerCard, error)
	List(opts ListCardOptions) ([]*entity.CustomerCard, error)
	Update(id string, card *entity.CustomerCard) (*entity.CustomerCard, error)
	Delete(id string) error
}

var (
	ErrUpdateCardNotFound      = errs.New("card not found")
	ErrUpdateCardAlreadyExists = errs.New("card already exists")

	ErrDeleteCardNotFound    = errs.New("card not found")
	ErrDeleteCardChecksExist = errs.New("card has checks")
)

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
	DeleteProduct(id int) error

	CreateProductCategory(category *entity.ProductCategory) (*entity.ProductCategory, error)
	ListProductCategories(opts *ListProductCategoriesOptions) ([]*entity.ProductCategory, error)
	UpdateProductCategory(id int, product *entity.ProductCategory) (*entity.ProductCategory, error)
	DeleteProductCategory(id int) error

	CreateStoreProduct(storeProduct *entity.StoreProduct) (*entity.StoreProduct, error)
	GetStoreProduct(id string) (*entity.StoreProduct, error)
	ListStoreProducts(opts *ListStoreProductsOptions) ([]*entity.StoreProduct, error)
	UpdateStoreProduct(id string, storeProduct *entity.StoreProduct) (*entity.StoreProduct, error)
	DeleteStoreProduct(id string) error
}

var (
	ErrCreateProductAlreadyExists      = errs.New("product with such id already exists")
	ErrUpdateProductAlreadyExists      = errs.New("product with such id already exists")
	ErrUpdateProductNotFound           = errs.New("product not found")
	ErrDeleteProductStoreProductsExist = errs.New("store products exist")
	ErrDeleteProductNotFound           = errs.New("product not found")
	ErrDeleteProductCategoryNotFound   = errs.New("product category not found")

	ErrCreateProductCategoryAlreadyExists = errs.New("product category with such id already exists")
	ErrUpdateProductCategoryAlreadyExists = errs.New("product category with such id already exists")
	ErrUpdateProductCategoryNotFound      = errs.New("product category not found")
	ErrDeleteProductCategoryProductsExist = errs.New("products exist")

	ErrCreateStoreProductAlreadyExists   = errs.New("store product already exists")
	ErrUpdateStoreProductAlreadyExists   = errs.New("store product already exists")
	ErrUpdateStoreProductNotFound        = errs.New("store product not found")
	ErrDeleteStoreProductCheckItemsExist = errs.New("check items exist")
	ErrDeleteStoreProductNotFound        = errs.New("store product not found")
)

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
	ProductID     *int    `form:"productID"`
	Promotion     *bool   `form:"promotion"`
	SortName      *bool   `form:"sortName"`
	SortCount     *bool   `form:"sortCount"`
	SortPrice     *bool   `form:"sortPrice"`
	SortAscending *bool   `form:"sortAscending"`
}

type CheckService interface {
	CreateCheck(check *entity.Check) (*entity.Check, error)
	GetCheck(id string) (*entity.Check, error)
	ListChecks(opts *ListChecksOptions) ([]*entity.Check, error)
	//UpdateCheck(id string, check *entity.Check) (*entity.Check, error)
	DeleteCheck(id string) error

	CreateCheckItem(checkItem *entity.CheckItem) (CreateOrUpdateCheckItemOutput, error)
	GetCheckItem(id entity.CheckItemID) (*entity.CheckItem, error)
	ListCheckItems(opts *ListCheckItemsOptions) ([]*entity.CheckItem, error)
	UpdateCheckItem(id entity.CheckItemID, checkItem *entity.CheckItem) (CreateOrUpdateCheckItemOutput, error)
	DeleteCheckItem(id entity.CheckItemID) (CreateOrUpdateCheckItemOutput, error)
}

var (
	ErrDeleteCheckNotFound              = errs.New("check not found")
	ErrCreateCheckItemProductNotFound   = errs.New("product not found")
	ErrCreateCheckItemNotEnoughProducts = errs.New("not enough products")

	ErrUpdateCheckItemNotEnoughProducts = errs.New("not enough products")

	ErrDeleteCheckItemNotFound = errs.New("check item not found")
)

type CreateOrUpdateCheckItemOutput struct {
	CheckItem *entity.CheckItem
	Check     *entity.Check
	Product   *entity.StoreProduct
}

type ListChecksOptions struct {
	CardID     *string `form:"cardID"`
	EmployeeID *string `form:"employeeID"`
	StartDate  *string `form:"startDate"`
	EndDate    *string `form:"endDate"`
}

type ListCheckItemsOptions struct {
	CheckID        *string `form:"checkID"`
	StoreProductID *string `form:"storeProductID"`
	StartDate      *string `form:"startDate"`
	EndDate        *string `form:"endDate"`
}
