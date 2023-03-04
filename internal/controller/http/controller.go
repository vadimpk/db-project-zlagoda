package http

import (
	"github.com/apsdehal/go-logger"
	"github.com/gin-gonic/gin"
	"github.com/vadimpk/db-project-zlagoda/config"
	"github.com/vadimpk/db-project-zlagoda/internal/service"
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
	}

	return handler
}
