package http

import (
	"github.com/gin-gonic/gin"
	"github.com/vadimpk/db-project-zlagoda/api/internal/entity"
	"github.com/vadimpk/db-project-zlagoda/api/internal/service"
	"github.com/vadimpk/db-project-zlagoda/api/pkg/errs"
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
		//checkGroup.PUT("/:id", routes.updateCheck)
		checkGroup.DELETE("/:id", routes.deleteCheck)
	}

	checkItemGroup := checkGroup.Group("/check-item")
	{
		checkItemGroup.POST("/", routes.createCheckItem)
		checkItemGroup.GET("/", routes.getCheckItem)
		checkItemGroup.GET("/list", routes.listCheckItems)
		checkItemGroup.PUT("/", routes.updateCheckItem)
		checkItemGroup.DELETE("/", routes.deleteCheckItem)
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
		if errs.IsExpected(err) {
			c.JSON(http.StatusBadRequest, err)
			return
		}
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
		if errs.IsExpected(err) {
			c.JSON(http.StatusBadRequest, err)
			return
		}
		c.JSON(http.StatusInternalServerError, err)
		return
	}
	if check == nil {
		c.JSON(http.StatusNotFound, nil)
		return
	}

	c.JSON(http.StatusOK, check)
}

// @Id list-checks
// @Security BearerAuth
// @Summary List checks
// @Tags check
// @Description List checks
// @Param listOptions query service.ListChecksOptions true "List options"
// @Success 200 {array} entity.Check
// @Failure 400 {object} error
// @Router /check [get]
func (r *checkRoutes) listChecks(c *gin.Context) {
	var listOptions service.ListChecksOptions
	if err := c.ShouldBindQuery(&listOptions); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	checks, err := r.opts.Services.Check.ListChecks(&listOptions)
	if err != nil {
		if errs.IsExpected(err) {
			c.JSON(http.StatusBadRequest, err)
			return
		}
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, checks)
}

//// @Id update-check
//// @Security BearerAuth
//// @Summary Update check
//// @Tags check
//// @Description Update check
//// @Param id path string true "Check ID"
//// @Param check body entity.Check true "Check"
//// @Success 200 {object} entity.Check
//// @Failure 400 {object} error
//// @Router /check/{id} [put]
//func (r *checkRoutes) updateCheck(c *gin.Context) {
//	id := c.Param("id")
//
//	var check entity.Check
//	if err := c.ShouldBindJSON(&check); err != nil {
//		c.JSON(http.StatusBadRequest, err)
//		return
//	}
//
//	updatedCheck, err := r.opts.Services.Check.UpdateCheck(id, &check)
//	if err != nil {
//		if errs.IsExpected(err) {
//			c.JSON(http.StatusBadRequest, err)
//			return
//		}
//		c.JSON(http.StatusInternalServerError, err)
//		return
//	}
//
//	c.JSON(http.StatusOK, updatedCheck)
//}

// @Id delete-checks
// @Security BearerAuth
// @Summary Delete checks
// @Tags check
// @Description Delete checks
// @Param id path string true "Check ID"
// @Success 200
// @Failure 400 {object} error
// @Router /check/{id} [delete]
func (r *checkRoutes) deleteCheck(c *gin.Context) {
	err := r.opts.Services.Check.DeleteCheck(c.Param("id"))
	if err != nil {
		if errs.IsExpected(err) {
			c.JSON(http.StatusBadRequest, err)
			return
		}
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, nil)
}

type createCheckItemResponseBody struct {
	CheckItem *entity.CheckItem    `json:"checkItem"`
	Check     *entity.Check        `json:"check"`
	Product   *entity.StoreProduct `json:"product"`
}

// @Id Create check item
// @Security BearerAuth
// @Tags check-item
// @Summary Create check item
// @Param check-item body entity.CheckItem true "Check item"
// @Success 200 {object} createCheckItemResponseBody
// @Failure 400 {object} error
// @Router /check/check-item [post]
func (r *checkRoutes) createCheckItem(c *gin.Context) {
	var checkItem entity.CheckItem
	if err := c.ShouldBindJSON(&checkItem); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	output, err := r.opts.Services.Check.CreateCheckItem(&checkItem)
	if err != nil {
		if errs.IsExpected(err) {
			c.JSON(http.StatusBadRequest, err)
			return
		}
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, createCheckItemResponseBody{
		CheckItem: output.CheckItem,
		Check:     output.Check,
		Product:   output.Product,
	})
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
		if errs.IsExpected(err) {
			c.JSON(http.StatusBadRequest, err)
			return
		}
		c.JSON(http.StatusInternalServerError, err)
		return
	}
	if checkItem == nil {
		c.JSON(http.StatusNotFound, nil)
		return
	}

	c.JSON(http.StatusOK, checkItem)
}

// @Id list-check-items
// @Security BearerAuth
// @Summary List check items
// @Tags check-item
// @Description List check items
// @Param listOptions query service.ListCheckItemsOptions true "List options"
// @Success 200 {array} entity.CheckItem
// @Failure 400 {object} error
// @Router /check/check-item/list [get]
func (r *checkRoutes) listCheckItems(c *gin.Context) {
	var listOptions service.ListCheckItemsOptions
	if err := c.ShouldBindQuery(&listOptions); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	checkItems, err := r.opts.Services.Check.ListCheckItems(&listOptions)
	if err != nil {
		if errs.IsExpected(err) {
			c.JSON(http.StatusBadRequest, err)
			return
		}
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, checkItems)
}

type updateCheckItemRequestQuery struct {
	CheckId        string `form:"checkId"`
	StoreProductId string `form:"storeProductId"`
}

type updateCheckItemResponseBody struct {
	CheckItem *entity.CheckItem    `json:"checkItem"`
	Check     *entity.Check        `json:"check"`
	Product   *entity.StoreProduct `json:"product"`
}

// @Id update-check-item
// @Security BearerAuth
// @Summary Update check item
// @Tags check-item
// @Description Update check item
// @Param id query updateCheckItemRequestQuery true "Check item ID"
// @Param check-item body entity.CheckItem true "Check item"
// @Success 200 {object} updateCheckItemResponseBody
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

	output, err := r.opts.Services.Check.UpdateCheckItem(entity.CheckItemID{
		StoreProductID: query.StoreProductId,
		CheckID:        query.CheckId,
	}, &checkItem)
	if err != nil {
		if errs.IsExpected(err) {
			c.JSON(http.StatusBadRequest, err)
			return
		}
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, updateCheckItemResponseBody{
		CheckItem: output.CheckItem,
		Check:     output.Check,
		Product:   output.Product,
	})
}

type deleteCheckItemsRequestBody struct {
	Id entity.CheckItemID `json:"id"`
}

type deleteCheckItemsResponseBody struct {
	Check   *entity.Check        `json:"check"`
	Product *entity.StoreProduct `json:"product"`
}

// @Id delete-check-items
// @Security BearerAuth
// @Summary Delete check items
// @Tags check-item
// @Description Delete check items
// @Param id body deleteCheckItemsRequestBody true "Check item ID"
// @Success 200 {object} deleteCheckItemsResponseBody
// @Failure 400 {object} error
// @Router /check/check-item [delete]
func (r *checkRoutes) deleteCheckItem(c *gin.Context) {
	var requestBody deleteCheckItemsRequestBody
	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	output, err := r.opts.Services.Check.DeleteCheckItem(requestBody.Id)
	if err != nil {
		if errs.IsExpected(err) {
			c.JSON(http.StatusBadRequest, err)
			return
		}
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, deleteCheckItemsResponseBody{
		Check:   output.Check,
		Product: output.Product,
	})
}
