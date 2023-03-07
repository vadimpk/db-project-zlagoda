package http

import (
	"github.com/gin-gonic/gin"
	"github.com/vadimpk/db-project-zlagoda/api/internal/entity"
	"github.com/vadimpk/db-project-zlagoda/api/internal/service"
	"net/http"
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
		productGroup.POST("/", routes.createProduct)
		productGroup.GET("/:id", routes.getProduct)
		productGroup.GET("/", routes.listProducts)
		productGroup.PUT("/:id", routes.updateProduct)
		productGroup.DELETE("/", routes.deleteProducts)
	}

	categoryGroup := productGroup.Group("/category")
	{
		categoryGroup.POST("/", routes.createCategory)
		categoryGroup.GET("/", routes.listCategories)
		categoryGroup.PUT("/:id", routes.updateCategory)
		categoryGroup.DELETE("/", routes.deleteCategories)
	}

	storeProductGroup := productGroup.Group("/store")
	{
		storeProductGroup.POST("/", routes.createStoreProduct)
		storeProductGroup.GET("/:id", routes.getStoreProduct)
		storeProductGroup.GET("/", routes.listStoreProducts)
		storeProductGroup.PUT("/:id", routes.updateStoreProduct)
		storeProductGroup.DELETE("/", routes.deleteStoreProducts)

	}
}

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

func (r *productRoutes) getProduct(c *gin.Context) {
	id := c.Param("id")

	employee, err := r.opts.Services.Product.GetProduct(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, employee)
}

func (r *productRoutes) listProducts(c *gin.Context) {
	products, err := r.opts.Services.Product.ListProducts(service.ListProductsOptions{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, products)
}

func (r *productRoutes) updateProduct(c *gin.Context) {
	id := c.Param("id")

	var product entity.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	updatedProduct, err := r.opts.Services.Product.UpdateProduct(id, &product)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, updatedProduct)
}

type deleteProductsRequestBody struct {
	Ids []string `json:"ids"`
}

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

func (r *productRoutes) listCategories(c *gin.Context) {
	categories, err := r.opts.Services.Product.ListProductCategories()
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, categories)
}

func (r *productRoutes) updateCategory(c *gin.Context) {
	id := c.Param("id")

	var category entity.ProductCategory
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	updatedCategory, err := r.opts.Services.Product.UpdateProductCategory(id, &category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, updatedCategory)
}

type deleteCategoriesRequestBody struct {
	Ids []string `json:"ids"`
}

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

func (r *productRoutes) getStoreProduct(c *gin.Context) {
	id := c.Param("id")

	storeProduct, err := r.opts.Services.Product.GetStoreProduct(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, storeProduct)
}

func (r *productRoutes) listStoreProducts(c *gin.Context) {
	storeProducts, err := r.opts.Services.Product.ListStoreProducts(service.ListStoreProductsOptions{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, storeProducts)
}

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
