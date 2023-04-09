package http

import (
	"github.com/gin-gonic/gin"
	"github.com/vadimpk/db-project-zlagoda/api/internal/entity"
	"github.com/vadimpk/db-project-zlagoda/api/internal/service"
	"net/http"
	"strconv"
)

type productRoutes struct {
	opts *Options
}

func setupProductRoutes(options *Options, handler *gin.Engine) {
	routes := &productRoutes{
		opts: options,
	}

	productGroup := handler.Group("/product")
	{
		productGroup.POST("/", newAuthMiddleware(options), routes.createProduct)
		productGroup.GET("/:id", newAuthMiddleware(options), routes.getProduct)
		productGroup.GET("/", newAuthMiddleware(options), routes.listProducts)
		productGroup.PUT("/:id", newAuthMiddleware(options), routes.updateProduct)
		productGroup.DELETE("/", newAuthMiddleware(options), routes.deleteProducts)
	}

	categoryGroup := productGroup.Group("/category")
	{
		categoryGroup.POST("/", newAuthMiddleware(options), routes.createCategory)
		categoryGroup.GET("/", newAuthMiddleware(options), routes.listCategories)
		categoryGroup.PUT("/:id", newAuthMiddleware(options), routes.updateCategory)
		categoryGroup.DELETE("/", newAuthMiddleware(options), routes.deleteCategories)
	}

	storeProductGroup := productGroup.Group("/store")
	{
		storeProductGroup.POST("/", newAuthMiddleware(options), routes.createStoreProduct)
		storeProductGroup.GET("/:id", newAuthMiddleware(options), routes.getStoreProduct)
		storeProductGroup.GET("/", newAuthMiddleware(options), routes.listStoreProducts)
		storeProductGroup.PUT("/:id", newAuthMiddleware(options), routes.updateStoreProduct)
		storeProductGroup.DELETE("/", newAuthMiddleware(options), routes.deleteStoreProducts)

	}
}

// @Id create-product
// @Security BearerAuth
// @Summary Create product
// @Tags product
// @Description Create product (using product category)
// @Param product body entity.Product true "Product"
// @Success 200 {object} entity.Product
// @Failure 400 {object} error
// @Router /product [post]
func (r *productRoutes) createProduct(c *gin.Context) {
	var product entity.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	createdProduct, err := r.opts.Services.Product.CreateProduct(&product)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, createdProduct)
}

// @Id get-product
// @Security BearerAuth
// @Summary Get product
// @Tags product
// @Description Get product
// @Param id path int true "Product ID"
// @Success 200 {object} entity.Product
// @Failure 400 {object} error
// @Router /product/{id} [get]
func (r *productRoutes) getProduct(c *gin.Context) {
	id := c.Param("id")
	productID, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	product, err := r.opts.Services.Product.GetProduct(productID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, product)
}

// @Id list-products
// @Security BearerAuth
// @Summary List products
// @Tags product
// @Description List products
// @Param listOptions query service.ListProductsOptions false "List options"
// @Success 200 {array} entity.Product
// @Failure 400 {object} error
// @Router /product [get]
func (r *productRoutes) listProducts(c *gin.Context) {
	var listOptions service.ListProductsOptions
	if err := c.ShouldBindQuery(&listOptions); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	products, err := r.opts.Services.Product.ListProducts(&listOptions)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, products)
}

// @Id update-product
// @Security BearerAuth
// @Summary Update product
// @Tags product
// @Description Update product
// @Param id path string true "Product ID"
// @Param product body entity.Product true "Product"
// @Success 200 {object} entity.Product
// @Failure 400 {object} error
// @Router /product/{id} [put]
func (r *productRoutes) updateProduct(c *gin.Context) {
	id := c.Param("id")
	productID, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	var product entity.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	updatedProduct, err := r.opts.Services.Product.UpdateProduct(productID, &product)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, updatedProduct)
}

type deleteProductsRequestBody struct {
	Ids []int `json:"ids"`
}

// @Id delete-products
// @Security BearerAuth
// @Summary Delete products
// @Tags product
// @Description Delete products
// @Param ids body deleteProductsRequestBody true "Product IDs"
// @Success 200
// @Failure 400 {object} error
// @Router /product [delete]
func (r *productRoutes) deleteProducts(c *gin.Context) {
	var body deleteProductsRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	err := r.opts.Services.Product.DeleteProducts(body.Ids)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, nil)
}

// @Id create-product-category
// @Security BearerAuth
// @Summary Create product category
// @Tags product category
// @Description Create product category
// @Param category body entity.ProductCategory true "Product category"
// @Success 200 {object} entity.ProductCategory
// @Failure 400 {object} error
// @Router /product/category [post]
func (r *productRoutes) createCategory(c *gin.Context) {
	var category entity.ProductCategory
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	createdCategory, err := r.opts.Services.Product.CreateProductCategory(&category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, createdCategory)
}

