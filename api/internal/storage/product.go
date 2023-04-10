package storage

import (
	"database/sql"
	"fmt"
	"github.com/apsdehal/go-logger"
	"github.com/vadimpk/db-project-zlagoda/api/internal/entity"
	"github.com/vadimpk/db-project-zlagoda/api/internal/service"
	"strings"
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

func (s *productStorage) GetProduct(id int) (*entity.Product, error) {
	product := entity.Product{}
	err := s.db.QueryRow("SELECT * FROM product WHERE id_product = $1", id).
		Scan(&product.ID, &product.CategoryID, &product.Name, &product.Characteristics)
	if err != nil {
		s.logger.Errorf("error while getting product: %s", err)
	}
	return &product, nil
}

func (s *productStorage) ListProducts(opts *service.ListProductsOptions) ([]*entity.Product, error) {
	var products []*entity.Product
	var query strings.Builder
	var args []interface{}

	query.WriteString("SELECT * FROM product WHERE 1=1")

	if opts.Search != nil {
		query.WriteString(" AND product_name ILIKE $1")
		args = append(args, "%"+*opts.Search+"%")
	}

	nextArgIndex := len(args) + 1

	if opts.CategoryID != nil {
		query.WriteString(fmt.Sprintf(" AND fk_category_number = $%d", nextArgIndex))
		args = append(args, *opts.CategoryID)
		nextArgIndex++
	}

	if opts.SortName != nil {
		query.WriteString(" ORDER BY product_name")
		if opts.SortAscending != nil && *opts.SortAscending {
			query.WriteString(" ASC")
		} else {
			query.WriteString(" DESC")
		}
	}

	rows, err := s.db.Query(query.String(), args...)
	if err != nil {
		s.logger.Errorf("error while listing customer cards: %s", err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		product := entity.Product{}
		err := rows.Scan(&product.ID, &product.CategoryID, &product.Name, &product.Characteristics)
		if err != nil {
			s.logger.Errorf("error while scanning customer card row: %s", err)
			return nil, err
		}
		products = append(products, &product)
	}

	return products, nil
}

func (s *productStorage) UpdateProduct(id int, product *entity.Product) (*entity.Product, error) {
	_, err := s.db.Exec("UPDATE product SET fk_category_number = $1, product_name = $2, product_characteristics = $3 WHERE id_product = $4",
		product.CategoryID, product.Name, product.Characteristics, id)
	if err != nil {
		s.logger.Errorf("error while updating product: %s", err)
		return nil, err
	}
	return product, err
}

func (s *productStorage) DeleteProduct(id int) error {
	_, err := s.db.Exec("DELETE FROM product WHERE id_product = $1", id)
	if err != nil {
		s.logger.Errorf("error while deleting product: %s", err)
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

func (s *productStorage) GetProductCategory(id int) (*entity.ProductCategory, error) {
	category := entity.ProductCategory{}
	err := s.db.QueryRow("SELECT * FROM category WHERE category_number = $1", id).
		Scan(&category.ID, &category.Name)
	if err != nil {
		s.logger.Errorf("error while getting product category: %s", err)
	}
	return &category, nil
}

func (s *productStorage) ListProductCategories(opts *service.ListProductCategoriesOptions) ([]*entity.ProductCategory, error) {
	var categories []*entity.ProductCategory
	var query strings.Builder
	var args []interface{}

	query.WriteString("SELECT * FROM category WHERE 1=1")

	if opts.Search != nil {
		query.WriteString(" AND category_name ILIKE $1")
		args = append(args, "%"+*opts.Search+"%")
	}

	if opts.SortName != nil {
		query.WriteString(" ORDER BY category_name")
		if opts.SortAscending != nil && *opts.SortAscending {
			query.WriteString(" ASC")
		} else {
			query.WriteString(" DESC")
		}
	}

	rows, err := s.db.Query(query.String(), args...)
	if err != nil {
		s.logger.Errorf("error while listing products' categories: %s", err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		category := entity.ProductCategory{}
		err := rows.Scan(&category.ID, &category.Name)
		if err != nil {
			s.logger.Errorf("error while scanning products' categories row: %s", err)
			return nil, err
		}
		categories = append(categories, &category)
	}

	return categories, nil
}

func (s *productStorage) UpdateProductCategory(id int, product *entity.ProductCategory) (*entity.ProductCategory, error) {
	_, err := s.db.Exec("UPDATE category SET category_name = $1 WHERE category_number = $2",
		product.Name, id)
	if err != nil {
		s.logger.Errorf("error while updating product category: %s", err)
		return nil, err
	}
	return product, err
}

func (s *productStorage) DeleteProductCategory(id int) error {
	_, err := s.db.Exec("DELETE FROM category WHERE category_number = $1", id)
	if err != nil {
		s.logger.Errorf("error while deleting product: %s", err)
		return err
	}
	return nil
}

func (s *productStorage) CreateStoreProduct(storeProduct *entity.StoreProduct) (*entity.StoreProduct, error) {
	_, err := s.db.Exec("INSERT INTO store_product (upc, fk_upc_prom, fk_id_product, selling_price, promotional_product, product_number) VALUES ($1, $2, $3, $4, $5, $6)",
		storeProduct.ID, storeProduct.PromotionalID, storeProduct.ProductID, storeProduct.Price, storeProduct.Promotional, storeProduct.Count)
	if err != nil {
		s.logger.Errorf("error while creating store product: %s", err)
		return nil, err
	}
	return storeProduct, err
}

func (s *productStorage) GetStoreProduct(id string) (*entity.StoreProduct, error) {
	storeProduct := entity.StoreProduct{}
	err := s.db.QueryRow("SELECT * FROM store_product WHERE upc = $1", id).
		Scan(&storeProduct.ID, &storeProduct.PromotionalID, &storeProduct.ProductID, &storeProduct.Price, &storeProduct.Count, &storeProduct.Promotional)
	if err != nil {
		s.logger.Errorf("error while getting store product: %s", err)
	}
	return &storeProduct, nil
}
func (s *productStorage) ListStoreProducts(opts *service.ListStoreProductsOptions) ([]*entity.StoreProduct, error) {
	var storeProducts []*entity.StoreProduct
	var query strings.Builder
	var args []interface{}

	query.WriteString(`
	SELECT
		sp.upc AS id,
		sp.fk_upc_prom AS promotional_id,
		sp.fk_id_product AS product_id,
		sp.selling_price AS price,
		sp.product_number AS count,
		sp.promotional_product AS promotional
	FROM store_product sp
	INNER JOIN product p ON sp.fk_id_product = p.id_product
	INNER JOIN category c ON p.fk_category_number = c.category_number
	WHERE 1=1
	`)

	argIdx := 1
	if opts.Search != nil {
		query.WriteString(fmt.Sprintf(" AND (p.product_name ILIKE $%d)", argIdx))
		searchString := fmt.Sprintf("%%%s%%", *opts.Search)
		args = append(args, searchString)
		argIdx++
	}

	if opts.CategoryID != nil {
		query.WriteString(fmt.Sprintf(" AND c.category_number = $%d", argIdx))
		args = append(args, *opts.CategoryID)
		argIdx++
	}

	if opts.Promotion != nil {
		query.WriteString(fmt.Sprintf(" AND sp.promotional_product = $%d", argIdx))
		args = append(args, *opts.Promotion)
		argIdx++
	}

	if opts.Promotion != nil {
		query.WriteString(fmt.Sprintf(" AND sp.promotional_product = $%d", argIdx))
		args = append(args, *opts.Promotion)
		argIdx++
	}

	if opts.SortName != nil || opts.SortCount != nil || opts.SortPrice != nil {
		query.WriteString(" ORDER BY ")
		if opts.SortName != nil {
			query.WriteString("p.product_name")
		} else if opts.SortCount != nil {
			query.WriteString("sp.product_number")
		} else if opts.SortPrice != nil {
			query.WriteString("sp.selling_price")
		}

		if opts.SortAscending != nil && *opts.SortAscending {
			query.WriteString(" ASC")
		} else {
			query.WriteString(" DESC")
		}
	}

	rows, err := s.db.Query(query.String(), args...)
	if err != nil {
		s.logger.Errorf("error while listing store products: %s", err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		storeProduct := entity.StoreProduct{}
		err := rows.Scan(&storeProduct.ID, &storeProduct.PromotionalID, &storeProduct.ProductID,
			&storeProduct.Price, &storeProduct.Count, &storeProduct.Promotional)
		if err != nil {
			s.logger.Errorf("error while scanning store product row: %s", err)
			return nil, err
		}
		storeProducts = append(storeProducts, &storeProduct)
	}

	return storeProducts, nil
}

func (s *productStorage) UpdateStoreProduct(id string, storeProduct *entity.StoreProduct) (*entity.StoreProduct, error) {
	_, err := s.db.Exec("UPDATE store_product SET fk_upc_prom = $1, fk_id_product = $2, selling_price = $3, product_number = $4, promotional_product = $5 WHERE upc = $6",
		storeProduct.PromotionalID, storeProduct.ProductID, storeProduct.Price, storeProduct.Count, storeProduct.Promotional, id)
	if err != nil {
		s.logger.Errorf("error while updating store product: %s", err)
		return nil, err
	}
	return storeProduct, err
}

func (s *productStorage) DeleteStoreProduct(id string) error {
	_, err := s.db.Exec("DELETE FROM store_product WHERE upc = $1", id)
	if err != nil {
		s.logger.Errorf("error while deleting store product: %s", err)
		return err
	}
	return nil
}
