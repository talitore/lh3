#!/bin/bash
set -e

# Remove a potentially pre-existing server.pid for Rails
rm -f /rails/tmp/pids/server.pid

# Install dependencies
if [ -f Gemfile ]; then
  echo "Installing Ruby dependencies..."
  bundle check || bundle install
fi

# Install JavaScript dependencies with npm if package.json exists
if [ -f package.json ]; then
  echo "Installing JavaScript dependencies with npm..."
  npm install
fi

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h $DATABASE_HOST; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done
echo "PostgreSQL is up - continuing"

# Setup database if needed
echo "Setting up database..."
if bundle exec rails db:version > /dev/null 2>&1; then
  echo "Database exists, running migrations..."
  bundle exec rails db:migrate
  bundle exec rails db:test:prepare
else
  echo "Database doesn't exist, creating and seeding..."
  bundle exec rails db:setup
fi

# Execute the command provided as arguments
exec "$@"
