# TaskFlow Kanban - Makefile for common operations

.PHONY: help build up down logs clean restart test backend frontend db

# Default target
help:
	@echo "TaskFlow Kanban - Available Commands:"
	@echo "  make build     - Build all Docker images"
	@echo "  make up        - Start all services"
	@echo "  make down      - Stop all services"
	@echo "  make restart   - Restart all services"
	@echo "  make logs      - View logs from all services"
	@echo "  make clean     - Remove all containers, volumes, and images"
	@echo "  make test      - Run all tests"
	@echo "  make backend   - Start backend only (development)"
	@echo "  make frontend  - Start frontend only (development)"
	@echo "  make db        - Start database only (development)"

# Production commands
build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

restart:
	docker-compose restart

logs:
	docker-compose logs -f

clean:
	docker-compose down -v --rmi all --remove-orphans
	@echo "Cleaned up all containers, volumes, and images"

# Development commands
dev:
	docker-compose -f docker-compose.dev.yml up

db:
	docker-compose -f docker-compose.dev.yml up postgres

backend:
	@echo "Starting backend in development mode..."
	cd backend && mvn spring-boot:run

frontend:
	@echo "Starting frontend in development mode..."
	cd frontend && npm install && npm start

# Testing
test:
	@echo "Running backend tests..."
	cd backend && mvn test
	@echo "Running frontend tests..."
	cd frontend && npm test

# Database operations
db-migrate:
	@echo "Running database migrations..."
	cd backend && mvn flyway:migrate

db-clean:
	@echo "Cleaning database..."
	cd backend && mvn flyway:clean

# Utility commands
install:
	@echo "Installing backend dependencies..."
	cd backend && mvn clean install -DskipTests
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

update:
	@echo "Updating dependencies..."
	cd backend && mvn versions:use-latest-releases
	cd frontend && npm update
