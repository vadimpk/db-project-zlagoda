package http

import (
	"github.com/gin-gonic/gin"
	"github.com/vadimpk/db-project-zlagoda/api/internal/entity"
	"net/http"
)

type checkRoutes struct {
	opts *Options
}

func setupCheckRoutes(options *Options, handler *gin.Engine) {
	routes := &checkRoutes{
		opts: options,
	}

	checkGroup := handler.Group("/check")
	checkGroup.Use(newAuthMiddleware(options))
	{
		checkGroup.POST("/", routes.createCheck)
		checkGroup.GET("/:id", routes.getCheck)
		checkGroup.GET("/", routes.listChecks)
		checkGroup.PUT("/:id", routes.updateCheck)
		checkGroup.DELETE("/", routes.deleteChecks)
	}

	checkItemGroup := checkGroup.Group("/check-item")
	{
		checkItemGroup.POST("/", routes.createCheckItem)
		checkItemGroup.GET("/", routes.getCheckItem)
		checkItemGroup.GET("/list", routes.listCheckItems)
		checkItemGroup.PUT("/", routes.updateCheckItem)
		checkItemGroup.DELETE("/", routes.deleteCheckItems)
	}
}

// @Id Create check
// @Security BearerAuth
// @Tags check
// @Summary Create check
// @Param check body entity.Check true "Check"
// @Success 200 {object} entity.Check
// @Failure 400 {object} error
// @Router /check [post]
func (r *checkRoutes) createCheck(c *gin.Context) {
	var check entity.Check
	if err := c.ShouldBindJSON(&check); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	createdCheck, err := r.opts.Services.Check.CreateCheck(&check)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, createdCheck)
}

// @Id get-check
// @Security BearerAuth
// @Summary Get check
// @Tags check
// @Description Get check
// @Param id path string true "Check ID"
// @Success 200 {object} entity.Check
// @Failure 400 {object} error
// @Router /check/{id} [get]
func (r *checkRoutes) getCheck(c *gin.Context) {
	id := c.Param("id")

	check, err := r.opts.Services.Check.GetCheck(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, check)
}

func (r *checkRoutes) listChecks(c *gin.Context) {
	return
}

// @Id update-check
// @Security BearerAuth
// @Summary Update check
// @Tags check
// @Description Update check
// @Param id path string true "Check ID"
// @Param check body entity.Check true "Check"
// @Success 200 {object} entity.Check
// @Failure 400 {object} error
// @Router /check/{id} [put]
func (r *checkRoutes) updateCheck(c *gin.Context) {
	id := c.Param("id")

	var check entity.Check
	if err := c.ShouldBindJSON(&check); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	updatedCheck, err := r.opts.Services.Check.UpdateCheck(id, &check)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, updatedCheck)
}

type deleteChecksRequestBody struct {
	Ids []string `json:"ids"`
}

type deleteChecksResponseBody struct {
	Deleted []string `json:"deleted"`
}

// @Id delete-checks
// @Security BearerAuth
// @Summary Delete checks
// @Tags check
// @Description Delete checks
// @Param ids body deleteChecksRequestBody true "Check IDs"
// @Success 200 {object} deleteChecksResponseBody
// @Failure 400 {object} error
// @Router /check [delete]
func (r *checkRoutes) deleteChecks(c *gin.Context) {
	var requestBody deleteChecksRequestBody
	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	// deleted, err := r.opts.Services.Check.DeleteChecks(requestBody.Ids)
	err := r.opts.Services.Check.DeleteChecks(requestBody.Ids)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, deleteChecksResponseBody{
		Deleted: nil,
	})
}

// @Id Create check item
// @Security BearerAuth
// @Tags check-item
// @Summary Create check item
// @Param check-item body entity.CheckItem true "Check item"
// @Success 200 {object} entity.CheckItem
// @Failure 400 {object} error
// @Router /check/check-item [post]
func (r *checkRoutes) createCheckItem(c *gin.Context) {
	var checkItem entity.CheckItem
	if err := c.ShouldBindJSON(&checkItem); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	createdCheckItem, err := r.opts.Services.Check.CreateCheckItem(&checkItem)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, createdCheckItem)
}

type getCheckItemRequestQuery struct {
	CheckId        string `form:"checkId"`
	StoreProductId string `form:"storeProductId"`
}

// @Id get-check-item
// @Security BearerAuth
// @Summary Get check item
// @Tags check-item
// @Description Get check item
// @Param id query getCheckItemRequestQuery true "Check item ID"
// @Success 200 {object} entity.CheckItem
// @Failure 400 {object} error
// @Router /check/check-item [get]
func (r *checkRoutes) getCheckItem(c *gin.Context) {
	var query getCheckItemRequestQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	checkItem, err := r.opts.Services.Check.GetCheckItem(entity.CheckItemID{
		StoreProductID: query.StoreProductId,
		CheckID:        query.CheckId,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, checkItem)
}

func (r *checkRoutes) listCheckItems(c *gin.Context) {
	return
}

type updateCheckItemRequestQuery struct {
	CheckId        string `form:"checkId"`
	StoreProductId string `form:"storeProductId"`
}

// @Id update-check-item
// @Security BearerAuth
// @Summary Update check item
// @Tags check-item
// @Description Update check item
// @Param id query updateCheckItemRequestQuery true "Check item ID"
// @Param check-item body entity.CheckItem true "Check item"
// @Success 200 {object} entity.CheckItem
// @Failure 400 {object} error
// @Router /check/check-item [put]
func (r *checkRoutes) updateCheckItem(c *gin.Context) {
	var query updateCheckItemRequestQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	var checkItem entity.CheckItem
	if err := c.ShouldBindJSON(&checkItem); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	updatedCheckItem, err := r.opts.Services.Check.UpdateCheckItem(entity.CheckItemID{
		StoreProductID: query.StoreProductId,
		CheckID:        query.CheckId,
	}, &checkItem)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, updatedCheckItem)
}

type deleteCheckItemsRequestBody struct {
	Ids []entity.CheckItemID `json:"ids"`
}

type deleteCheckItemsResponseBody struct {
	Deleted []entity.CheckItemID `json:"deleted"`
}

// @Id delete-check-items
// @Security BearerAuth
// @Summary Delete check items
// @Tags check-item
// @Description Delete check items
// @Param ids body deleteCheckItemsRequestBody true "Check item IDs"
// @Success 200 {object} deleteCheckItemsResponseBody
// @Failure 400 {object} error
// @Router /check/check-item [delete]
func (r *checkRoutes) deleteCheckItems(c *gin.Context) {
	var requestBody deleteCheckItemsRequestBody
	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	// deleted, err := r.opts.Services.Check.DeleteCheckItems(requestBody.Ids)
	err := r.opts.Services.Check.DeleteCheckItems(requestBody.Ids)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, deleteChecksResponseBody{
		Deleted: nil,
	})
}
