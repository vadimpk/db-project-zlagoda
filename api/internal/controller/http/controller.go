package http

import (
	"github.com/apsdehal/go-logger"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"github.com/vadimpk/db-project-zlagoda/api/config"
	"github.com/vadimpk/db-project-zlagoda/api/internal/service"
	"github.com/vadimpk/db-project-zlagoda/api/pkg/errs"
	"net/http"
	"strings"
)

type Options struct {
	Services service.Services
	Storages service.Storages
	Logger   logger.Logger
	Config   *config.Config
}

func New(options Options) http.Handler {
	handler := gin.New()
	handler.Use(corsMiddleware)

	{
		setupEmployeeRoutes(&options, handler)
		setupCustomerCardRoutes(&options, handler)
		setupProductRoutes(&options, handler)
		setupCheckRoutes(&options, handler)
	}

	handler.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	return handler
}

// newAuthMiddleware is used to get auth token from request headers and validate it.
func newAuthMiddleware(opts *Options) gin.HandlerFunc {
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
		c.Set("userID", user.ID)
		return
	}
}

// corsMiddleware - used to allow incoming cross-origin requests.
func corsMiddleware(c *gin.Context) {
    /*c.Header("Access-Control-Allow-Origin", "*")
	c.Header("Access-Control-Allow-Methods", "*")
	c.Header("Access-Control-Allow-Headers", "*")
	c.Header("Content-Type", "application/json")*/
	c.Header("Access-Control-Allow-Origin", "http://localhost:3000")
            c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
            c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Content-Length, Accept-Encoding, Authorization")
            c.Header("Access-Control-Allow-Credentials", "true")

            // Якщо запит методом OPTIONS, повертаємо статус 200
            if c.Request.Method == "OPTIONS" {
                c.AbortWithStatus(200)
                return
            }

            c.Next()
}

