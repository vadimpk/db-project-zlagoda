package http

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

type customerCardRoutes struct {
	opts    *Options
	handler http.Handler
}

func setupCustomerCardRoutes(options *Options, handler *gin.Engine) {
	routes := &customerCardRoutes{
		opts:    options,
		handler: handler,
	}

	group := handler.Group("/customer")
	{
		group.GET("/:id", routes.getCustomerCard)
	}
}

func (r *customerCardRoutes) getCustomerCard(c *gin.Context) {
	id := c.Param("id")

	customerCard, err := r.opts.Services.CustomerCard.Get(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, customerCard)
}
