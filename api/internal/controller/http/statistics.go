package http

import (
	"github.com/gin-gonic/gin"
	"github.com/vadimpk/db-project-zlagoda/api/internal/service"
	"net/http"
)

type statisticsRoutes struct {
	opts    *Options
	handler http.Handler
}

func setupStatisticsRoutes(options *Options, handler *gin.Engine) {
	routes := &statisticsRoutes{
		opts: options,
	}

	group := handler.Group("/statistics")
	{
		group.GET("/sales-by-category", newAuthMiddleware(options, ""), routes.getSalesByCategory)
		group.GET("/employees-checks", newAuthMiddleware(options, ""), routes.getEmployeesChecks)
		group.GET("/customers-buy-all-categories", newAuthMiddleware(options, ""), routes.getCustomersBuyAllCategories)
		group.GET("customers-checks", newAuthMiddleware(options, ""), routes.getCustomersChecks)
	}
}

// @Summary Get sales by category
// @Description Get sales by category
// @Security BearerAuth
// @Tags statistics
// @Accept json
// @Produce json
// @Param listOptions query service.GetSalesByCategoryOptions true "List options"
// @Success 200 {array} entity.CategorySale
// @Failure 400 {object} error
// @Router /statistics/sales-by-category [get]
func (r *statisticsRoutes) getSalesByCategory(c *gin.Context) {
	var listOptions service.GetSalesByCategoryOptions
	if err := c.ShouldBindQuery(&listOptions); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	sales, err := r.opts.Services.Statistics.GetSalesByCategory(&listOptions)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, sales)
}

// @Summary Get employees checks
// @Description Get employees checks
// @Security BearerAuth
// @Tags statistics
// @Accept json
// @Produce json
// @Param listOptions query service.GetEmployeesChecksOptions true "List options"
// @Success 200 {array} entity.EmployeeCheck
// @Failure 400 {object} error
// @Router /statistics/employees-checks [get]
func (r *statisticsRoutes) getEmployeesChecks(c *gin.Context) {
	var listOptions service.GetEmployeesChecksOptions
	if err := c.ShouldBindQuery(&listOptions); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	employees, err := r.opts.Services.Statistics.GetEmployeesChecks(&listOptions)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, employees)
}

// @Summary Get customers buy all categories
// @Description Get customers buy all categories
// @Security BearerAuth
// @Tags statistics
// @Accept json
// @Produce json
// @Param listOptions query service.GetCustomersBuyAllCategoriesOptions true "List options"
// @Success 200 {array} entity.CustomerBuyAllCategories
// @Failure 400 {object} error
// @Router /statistics/customers-buy-all-categories [get]
func (r *statisticsRoutes) getCustomersBuyAllCategories(c *gin.Context) {
	var listOptions service.GetCustomersBuyAllCategoriesOptions
	if err := c.ShouldBindQuery(&listOptions); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	customers, err := r.opts.Services.Statistics.GetCustomersBuyAllCategories(&listOptions)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, customers)
}

// @Summary Get customers checks
// @Description Get customers checks
// @Security BearerAuth
// @Tags statistics
// @Accept json
// @Produce json
// @Param listOptions query service.GetCustomersChecksOptions true "List options"
// @Success 200 {array} entity.CustomerCheck
// @Failure 400 {object} error
// @Router /statistics/customers-checks [get]
func (r *statisticsRoutes) getCustomersChecks(c *gin.Context) {
	var listOptions service.GetCustomersChecksOptions
	if err := c.ShouldBindQuery(&listOptions); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	customers, err := r.opts.Services.Statistics.GetCustomersChecks(&listOptions)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, customers)

}
