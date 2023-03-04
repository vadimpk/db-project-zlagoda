package http

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

type employeeRoutes struct {
	opts    *Options
	handler http.Handler
}

func setupEmployeeRoutes(options *Options, handler *gin.Engine) {
	routes := &employeeRoutes{
		opts:    options,
		handler: handler,
	}

	group := handler.Group("/employee")
	{
		group.GET("/:id", routes.getEmployee)
	}
}

func (r *employeeRoutes) getEmployee(c *gin.Context) {
	id := c.Param("id")

	employee, err := r.opts.Services.Employee.Get(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, employee)
}
