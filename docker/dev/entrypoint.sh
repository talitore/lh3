#!/bin/bash
set -e

# Remove a potentially pre-existing server.pid for Rails
rm -f /rails/tmp/pids/server.pid

# Install dependencies
if [ -f Gemfile ]; then
  echo "Installing Ruby dependencies..."
  bundle check || bundle install
fi

# Ensure pnpm is installed
if ! command -v pnpm &> /dev/null
then
    echo "pnpm could not be found, installing..."
    npm install -g corepack
    corepack enable
    corepack prepare pnpm@10 --activate
fi

if [ -f package.json ]; then
  echo "Installing JavaScript dependencies..."
  pnpm install
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
else
  echo "Database doesn't exist, creating and seeding..."
  bundle exec rails db:prepare
fi

# Execute the command provided as arguments
exec "$@"
