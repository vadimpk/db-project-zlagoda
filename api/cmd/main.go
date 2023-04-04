package main

import (
	"github.com/vadimpk/db-project-zlagoda/api/config"
	_ "github.com/vadimpk/db-project-zlagoda/api/docs"
	"github.com/vadimpk/db-project-zlagoda/api/internal/app"
)

// @title App Zlagoda api
// @version 1.0
// @description project for db market zlagoda

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization

// @host localhost:8082
// @BasePath /
func main() {
	cfg := config.Get()
	app.Run(cfg)
}
