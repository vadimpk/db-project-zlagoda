package http

import (
	"github.com/gin-gonic/gin"
	"github.com/vadimpk/db-project-zlagoda/api/internal/entity"
	"github.com/vadimpk/db-project-zlagoda/api/internal/service"
	"net/http"
)

type cardRoutes struct {
	opts *Options
}

func setupCardRoutes(options *Options, handler *gin.Engine) {
	routes := &cardRoutes{
		opts: options,
	}

	cardGroup := handler.Group("/customer_card")
	{
		cardGroup.POST("/", routes.createCard)
		cardGroup.GET("/:id", routes.getCard)
		cardGroup.GET("/", routes.listCards)
		cardGroup.PUT("/:id", routes.updateCard)
		cardGroup.DELETE("/", routes.deleteCards)

	}
}
func (r *cardRoutes) createCard(c *gin.Context) {
	var card entity.Card
	if err := c.ShouldBindJSON(&card); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}
	createdCard, err := r.opts.Services.Card.CreateCard(&card)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, createdCard)
}
func (r *cardRoutes) getCard(c *gin.Context) {
	id := c.Param("id")

	card, err := r.opts.Services.Card.GetCard(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, card)
}
func (r *cardRoutes) listCards(c *gin.Context) {
	cards, err := r.opts.Services.Card.ListCard(service.ListCardOptions{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, cards)
}
func (r *cardRoutes) updateCard(c *gin.Context) {
	id := c.Param("id")

	var card entity.Card
	if err := c.ShouldBindJSON(&card); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	updatedCard, err := r.opts.Services.Card.UpdateCard(id, &card)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, updatedCard)
}

type deleteCardsRequestBody struct {
	Ids []string `json:"ids"`
}

func (r *cardRoutes) deleteCards(c *gin.Context) {
	var body deleteCardsRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}
	err := r.opts.Services.Card.DeleteCards(body.Ids)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, nil)
}
