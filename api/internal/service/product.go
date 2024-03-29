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
	existingProduct, err := s.storages.Product.GetProduct(product.ID)
	if err != nil {
		s.logger.Errorf("failed to get product: %v", err)
		return nil, err
	}
	if existingProduct != nil {
		s.logger.Infof("product already exists")
		return nil, ErrCreateProductAlreadyExists
	}

	category, err := s.storages.Product.GetProductCategory(product.CategoryID)
	if err != nil {
		s.logger.Errorf("failed to get product category: %v", err)
		return nil, err
	}
	if category == nil {
		s.logger.Infof("product category not found")
		return nil, ErrCreateProductCategoryNotFound
	}

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
	previousProduct, err := s.storages.Product.GetProduct(id)
	if err != nil {
		s.logger.Errorf("error getting product: %#v", err)
		return nil, err
	}
	if previousProduct == nil {
		s.logger.Infof("product not found")
		return nil, ErrUpdateProductNotFound
	}

	if product.ID != id {
		existingProduct, err := s.storages.Product.GetProduct(product.ID)
		if err != nil {
			s.logger.Errorf("error getting product: %#v", err)
			return nil, err
		}
		if existingProduct != nil {
			s.logger.Infof("product already exists")
			return nil, ErrUpdateProductAlreadyExists
		}
	}

	if product.CategoryID != previousProduct.CategoryID {
		category, err := s.storages.Product.GetProductCategory(product.CategoryID)
		if err != nil {
			s.logger.Errorf("failed to get product category: %v", err)
			return nil, err
		}
		if category == nil {
			s.logger.Infof("product category not found")
			return nil, ErrUpdateProductProductCategoryNotFound
		}
	}

	return s.storages.Product.UpdateProduct(id, product)
}

func (s *productService) DeleteProduct(id int) error {
	s.logger.Infof("deleting product: %#v", id)
	product, err := s.storages.Product.GetProduct(id)
	if err != nil {
		s.logger.Errorf("failed to get product: %v", err)
		return err
	}
	if product == nil {
		s.logger.Infof("product not found")
		return ErrDeleteProductNotFound
	}

	storeProducts, err := s.storages.Product.ListStoreProducts(&ListStoreProductsOptions{
		ProductID: &id,
	})
	if err != nil {
		s.logger.Errorf("failed to list store products: %v", err)
		return err
	}
	if len(storeProducts) > 0 {
		s.logger.Infof("product is used in store")
		return ErrDeleteProductStoreProductsExist
	}

	return s.storages.Product.DeleteProduct(id)
}

func (s *productService) CreateProductCategory(category *entity.ProductCategory) (*entity.ProductCategory, error) {
	existingCategory, err := s.storages.Product.GetProductCategory(category.ID)
	if err != nil {
		s.logger.Errorf("failed to get product category: %v", err)
		return nil, err
	}
	if existingCategory != nil {
		s.logger.Infof("product category already exists")
		return nil, ErrCreateProductCategoryAlreadyExists
	}
	s.logger.Infof("creating product category: %#v", category)
	return s.storages.Product.CreateProductCategory(category)
}

func (s *productService) ListProductCategories(opts *ListProductCategoriesOptions) ([]*entity.ProductCategory, error) {
	s.logger.Infof("listing product categories")
	return s.storages.Product.ListProductCategories(opts)
}

func (s *productService) UpdateProductCategory(id int, productCategory *entity.ProductCategory) (*entity.ProductCategory, error) {
	s.logger.Infof("updating productCategory category: %#v", productCategory)
	previousProductCategory, err := s.storages.Product.GetProductCategory(id)
	if err != nil {
		s.logger.Errorf("failed to get product category: %v", err)
		return nil, err
	}
	if previousProductCategory == nil {
		s.logger.Infof("product category not found")
		return nil, ErrUpdateProductCategoryNotFound
	}

	if productCategory.ID != id {
		existingProductCategory, err := s.storages.Product.GetProductCategory(productCategory.ID)
		if err != nil {
			s.logger.Errorf("error getting product category: %#v", err)
			return nil, err
		}
		if existingProductCategory != nil {
			s.logger.Infof("product category already exists")
			return nil, ErrUpdateProductCategoryAlreadyExists
		}
	}

	return s.storages.Product.UpdateProductCategory(id, productCategory)
}

func (s *productService) DeleteProductCategory(id int) error {
	s.logger.Infof("deleting product category: %#v", id)
	productCategory, err := s.storages.Product.GetProductCategory(id)
	if err != nil {
		s.logger.Errorf("failed to get product category: %v", err)
		return err
	}
	if productCategory == nil {
		s.logger.Infof("product category not found")
		return ErrDeleteProductCategoryNotFound
	}

	products, err := s.storages.Product.ListProducts(&ListProductsOptions{
		CategoryID: &id,
	})
	if err != nil {
		s.logger.Errorf("failed to list products: %v", err)
		return err
	}
	if len(products) > 0 {
		s.logger.Infof("product category has products")
		return ErrDeleteProductCategoryProductsExist
	}
	return s.storages.Product.DeleteProductCategory(id)
}

