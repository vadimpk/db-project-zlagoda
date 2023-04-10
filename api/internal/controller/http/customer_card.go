package http

import (
	"github.com/gin-gonic/gin"
	"github.com/vadimpk/db-project-zlagoda/api/internal/entity"
	"github.com/vadimpk/db-project-zlagoda/api/internal/service"
	"net/http"
)

type customerCardRoutes struct {
	opts *Options
}

func setupCustomerCardRoutes(options *Options, handler *gin.Engine) {
	routes := &customerCardRoutes{
		opts: options,
	}

	customerCardGroup := handler.Group("/customer-card")
	customerCardGroup.Use(newAuthMiddleware(options))
	{
		customerCardGroup.POST("/", routes.createCard)
		customerCardGroup.GET("/:id", routes.getCard)
		customerCardGroup.GET("/", routes.listCards)
		customerCardGroup.PUT("/:id", routes.updateCard)
		customerCardGroup.DELETE("/:id", routes.deleteCard)

	}
}

// @Id Create customer card
// @Security BearerAuth
// @Tags customer-card
// @Summary Create customer card
// @Param card body entity.CustomerCard true "Card"
// @Success 200 {object} entity.CustomerCard
// @Failure 400 {object} error
// @Router /customer-card [post]
func (r *customerCardRoutes) createCard(c *gin.Context) {
	var card entity.CustomerCard
	if err := c.ShouldBindJSON(&card); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}
	createdCard, err := r.opts.Services.CustomerCard.Create(&card)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, createdCard)
}

// @Id get-card
// @Security BearerAuth
// @Summary Get customer card
// @Tags customer-card
// @Description Get customer card
// @Param id path string true "Card ID"
// @Success 200 {object} entity.CustomerCard
// @Failure 400 {object} error
// @Router /customer-card/{id} [get]
func (r *customerCardRoutes) getCard(c *gin.Context) {
	id := c.Param("id")

	card, err := r.opts.Services.CustomerCard.Get(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, card)
}

// @Id List customer cards
// @Security BearerAuth
// @Tags customer-card
// @Summary List customer cards
// @Param listOptions query service.ListCardOptions true "List options"
// @Success 200 {array} entity.CustomerCard
// @Failure 400 {object} error
// @Router /customer-card [get]
func (r *customerCardRoutes) listCards(c *gin.Context) {
	var listOptions service.ListCardOptions
	if err := c.ShouldBindQuery(&listOptions); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}
	cards, err := r.opts.Services.CustomerCard.List(listOptions)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, cards)
}

// @Id update-card
// @Security BearerAuth
// @Summary Update customer card
// @Tags customer-card
// @Description Update customer card
// @Param id path string true "Card ID"
// @Param card body entity.CustomerCard true "Card"
// @Success 200 {object} entity.CustomerCard
// @Failure 400 {object} error
// @Router /customer-card/{id} [put]
func (r *customerCardRoutes) updateCard(c *gin.Context) {
	id := c.Param("id")

	var card entity.CustomerCard
	if err := c.ShouldBindJSON(&card); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	updatedCard, err := r.opts.Services.CustomerCard.Update(id, &card)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, updatedCard)
}

// @Id delete-cards
// @Security BearerAuth
// @Summary Delete customer cards
// @Tags customer-card
// @Description Delete customer cards
// @Param id path string true "Card ID"
// @Success 200
// @Failure 400 {object} error
// @Router /customer-card/{id} [delete]
func (r *customerCardRoutes) deleteCard(c *gin.Context) {
	err := r.opts.Services.CustomerCard.Delete(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, nil)
}
