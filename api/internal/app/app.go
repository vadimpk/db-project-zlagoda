package app

import (
	"database/sql"
	"fmt"
	log "github.com/apsdehal/go-logger"
	_ "github.com/lib/pq"
	"github.com/vadimpk/db-project-zlagoda/api/config"
	"github.com/vadimpk/db-project-zlagoda/api/internal/controller/http"
	"github.com/vadimpk/db-project-zlagoda/api/internal/service"
	"github.com/vadimpk/db-project-zlagoda/api/internal/storage"
	"github.com/vadimpk/db-project-zlagoda/api/pkg/httpserver"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func Run(cfg *config.Config) {
	logger, err := log.New("app", 1, os.Stdout)
	if err != nil {
		panic(err)
	}

	connectionString := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		cfg.PostgreSQL.Host, cfg.PostgreSQL.Port, cfg.PostgreSQL.User, cfg.PostgreSQL.Password, cfg.PostgreSQL.Database)

	db, err := sql.Open("postgres", connectionString)
	if err != nil {
		logger.Fatalf("failed to connect to database: %v", err)
	}
	logger.Info("connected to database")

	defer func(db *sql.DB) {
		err := db.Close()
		if err != nil {
			panic(err)
		}
		logger.Info("disconnected from database")
	}(db)

	storages := service.Storages{
		Employee:     storage.NewEmployeeStorage(logger, db),
		CustomerCard: storage.NewCustomerCardStorage(logger, db),
		Product:      storage.NewProductStorage(logger, db),
		Check:        storage.NewCheckStorage(logger, db),
		Statistics:   storage.NewStatisticsStorage(logger, db),
	}

	serviceOptions := service.Options{
		Logger:   logger,
		Config:   cfg,
		Storages: storages,
	}

	services := service.Services{
		Employee:     service.NewEmployeeService(serviceOptions),
		CustomerCard: service.NewCustomerCardService(serviceOptions),
		Product:      service.NewProductService(serviceOptions),
		Check:        service.NewCheckService(serviceOptions),
		Statistics:   service.NewStatisticsService(serviceOptions),
	}

	httpHandler := http.New(http.Options{
		Services: services,
		Storages: storages,
		Logger:   *logger,
		Config:   cfg,
	})

	httpServer := httpserver.New(
		httpHandler,
		httpserver.Port(cfg.HTTP.Port),
		httpserver.ReadTimeout(time.Second*60),
		httpserver.WriteTimeout(time.Second*60),
		httpserver.ShutdownTimeout(time.Second*30),
	)

	// Waiting signal
	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt, syscall.SIGTERM)

	select {
	case s := <-interrupt:
		logger.Info("received signal: " + s.String())

	case err := <-httpServer.Notify():
		logger.Errorf("failed to receive signal: %v", err)
	}

	err = httpServer.Shutdown()
	if err != nil {
		logger.Errorf("failed to shutdown the server: %v", err)
	}
}