func (s *productService) CreateStoreProduct(storeProduct *entity.StoreProduct) (*CreateStoreProductOutput, error) {
	s.logger.Infof("creating store product: %#v", storeProduct)
	existingStoreProduct, err := s.storages.Product.GetStoreProduct(storeProduct.ID)
	if err != nil {
		s.logger.Errorf("failed to get store product: %v", err)
		return nil, err
	}
	if existingStoreProduct != nil {
		s.logger.Infof("store product already exists")
		return nil, ErrCreateStoreProductAlreadyExists
	}

	product, err := s.storages.Product.GetProduct(storeProduct.ProductID)
	if err != nil {
		s.logger.Errorf("failed to get product: %v", err)
		return nil, err
	}
	if product == nil {
		s.logger.Infof("product not found")
		return nil, ErrCreateStoreProductProductNotFound
	}

	if storeProduct.Promotional {
		if storeProduct.PromotionalID == nil {
			s.logger.Infof("promotional id is required")
			return nil, ErrCreateStoreProductPromotionalIDRequired
		}
		defaultStoreProduct, err := s.storages.Product.GetStoreProduct(*storeProduct.PromotionalID)
		if err != nil {
			s.logger.Errorf("failed to list store products: %v", err)
			return nil, err
		}
		if defaultStoreProduct == nil {
			s.logger.Infof("default store product not found")
			return nil, ErrCreateStoreProductDefaultStoreProductNotFound
		}
		s.logger.Infof("default store product: %#v", defaultStoreProduct)
		if defaultStoreProduct.Promotional {
			s.logger.Infof("default store product is promotional")
			return nil, ErrCreateStoreProductDefaultStoreProductIsPromotional
		}
		if defaultStoreProduct.ProductID != storeProduct.ProductID {
			s.logger.Infof("default store product has different product")
			return nil, ErrCreateStoreProductDefaultStoreProductHasDifferentProduct
		}
		if storeProduct.Count > defaultStoreProduct.Count {
			s.logger.Infof("promotional count cannot be greater than default count")
			return nil, ErrCreateStoreProductPromotionalCountCannotBeGreaterThanDefaultCount
		}
		defaultStoreProduct.Count -= storeProduct.Count
		storeProduct.Price = defaultStoreProduct.Price * 0.8

		_, err = s.storages.Product.UpdateStoreProduct(*storeProduct.PromotionalID, defaultStoreProduct)
		if err != nil {
			s.logger.Errorf("failed to update store product: %v", err)
			return nil, err
		}
		_, err = s.storages.Product.CreateStoreProduct(storeProduct)
		if err != nil {
			s.logger.Errorf("failed to create store product: %v", err)
			return nil, err
		}

		return &CreateStoreProductOutput{
			CreatedStoreProduct: storeProduct,
			UpdatedStoreProduct: defaultStoreProduct,
		}, err
	}

	storeProduct.PromotionalID = nil
	_, err = s.storages.Product.CreateStoreProduct(storeProduct)
	if err != nil {
		s.logger.Errorf("failed to create store product: %v", err)
		return nil, err
	}

	return &CreateStoreProductOutput{
		CreatedStoreProduct: storeProduct,
	}, nil
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
	previousStoreProduct, err := s.storages.Product.GetStoreProduct(id)
	if err != nil {
		s.logger.Errorf("error getting store product: %#v", err)
		return nil, err
	}
	if previousStoreProduct == nil {
		s.logger.Infof("store product not found")
		return nil, ErrUpdateStoreProductNotFound
	}

	if storeProduct.ID != id {
		existingStoreProduct, err := s.storages.Product.GetStoreProduct(storeProduct.ID)
		if err != nil {
			s.logger.Errorf("error getting store product: %#v", err)
			return nil, err
		}
		if existingStoreProduct != nil {
			s.logger.Infof("store product already exists")
			return nil, ErrUpdateStoreProductAlreadyExists
		}
	}

	if storeProduct.ProductID != previousStoreProduct.ProductID {
		s.logger.Infof("product id cannot be changed")
		return nil, ErrUpdateStoreProductProductIDCannotBeChanged
	}

	return s.storages.Product.UpdateStoreProduct(id, storeProduct)
}

func (s *productService) DeleteStoreProduct(id string) error {
	s.logger.Infof("deleting store product: %#v", id)
	storeProduct, err := s.storages.Product.GetStoreProduct(id)
	if err != nil {
		s.logger.Errorf("failed to get store product: %v", err)
		return err
	}
	if storeProduct == nil {
		s.logger.Infof("store product not found")
		return ErrDeleteStoreProductNotFound
	}

	checks, err := s.storages.Check.ListCheckItems(&ListCheckItemsOptions{
		StoreProductID: &id,
	})
	if err != nil {
		s.logger.Errorf("failed to get checks: %v", err)
		return err
	}
	if len(checks) > 0 {
		s.logger.Infof("card has checks")
		return ErrDeleteStoreProductCheckItemsExist
	}
	return s.storages.Product.DeleteStoreProduct(id)
}
