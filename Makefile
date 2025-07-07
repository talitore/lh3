.PHONY: setup build up down restart ps logs sh console migrate test prep-test lint format

# Default target
all: help

# Help
help:
	@echo "lh3 - Development Commands"
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
	@echo "  make sh        - Open a shell in the web container (interactive)"
	@echo "  make run CMD='command' - Run a command in the web container (non-interactive)"
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

# Docker compose command (try plugin first, fallback to standalone)
# This simplified the remote agent remote env installed.
DOCKER_COMPOSE = $(shell if docker compose version >/dev/null 2>&1; then echo "docker compose"; else echo "docker-compose"; fi)

# Setup
setup: clean-orphans build
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) up -d postgres
	sleep 5  # Give PostgreSQL time to initialize
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) run --rm web bin/rails db:prepare
	@echo "Setup complete! Run 'make up' to start the application."

# Build containers
build:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) build

# Start containers
up: clean-orphans
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) up -d
	@echo "Application is running at http://localhost:3000"

# Start containers with logs
up-logs: clean-orphans
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) up

# Stop containers
down:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) down

# Restart containers
restart: down up

# Show container status
ps:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) ps

# View logs
logs:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) logs -f

# Open a shell (interactive - may not work in all environments)
sh:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec web bash

# Run a command in the web container (non-interactive)
run:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec -T web bash -c "$(CMD)"

# Open a Rails console
console:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec web bin/rails console

# Run migrations
migrate:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec web bin/rails db:migrate

# Run tests including engine tests
test:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec web bin/rspec spec --format documentation

# Run linters
lint:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec web bundle exec rubocop

# Run formatters
format:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec web bundle exec rubocop -A
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec web npm run format:fix
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec web npm run lint:fix
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec web ./script/validate_js_routes_in_sync.sh

# Clean everything
clean:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) down -v --rmi all

# Clean orphaned containers
clean-orphans:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) down --remove-orphans

dump:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec web bash -c "PGPASSWORD=postgres pg_dump -h postgres -U postgres -d lh3_development > tmp/dev.sql"

restore:
	@echo "⚠️  WARNING: This is a destructive action that will completely reset your development database!"
	@echo "The restore file (tmp/dev.sql) was last modified: $$($(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec web stat -c %y tmp/dev.sql 2>/dev/null || echo 'file not found')"
	@read -p "Are you sure you want to continue? [y/N] " confirm && [ "$$confirm" = "y" ]
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec web bash -c "PGPASSWORD=postgres psql -h postgres -U postgres -d lh3_development -c 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;' && PGPASSWORD=postgres psql -h postgres -U postgres -d lh3_development -f tmp/dev.sql"
