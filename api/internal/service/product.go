package service

import (
	"github.com/apsdehal/go-logger"
	"github.com/vadimpk/db-project-zlagoda/api/config"
	"github.com/vadimpk/db-project-zlagoda/api/internal/entity"
)

type productService struct {
	logger   *logger.Logger
	config   *config.Config
	storages Storages
}

func NewProductService(opts Options) ProductService {
	return &productService{
		logger:   opts.Logger,
		storages: opts.Storages,
		config:   opts.Config,
	}
}

var _ ProductService = (*productService)(nil)

func (s *productService) CreateProduct(product *entity.Product) (*entity.Product, error) {
	s.logger.Infof("creating product: %#v", product)
	return s.storages.Product.CreateProduct(product)
}

func (s *productService) GetProduct(id int) (*entity.Product, error) {
	s.logger.Infof("getting product: %#v", id)
	return s.storages.Product.GetProduct(id)
}

func (s *productService) ListProducts(opts *ListProductsOptions) ([]*entity.Product, error) {
	s.logger.Infof("listing products: %#v", opts)
	return s.storages.Product.ListProducts(opts)
}

func (s *productService) UpdateProduct(id int, product *entity.Product) (*entity.Product, error) {
	s.logger.Infof("updating product: %#v", product)
	return s.storages.Product.UpdateProduct(id, product)
}

func (s *productService) DeleteProducts(ids []int) error {
	s.logger.Infof("deleting products: %#v", ids)
	return s.storages.Product.DeleteProducts(ids)
}

func (s *productService) CreateProductCategory(category *entity.ProductCategory) (*entity.ProductCategory, error) {
	s.logger.Infof("creating product category: %#v", category)
	return s.storages.Product.CreateProductCategory(category)
}

func (s *productService) ListProductCategories(opts *ListProductCategoriesOptions) ([]*entity.ProductCategory, error) {
	s.logger.Infof("listing product categories")
	return s.storages.Product.ListProductCategories(opts)
}

func (s *productService) UpdateProductCategory(id int, product *entity.ProductCategory) (*entity.ProductCategory, error) {
	s.logger.Infof("updating product category: %#v", product)
	return s.storages.Product.UpdateProductCategory(id, product)
}

func (s *productService) DeleteProductCategories(ids []int) error {
	s.logger.Infof("deleting product categories: %#v", ids)
	return s.storages.Product.DeleteProductCategories(ids)
}

func (s *productService) CreateStoreProduct(storeProduct *entity.StoreProduct) (*entity.StoreProduct, error) {
	s.logger.Infof("creating store product: %#v", storeProduct)
	return s.storages.Product.CreateStoreProduct(storeProduct)
}

func (s *productService) GetStoreProduct(id string) (*entity.StoreProduct, error) {
	s.logger.Infof("getting store product: %#v", id)
	return s.storages.Product.GetStoreProduct(id)
}

func (s *productService) ListStoreProducts(opts *ListStoreProductsOptions) ([]*entity.StoreProduct, error) {
	s.logger.Infof("listing store products: %#v", opts)
	return s.storages.Product.ListStoreProducts(opts)
}

func (s *productService) UpdateStoreProduct(id string, storeProduct *entity.StoreProduct) (*entity.StoreProduct, error) {
	s.logger.Infof("updating store product: %#v", storeProduct)
	return s.storages.Product.UpdateStoreProduct(id, storeProduct)
}

func (s *productService) DeleteStoreProducts(ids []string) error {
	s.logger.Infof("deleting store products: %#v", ids)
	return s.storages.Product.DeleteStoreProducts(ids)
}
