package http

import (
	"github.com/apsdehal/go-logger"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"github.com/vadimpk/db-project-zlagoda/api/config"
	"github.com/vadimpk/db-project-zlagoda/api/internal/service"
	"net/http"
)

type Options struct {
	Services service.Services
	Storages service.Storages
	Logger   logger.Logger
	Config   *config.Config
}

func New(options Options) http.Handler {
	handler := gin.New()

	{
		setupEmployeeRoutes(&options, handler)
		setupCustomerCardRoutes(&options, handler)
		setupProductRoutes(&options, handler)
		setupCheckRoutes(&options, handler)
	}

	handler.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	return handler
}
