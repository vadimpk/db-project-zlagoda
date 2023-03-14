package http

import (
	"github.com/gin-gonic/gin"
	"github.com/vadimpk/db-project-zlagoda/api/internal/entity"
	"github.com/vadimpk/db-project-zlagoda/api/internal/service"
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
		group.POST("/", routes.createEmployee)
		group.GET("/:id", routes.getEmployee)
		group.GET("/", routes.listEmployee)
		group.PUT("/:id", routes.updateEmployee)
		group.DELETE("/", routes.deleteEmployee)
	}
}

// @Id create-employee
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
		c.JSON(http.StatusInternalServerError, err)
	}
	c.JSON(http.StatusOK, createdEmployee)
}

// @Id get-employee
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
		c.JSON(http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, employee)
}

// @Id list-employee
// @Summary List employees
// @Tags employee
// @Description List employees
// @Success 200 {object} []entity.Employee
// @Failure 400 {object} error
// @Router /employee [get]
func (r *employeeRoutes) listEmployee(c *gin.Context) {
	employees, err := r.opts.Services.Employee.List(service.ListEmployeeOptions{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, employees)
}

// @Id update-employee
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
		c.JSON(http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, updatedEmployee)
}

// @Id delete-employee
// @Summary Delete employee
// @Tags employee
// @Description Delete employee
// @Param ids body []string true "Employee IDs"
// @Success 200
// @Failure 400 {object} error
// @Router /employee [delete]
func (r *employeeRoutes) deleteEmployee(c *gin.Context) {
	var ids []string
	if err := c.ShouldBindJSON(&ids); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	err := r.opts.Services.Employee.Delete(ids)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, nil)
}
