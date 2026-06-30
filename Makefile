.PHONY: help build test run clean migrate docker-build docker-up docker-down deploy

help:
	@echo "KOKO AI Music Platform - Makefile"
	@echo ""
	@echo "Available commands:"
	@echo "  build           Build the application"
	@echo "  test            Run tests"
	@echo "  run             Run the application"
	@echo "  clean           Clean build artifacts"
	@echo "  migrate         Run database migrations"
	@echo "  docker-build    Build Docker images"
	@echo "  docker-up       Start Docker containers"
	@echo "  docker-down     Stop Docker containers"
	@echo "  deploy          Deploy to production"

build:
	cargo build --release
	npm run build

test:
	cargo test
	npm run test

run:
	cargo run --release &
	npm run start &

clean:
	cargo clean
	rm -rf node_modules
	rm -rf dist

migrate:
	cargo run -- migrate

docker-build:
	docker compose build

docker-up:
	docker compose up -d

docker-down:
	docker compose down

deploy:
	kubectl apply -f kubernetes/
