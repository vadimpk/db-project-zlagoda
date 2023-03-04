package main

import (
	"github.com/vadimpk/db-project-zlagoda/api/config"
	"github.com/vadimpk/db-project-zlagoda/api/internal/app"
)

func main() {
	cfg := config.Get()
	app.Run(cfg)
}
