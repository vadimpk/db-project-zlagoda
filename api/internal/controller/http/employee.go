package http

import (
	"github.com/gin-gonic/gin"
	"github.com/vadimpk/db-project-zlagoda/api/internal/entity"
	"github.com/vadimpk/db-project-zlagoda/api/internal/service"
	"github.com/vadimpk/db-project-zlagoda/api/pkg/errs"
	"net/http"
)

type employeeRoutes struct {
	opts    *Options
	handler http.Handler
}

func setupEmployeeRoutes(options *Options, handler *gin.Engine) {
	routes := &employeeRoutes{
		opts: options,
	}

	group := handler.Group("/employee")
	{
		group.POST("/", newAuthMiddleware(options), routes.createEmployee)
		group.GET("/:id", newAuthMiddleware(options), routes.getEmployee)
		group.GET("/", newAuthMiddleware(options), routes.listEmployee)
		group.PUT("/:id", newAuthMiddleware(options), routes.updateEmployee)
		group.DELETE("/:id", newAuthMiddleware(options), routes.deleteEmployee)

		group.POST("/login", routes.login)
	}
}

// @Id create-employee
// @Security BearerAuth
// @Summary Create employee
// @Tags employee
// @Description Create employee
// @Param employee body entity.Employee true "Employee"
// @Success 200 {object} entity.Employee
// @Failure 400 {object} error
// @Router /employee [post]
func (r *employeeRoutes) createEmployee(c *gin.Context) {
	var employee entity.Employee
	if err := c.ShouldBindJSON(&employee); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	createdEmployee, err := r.opts.Services.Employee.Create(&employee)
	if err != nil {
		if errs.IsExpected(err) {
			c.JSON(http.StatusBadRequest, err)
			return
		}
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, createdEmployee)
}

// @Id get-employee
// @Security BearerAuth
// @Summary Get employee
// @Tags employee
// @Description Get employee
// @Param id path string true "Employee ID"
// @Success 200 {object} entity.Employee
// @Failure 400 {object} error
// @Router /employee/{id} [get]
func (r *employeeRoutes) getEmployee(c *gin.Context) {
	id := c.Param("id")

	employee, err := r.opts.Services.Employee.Get(id)
	if err != nil {
		if errs.IsExpected(err) {
			c.JSON(http.StatusBadRequest, err)
			return
		}
		c.JSON(http.StatusInternalServerError, err)
		return
	}
	if employee == nil {
		c.JSON(http.StatusNotFound, nil)
		return
	}
	c.JSON(http.StatusOK, employee)
}

// @Id list-employee
// @Security BearerAuth
// @Summary List employees
// @Tags employee
// @Description List employees
// @Param listOptions query service.ListEmployeeOptions true "List options"
// @Success 200 {slice} entity.Employee
// @Failure 400 {object} error
// @Router /employee [get]
func (r *employeeRoutes) listEmployee(c *gin.Context) {
	var listOptions service.ListEmployeeOptions
	if err := c.ShouldBindQuery(&listOptions); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	employees, err := r.opts.Services.Employee.List(listOptions)
	if err != nil {
		if errs.IsExpected(err) {
			c.JSON(http.StatusBadRequest, err)
			return
		}
		c.JSON(http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, employees)
}

// @Id update-employee
// @Security BearerAuth
// @Summary Update employee
// @Tags employee
// @Description Update employee
// @Param id path string true "Employee ID"
// @Param employee body entity.Employee true "Employee"
// @Success 200 {object} entity.Employee
// @Failure 400 {object} error
// @Router /employee/{id} [put]
func (r *employeeRoutes) updateEmployee(c *gin.Context) {
	id := c.Param("id")

	var employee entity.Employee
	if err := c.ShouldBindJSON(&employee); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	updatedEmployee, err := r.opts.Services.Employee.Update(id, &employee)
	if err != nil {
		if errs.IsExpected(err) {
			c.JSON(http.StatusBadRequest, err)
			return
		}
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, updatedEmployee)
}

// @Id delete-employee
// @Security BearerAuth
// @Summary Delete employee
// @Tags employee
// @Description Delete employee
// @Param id path string true "Employee ID"
// @Success 200
// @Failure 400 {object} error
// @Router /employee/{id} [delete]
func (r *employeeRoutes) deleteEmployee(c *gin.Context) {
	err := r.opts.Services.Employee.Delete(c.Param("id"))
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

type loginRequestBody struct {
	EmployeeID string `form:"employeeId" binding:"required"`
	Password   string `form:"password" binding:"required"`
}

type loginResponseBody struct {
	Employee  entity.Employee `json:"employee"`
	AuthToken string          `json:"authToken"`
}

// @Id login
// @Summary Login
// @Tags employee
// @Description Login
// @Param fields body loginRequestBody true "login data"
// @Success 200 {object} loginResponseBody
// @Failure 400 {object} error
// @Router /employee/login [post]
func (r *employeeRoutes) login(c *gin.Context) {
	var body loginRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	employee, token, err := r.opts.Services.Employee.Login(body.EmployeeID, body.Password)
	if err != nil {
		if errs.IsExpected(err) {
			c.JSON(http.StatusBadRequest, err)
			return
		}
		c.JSON(http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, loginResponseBody{
		Employee:  *employee,
		AuthToken: token,
	})
}
