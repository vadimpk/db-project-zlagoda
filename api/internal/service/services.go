package service

import (
	"github.com/apsdehal/go-logger"
	"github.com/vadimpk/db-project-zlagoda/api/config"
	"github.com/vadimpk/db-project-zlagoda/api/internal/entity"
	"github.com/vadimpk/db-project-zlagoda/api/pkg/errs"
	"time"
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
	Statistics   StatisticsService
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
	ErrCreateEmployeeAlreadyExists = errs.New("Працівник з таким ID вже існує")

	ErrEmployeeNotFound            = errs.New("Працівника не знайдено")
	ErrEmployeeWithIDAlreadyExists = errs.New("Працівник з таким ID вже існує")

	ErrDeleteEmployeeChecksExist = errs.New("Працівник має чеки, видалення неможливе")

	ErrLoginEmployeeNotFound        = errs.New("Такого працівника не існує")
	ErrLoginEmployeeInvalidPassword = errs.New("Не вірний пароль")

	ErrVerifyAccessTokenInvalidAccessToken = errs.New("Не вірний токен")
	ErrVerifyAccessTokenEmployeeNotFound   = errs.New("Такого працівника не існує")
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
	ErrUpdateCardNotFound      = errs.New("Карта клієнта не знайдена")
	ErrUpdateCardAlreadyExists = errs.New("Карта клієнта з таким номером вже існує")

	ErrDeleteCardNotFound    = errs.New("Карта клієнта не знайдена")
	ErrDeleteCardChecksExist = errs.New("Карта клієнта має чеки, видалення неможливе")
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

	CreateStoreProduct(storeProduct *entity.StoreProduct) (*CreateStoreProductOutput, error)
	GetStoreProduct(id string) (*entity.StoreProduct, error)
	ListStoreProducts(opts *ListStoreProductsOptions) ([]*entity.StoreProduct, error)
	UpdateStoreProduct(id string, storeProduct *entity.StoreProduct) (*entity.StoreProduct, error)
	DeleteStoreProduct(id string) error
}

var (
	ErrCreateProductAlreadyExists           = errs.New("Такий товар вже існує")
	ErrCreateProductCategoryNotFound        = errs.New("Категорія товару не знайдена")
	ErrUpdateProductAlreadyExists           = errs.New("Такий товар вже існує")
	ErrUpdateProductProductCategoryNotFound = errs.New("Категорія товару не знайдена")
	ErrUpdateProductNotFound                = errs.New("Товар не знайдено, оновлення неможливе")
	ErrDeleteProductStoreProductsExist      = errs.New("Товар має товари в магазинах, видалення неможливе")
	ErrDeleteProductNotFound                = errs.New("Товар не знайдено, видалення неможливе")

	ErrCreateProductCategoryAlreadyExists = errs.New("Така категорія вже існує")
	ErrUpdateProductCategoryAlreadyExists = errs.New("Така категорія вже існує")
	ErrUpdateProductCategoryNotFound      = errs.New("Категорія не знайдена, оновлення неможливе")
	ErrDeleteProductCategoryProductsExist = errs.New("Категорія містить товари, видалення неможливе")
	ErrDeleteProductCategoryNotFound      = errs.New("Категорія не знайдена, видалення неможливе")

	ErrCreateStoreProductAlreadyExists                                   = errs.New("Такий товар в магазині вже існує")
	ErrCreateStoreProductProductNotFound                                 = errs.New("Товар не знайдено")
	ErrCreateStoreProductPromotionalIDRequired                           = errs.New("id не акційного товару обов'язкове")
	ErrCreateStoreProductDefaultStoreProductNotFound                     = errs.New("Не акційний товар не знайдено")
	ErrCreateStoreProductDefaultStoreProductIsPromotional                = errs.New("Не акційний товар є акційним")
	ErrCreateStoreProductDefaultStoreProductHasDifferentProduct          = errs.New("Не акційний товар має інший товар")
	ErrCreateStoreProductPromotionalCountCannotBeGreaterThanDefaultCount = errs.New("Кількість акційного товару не може бути більшою за кількість не акційного товару")

	ErrUpdateStoreProductAlreadyExists            = errs.New("Такий товар вже існує, оновлення неможливе")
	ErrUpdateStoreProductProductIDCannotBeChanged = errs.New("id товару не може бути змінено")

	ErrUpdateStoreProductNotFound        = errs.New("Товар не знайдено, оновлення неможливе")
	ErrDeleteStoreProductCheckItemsExist = errs.New("Товар використовується в чеках, видалення неможливе")
	ErrDeleteStoreProductNotFound        = errs.New("Товар не знайдено, видалення неможливе")
)

