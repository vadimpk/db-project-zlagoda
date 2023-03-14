package storage

import (
	"database/sql"
	"github.com/apsdehal/go-logger"
	"github.com/vadimpk/db-project-zlagoda/api/internal/entity"
	"github.com/vadimpk/db-project-zlagoda/api/internal/service"
)

type productStorage struct {
	logger *logger.Logger
	db     *sql.DB
}

func NewProductStorage(logger *logger.Logger, db *sql.DB) service.ProductStorage {
	return &productStorage{
		logger: logger,
		db:     db,
	}
}

var _ service.ProductStorage = (*productStorage)(nil)

func (s *productStorage) CreateProduct(product *entity.Product) (*entity.Product, error) {
	_, err := s.db.Exec("INSERT INTO product (id_product, fk_category_number, product_name, product_characteristics) VALUES ($1, $2, $3, $4)",
		product.ID, product.CategoryID, product.Name, product.Characteristics)
	if err != nil {
		s.logger.Errorf("error while creating product: %s", err)
		return nil, err
	}
	return product, err
}

func (s *productStorage) GetProduct(id string) (*entity.Product, error) {
	product := entity.Product{}
	err := s.db.QueryRow("SELECT * FROM product WHERE id_product = $1", id).
		Scan(&product.ID, &product.CategoryID, &product.Name, &product.Characteristics)
	if err != nil {
		s.logger.Errorf("error while getting product: %s", err)
	}
	return &product, nil
}

func (s *productStorage) ListProducts(opts service.ListProductsOptions) ([]*entity.Product, error) {
	_, err := s.db.Exec("SELECT * FROM product")
	if err != nil {
		s.logger.Errorf("error while listing products: %s", err)
		return nil, err
	}
	return nil, err // TODO : return LIST OF PRODUCTS
}

func (s *productStorage) UpdateProduct(id string, product *entity.Product) (*entity.Product, error) {
	_, err := s.db.Exec("UPDATE product SET fk_category_number = $1, product_name = $2, product_characteristics = $3 WHERE id_product = $4",
		product.CategoryID, product.Name, product.Characteristics, id)
	if err != nil {
		s.logger.Errorf("error while updating product: %s", err)
		return nil, err
	}
	return product, err
}

func (s *productStorage) DeleteProducts(ids []string) error {
	_, err := s.db.Exec("DELETE FROM product WHERE id_product = ANY($1)", ids)
	if err != nil {
		s.logger.Errorf("error while deleting products: %s", err)
		return err
	}
	return nil
}

func (s *productStorage) CreateProductCategory(category *entity.ProductCategory) (*entity.ProductCategory, error) {
	_, err := s.db.Exec("INSERT INTO category (category_number, category_name) VALUES ($1, $2)",
		category.ID, category.Name)
	if err != nil {
		s.logger.Errorf("error while creating product category: %s", err)
		return nil, err
	}
	return category, err
}

func (s *productStorage) ListProductCategories() (*entity.Product, error) {
	_, err := s.db.Exec("SELECT * FROM category")
	if err != nil {
		s.logger.Errorf("error while listing product categories: %s", err)
		return nil, err
	}
	return nil, err // TODO : return LIST OF PRODUCT CATEGORIES
}

func (s *productStorage) UpdateProductCategory(id string, product *entity.ProductCategory) (*entity.ProductCategory, error) {
	_, err := s.db.Exec("UPDATE category SET category_name = $1 WHERE category_number = $2",
		product.Name, id)
	if err != nil {
		s.logger.Errorf("error while updating product category: %s", err)
		return nil, err
	}
	return product, err
}

func (s *productStorage) DeleteProductCategories(ids []string) error {
	_, err := s.db.Exec("DELETE FROM category WHERE category_number = ANY($1)", ids)
	if err != nil {
		s.logger.Errorf("error while deleting product categories: %s", err)
		return err
	}
	return nil
}

func (s *productStorage) CreateStoreProduct(storeProduct *entity.StoreProduct) (*entity.StoreProduct, error) {
	_, err := s.db.Exec("INSERT INTO store_product (upc, fk_upc_prom, fk_id_product, selling_price, promotional_product) VALUES ($1, $2, $3, $4, $5)",
		storeProduct.ID, storeProduct.PromotionalID, storeProduct.ProductID, storeProduct.Price, storeProduct.Promotional)
	if err != nil {
		s.logger.Errorf("error while creating store product: %s", err)
		return nil, err
	}
	return storeProduct, err
}

func (s *productStorage) GetStoreProduct(id string) (*entity.StoreProduct, error) {
	storeProduct := entity.StoreProduct{}
	err := s.db.QueryRow("SELECT * FROM store_product WHERE upc = $1", id).
		Scan(&storeProduct.ID, &storeProduct.PromotionalID, &storeProduct.ProductID, &storeProduct.Price, &storeProduct.Promotional)
	if err != nil {
		s.logger.Errorf("error while getting store product: %s", err)
	}
	return &storeProduct, nil
}

func (s *productStorage) ListStoreProducts(opts service.ListStoreProductsOptions) ([]*entity.StoreProduct, error) {
	_, err := s.db.Exec("SELECT * FROM store_product")
	if err != nil {
		s.logger.Errorf("error while listing store products: %s", err)
		return nil, err
	}
	return nil, err // TODO : return LIST OF STORE PRODUCTS
}

func (s *productStorage) UpdateStoreProduct(id string, storeProduct *entity.StoreProduct) (*entity.StoreProduct, error) {
	_, err := s.db.Exec("UPDATE store_product SET fk_upc_prom = $1, fk_id_product = $2, selling_price = $3, promotional_product = $4 WHERE upc = $5",
		storeProduct.PromotionalID, storeProduct.ProductID, storeProduct.Price, storeProduct.Promotional, id)
	if err != nil {
		s.logger.Errorf("error while updating store product: %s", err)
		return nil, err
	}
	return storeProduct, err
}

func (s *productStorage) DeleteStoreProducts(ids []string) error {
	_, err := s.db.Exec("DELETE FROM store_product WHERE upc = ANY($1)", ids)
	if err != nil {
		s.logger.Errorf("error while deleting store products: %s", err)
		return err
	}
	return nil
}
