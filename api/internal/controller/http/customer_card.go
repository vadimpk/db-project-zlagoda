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
	{
		customerCardGroup.POST("/", routes.createCard)
		customerCardGroup.GET("/:id", routes.getCard)
		customerCardGroup.GET("/", routes.listCards)
		customerCardGroup.PUT("/:id", routes.updateCard)
		customerCardGroup.DELETE("/", routes.deleteCards)

	}
}

// @Summary Create customer card
// @Description Create customer card
// @Id create-card
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

// @Summary Get customer card
// @Description Get customer card
// @Id get-card
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

// @Summary List customer cards
// @Description List customer cards
// @Id list-cards
// @Param id path string true "Card ID"
// @Success 200 {object} entity.CustomerCard
// @Failure 400 {object} error
// @Router /customer-card [get]
func (r *customerCardRoutes) listCards(c *gin.Context) {
	cards, err := r.opts.Services.CustomerCard.List(service.ListCardOptions{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, cards)
}

// @Summary Update customer card
//
//	@Description Update customer card
//	@Id update-card
//	@Param id path string true "Card ID"
//	@Param card body entity.CustomerCard true "Card"
//	@Success 200 {object} entity.CustomerCard
//	@Failure 400 {object} error
//	@Router /customer-card/{id} [put]
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

type deleteCardsRequestBody struct {
	Ids []string `json:"ids"`
}

// @Summary Delete customer cards
//
//	@Description Delete customer cards
//	@Id delete-cards
//	@Param ids body deleteCardsRequestBody true "Card IDs"
//	@Success 200 {object} entity.CustomerCard
//	@Failure 400 {object} error
//	@Router /customer-card [delete]
func (r *customerCardRoutes) deleteCards(c *gin.Context) {
	var body deleteCardsRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}
	err := r.opts.Services.CustomerCard.Delete(body.Ids)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, nil)
}
