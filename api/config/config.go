package config

import (
	"log"
	"sync"

	"github.com/ilyakaznacheev/cleanenv"
)

type (
	// Config - represent top level application configuration object.
	Config struct {
		HTTP
		PostgreSQL
	}

	// HTTP - represents http configuration.
	HTTP struct {
		Port string `env:"HTTP_PORT" env-default:"8082"`
	}

	// PostgreSQL - represents PostgreSQL database configuration.
	PostgreSQL struct {
		User     string `env:"POSTGRESQL_USER"     env-default:"root"`
		Password string `env:"POSTGRESQL_PASSWORD" env-default:"postgres"`
		Host     string `env:"POSTGRESQL_HOST"     env-default:"localhost"`
		Port     string `env:"POSTGRESQL_PORT"     env-default:"5433"`
		Database string `env:"POSTGRESQL_DATABASE" env-default:"zlagoda-api"`
	}
)

var (
	config Config
	once   sync.Once
)

// Get returns config.
func Get() *Config {
	once.Do(func() {
		err := cleanenv.ReadEnv(&config)
		if err != nil {
			log.Fatal("failed to read env", err)
		}
	})

	return &config
}
