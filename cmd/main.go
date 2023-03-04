package main

import (
	"github.com/vadimpk/db-project-zlagoda/config"
	"github.com/vadimpk/db-project-zlagoda/internal/app"
)

func main() {
	cfg := config.Get()
	app.Run(cfg)
}
