package http

import (
	"github.com/apsdehal/go-logger"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"github.com/vadimpk/db-project-zlagoda/api/config"
	service2 "github.com/vadimpk/db-project-zlagoda/api/internal/service"
	"net/http"
)

type Options struct {
	Services service2.Services
	Storages service2.Storages
	Logger   logger.Logger
	Config   *config.Config
}

func New(options Options) http.Handler {
	handler := gin.New()
	handler.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	{
		setupEmployeeRoutes(&options, handler)
		setupCustomerCardRoutes(&options, handler)
		setupProductRoutes(&options, handler)
	}
	return handler
}