// @Id list-product-categories
// @Security BearerAuth
// @Summary List product categories
// @Tags product category
// @Description List product categories
// @Param listOptions query service.ListProductCategoriesOptions false "List options"
// @Success 200 {array} entity.ProductCategory
// @Failure 400 {object} error
// @Router /product/category [get]
func (r *productRoutes) listCategories(c *gin.Context) {
	var listOptions service.ListProductCategoriesOptions
	if err := c.ShouldBindQuery(&listOptions); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	categories, err := r.opts.Services.Product.ListProductCategories(&listOptions)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, categories)
}

// @Id update-product-category
// @Security BearerAuth
// @Summary Update product category
// @Tags product category
// @Description Update product category
// @Param id path int true "Product category ID"
// @Param category body entity.ProductCategory true "Product category"
// @Success 200 {object} entity.ProductCategory
// @Failure 400 {object} error
// @Router /product/category/{id} [put]
func (r *productRoutes) updateCategory(c *gin.Context) {
	id := c.Param("id")
	categoryID, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	var category entity.ProductCategory
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	updatedCategory, err := r.opts.Services.Product.UpdateProductCategory(categoryID, &category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, updatedCategory)
}

type deleteCategoriesRequestBody struct {
	Ids []int `json:"ids"`
}

// @Id delete-product-categories
// @Security BearerAuth
// @Summary Delete product categories
// @Tags product category
// @Description Delete product categories
// @Param ids body deleteCategoriesRequestBody true "Product category IDs"
// @Success 200
// @Failure 400 {object} error
// @Router /product/category [delete]
func (r *productRoutes) deleteCategories(c *gin.Context) {
	var body deleteCategoriesRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	err := r.opts.Services.Product.DeleteProductCategories(body.Ids)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, nil)
}

// @Id create-store-product
// @Security BearerAuth
// @Summary Create store product
// @Tags product in store
// @Description Create store product
// @Param store_product body entity.StoreProduct true "Store product"
// @Success 200 {object} entity.StoreProduct
// @Failure 400 {object} error
// @Router /product/store [post]
func (r *productRoutes) createStoreProduct(c *gin.Context) {
	var storeProduct entity.StoreProduct
	if err := c.ShouldBindJSON(&storeProduct); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	createdStoreProduct, err := r.opts.Services.Product.CreateStoreProduct(&storeProduct)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, createdStoreProduct)
}

// @Id get-store-products
// @Security BearerAuth
// @Tags product in store
// @Summary Get store product
// @Param id path string true "Product ID"
// @Success 200 {object} entity.StoreProduct
// @Failure 400 {object} error
// @Router /product/store/{id} [get]
func (r *productRoutes) getStoreProduct(c *gin.Context) {
	id := c.Param("id")

	storeProduct, err := r.opts.Services.Product.GetStoreProduct(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, storeProduct)
}

// @Id list-store-products
// @Security BearerAuth
// @Summary List store products
// @Tags product in store
// @Description List store products
// @Param listOptions query service.ListStoreProductsOptions true "List options"
// @Success 200 {array} entity.StoreProduct
// @Failure 400 {object} error
// @Router /product/store [get]
func (r *productRoutes) listStoreProducts(c *gin.Context) {
	var listOptions service.ListStoreProductsOptions
	if err := c.ShouldBindQuery(&listOptions); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	storeProducts, err := r.opts.Services.Product.ListStoreProducts(&listOptions)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, storeProducts)
}

// @Id update-store-product
// @Security BearerAuth
// @Summary Update store product
// @Tags product in store
// @Description Update store product
// @Param id path string true "Store product ID"
// @Param store_product body entity.StoreProduct true "Store product"
// @Success 200 {object} entity.StoreProduct
// @Failure 400 {object} error
// @Router /product/store/{id} [put]
func (r *productRoutes) updateStoreProduct(c *gin.Context) {
	id := c.Param("id")

	var storeProduct entity.StoreProduct
	if err := c.ShouldBindJSON(&storeProduct); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	updatedStoreProduct, err := r.opts.Services.Product.UpdateStoreProduct(id, &storeProduct)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, updatedStoreProduct)
}

type deleteStoreProductsRequestBody struct {
	Ids []string `json:"ids"`
}

// @Id delete-store-products
// @Security BearerAuth
// @Summary Delete store products
// @Tags product in store
// @Description Delete store products
// @Param ids body deleteStoreProductsRequestBody true "Store product IDs"
// @Success 200
// @Failure 400 {object} error
// @Router /product/store [delete]
func (r *productRoutes) deleteStoreProducts(c *gin.Context) {
	var body deleteStoreProductsRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	err := r.opts.Services.Product.DeleteStoreProducts(body.Ids)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, nil)
}