type CreateStoreProductOutput struct {
	CreatedStoreProduct *entity.StoreProduct `json:"createdStoreProduct"`
	UpdatedStoreProduct *entity.StoreProduct `json:"updatedStoreProduct"`
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
	ErrCreateCheckCustomerNotFound = errs.New("Клієнта не знайдено, додавання неможливе")
	ErrCreateCheckEmployeeNotFound = errs.New("Працівника не знайдено, додавання неможливе")

	ErrDeleteCheckNotFound              = errs.New("Чеку не знайдено, видалення неможливе")
	ErrCreateCheckItemProductNotFound   = errs.New("Товар не знайдено, додавання неможливе")
	ErrCreateCheckItemNotEnoughProducts = errs.New("Не достатньо товарів на складі")

	ErrUpdateCheckItemNotEnoughProducts = errs.New("Не достатньо товарів на складі")

	ErrDeleteCheckItemNotFound = errs.New("Товару в чеку не знайдено, видалення неможливе")
)

type CreateOrUpdateCheckItemOutput struct {
	CheckItem *entity.CheckItem
	Check     *entity.Check
	Product   *entity.StoreProduct
}

type ListChecksOptions struct {
	CardID     *string    `form:"cardID"`
	EmployeeID *string    `form:"employeeID"`
	StartDate  *time.Time `form:"startDate" format:"date-time" example:"2000-01-01T00:00:00Z"`
	EndDate    *time.Time `form:"endDate" format:"date-time" example:"2000-01-01T00:00:00Z"`
}

type ListCheckItemsOptions struct {
	CheckID        *string    `form:"checkID"`
	StoreProductID *string    `form:"storeProductID"`
	StartDate      *time.Time `form:"startDate" format:"date-time" example:"2000-01-01T00:00:00Z"`
	EndDate        *time.Time `form:"endDate" format:"date-time" example:"2000-01-01T00:00:00Z"`
}

type StatisticsService interface {
	GetSalesByCategory(opts *GetSalesByCategoryOptions) ([]*entity.CategorySale, error)
	GetEmployeesChecks(opts *GetEmployeesChecksOptions) ([]*entity.EmployeeCheck, error)
	GetCustomersBuyAllCategories(opts *GetCustomersBuyAllCategoriesOptions) ([]*entity.CustomerBuyAllCategories, error)
	GetCustomersChecks(opts *GetCustomersChecksOptions) ([]*entity.CustomerCheck, error)
}

type GetSalesByCategoryOptions struct {
	StartDate *time.Time `form:"startDate" format:"date-time" example:"2000-01-01T00:00:00Z"`
	EndDate   *time.Time `form:"endDate" format:"date-time" example:"2000-01-01T00:00:00Z"`
}

type GetEmployeesChecksOptions struct {
	StartDate *time.Time `form:"startDate" format:"date-time" example:"2000-01-01T00:00:00Z"`
	EndDate   *time.Time `form:"endDate" format:"date-time" example:"2000-01-01T00:00:00Z"`
}

type GetCustomersBuyAllCategoriesOptions struct {
	StartDate *time.Time `form:"startDate" format:"date-time" example:"2000-01-01T00:00:00Z"`
	EndDate   *time.Time `form:"endDate" format:"date-time" example:"2000-01-01T00:00:00Z"`
}

type GetCustomersChecksOptions struct {
	StartDate *time.Time `form:"startDate" format:"date-time" example:"2000-01-01T00:00:00Z"`
	EndDate   *time.Time `form:"endDate" format:"date-time" example:"2000-01-01T00:00:00Z"`
}
