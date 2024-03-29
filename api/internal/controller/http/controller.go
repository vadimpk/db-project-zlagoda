package http

import (
	"github.com/apsdehal/go-logger"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"github.com/vadimpk/db-project-zlagoda/api/config"
	"github.com/vadimpk/db-project-zlagoda/api/internal/service"
	"github.com/vadimpk/db-project-zlagoda/api/pkg/errs"
	"log"
	"net/http"
	"strings"
)

type Options struct {
	Services service.Services
	Storages service.Storages
	Logger   logger.Logger
	Config   *config.Config
	validate validator.Validate
}

func New(options Options) http.Handler {
	handler := gin.New()
	handler.Use(corsMiddleware())

	validate := validator.New()
	options.validate = *validate

	{
		setupEmployeeRoutes(&options, handler)
		setupCustomerCardRoutes(&options, handler)
		setupProductRoutes(&options, handler)
		setupCheckRoutes(&options, handler)
		setupStatisticsRoutes(&options, handler)
	}

	handler.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	return handler
}

// newAuthMiddleware is used to get auth token from request headers and validate it.
func newAuthMiddleware(opts *Options, role string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get token and check if empty ("Bearer token")
		tokenStringRaw := c.GetHeader("Authorization")
		if tokenStringRaw == "" {
			opts.Logger.Infof("empty Authorization header", "tokenStringRaw", tokenStringRaw)
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "empty Authorization header"})
			return
		}

		// Split Bearer and token
		tokenStringArr := strings.Split(tokenStringRaw, " ")
		if len(tokenStringArr) != 2 {
			opts.Logger.Infof("malformed auth token", "tokenStringArr", tokenStringArr)
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "malformed auth token"})
			return
		}

		tokenString := tokenStringArr[1]

		user, err := opts.Services.Employee.VerifyAccessToken(tokenString)
		if err != nil {
			if errs.IsExpected(err) {
				opts.Logger.Infof(err.Error(), "tokenStringArr", tokenStringArr)
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			}

			opts.Logger.Infof("failed to verify access token", "tokenStringArr", tokenStringArr)
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to verify access token"})
			return
		}
		if role != "" && user.Role != role {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		}
		c.Set("userID", user.ID)
		return
	}
}

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		log.Println(c.Request.Header.Get("Origin"))
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "*")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(200)
			return
		}

		c.Next()
	}
}
