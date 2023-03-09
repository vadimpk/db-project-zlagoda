package http

import (
	"github.com/apsdehal/go-logger"
	"github.com/gin-gonic/gin"
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

	{
		setupEmployeeRoutes(&options, handler)
		setupCustomerCardRoutes(&options, handler)
		setupProductRoutes(&options, handler)
	}

	return handler
}
