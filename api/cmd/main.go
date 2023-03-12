package main

import (
	"github.com/vadimpk/db-project-zlagoda/api/config"
	"github.com/vadimpk/db-project-zlagoda/api/internal/app"
	_ "github.com/vadimpk/db-project-zlagoda/docs"
)

// @title App Zlagoda api
// @version 1.0
// @description project for db market Zlagoda

// @host localhost:8082
// @BasePath /
func main() {
	cfg := config.Get()
	app.Run(cfg)
}
