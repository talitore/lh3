.PHONY: setup build up down restart ps logs sh console migrate test prep-test lint format

# Default target
all: help

# Help
help:
	@echo "LH3 - Development Commands"
	@echo ""
	@echo "Usage:"
	@echo "  make setup     - Initial setup (build containers and prepare database)"
	@echo "  make build     - Build or rebuild containers"
	@echo "  make up        - Start all containers in detached mode"
	@echo "  make up-logs   - Start all containers and show logs"
	@echo "  make down      - Stop and remove all containers"
	@echo "  make restart   - Restart all containers"
	@echo "  make ps        - Show container status"
	@echo "  make logs      - View container logs"
	@echo "  make sh        - Open a shell in the web container"
	@echo "  make console   - Open a Rails console"
	@echo "  make migrate   - Run database migrations"
	@echo "  make test      - Run tests"
	@echo "  make prep-test - Prepare test database and run tests"
	@echo "  make rspec     - Run RSpec tests"
	@echo "  make lint      - Run linters"
	@echo "  make format    - Run code formatters"
	@echo "  make clean     - Remove all containers, volumes, and images"
	@echo "  make clean-orphans - Remove orphaned containers"

# Docker compose file path
COMPOSE_FILE = docker/docker-compose.yml

# Setup
setup: clean-orphans build
	docker compose -f $(COMPOSE_FILE) up -d postgres
	sleep 5  # Give PostgreSQL time to initialize
	docker compose -f $(COMPOSE_FILE) run --rm web bin/rails db:prepare
	@echo "Setup complete! Run 'make up' to start the application."

# Build containers
build:
	docker compose -f $(COMPOSE_FILE) build

# Start containers
up: clean-orphans
	docker compose -f $(COMPOSE_FILE) up -d
	@echo "Application is running at http://localhost:3000"

# Start containers with logs
up-logs: clean-orphans
	docker compose -f $(COMPOSE_FILE) up

# Stop containers
down:
	docker compose -f $(COMPOSE_FILE) down

# Restart containers
restart: down up

# Show container status
ps:
	docker compose -f $(COMPOSE_FILE) ps

# View logs
logs:
	docker compose -f $(COMPOSE_FILE) logs -f

# Open a shell
sh:
	docker compose -f $(COMPOSE_FILE) exec web bash

# Open a Rails console
console:
	docker compose -f $(COMPOSE_FILE) exec web bin/rails console

# Run migrations
migrate:
	docker compose -f $(COMPOSE_FILE) exec web bin/rails db:migrate

# Run tests
# TODO: need to ensure RAILS_ENV/NODE_ENV to test
test:
	docker compose -f $(COMPOSE_FILE) exec web bin/rails db:test:prepare spec

# Run linters
lint:
	docker compose -f $(COMPOSE_FILE) exec web bundle exec rubocop

# Run formatters
format:
	docker compose -f $(COMPOSE_FILE) exec web bundle exec rubocop -a
	docker compose -f $(COMPOSE_FILE) exec web pnpm run format:fix
	docker compose -f $(COMPOSE_FILE) exec web pnpm run lint:fix

# Clean everything
clean:
	docker compose -f $(COMPOSE_FILE) down -v --rmi all

# Clean orphaned containers
clean-orphans:
	docker compose -f $(COMPOSE_FILE) down --remove-orphans
