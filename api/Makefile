build:
	go build -o ./.bin/api cmd/main.go

run: build
	./.bin/api

docs:
	swag init -g cmd/main.go
