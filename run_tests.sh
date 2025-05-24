#!/bin/bash

# Source zshrc to ensure all environment variables and paths are available
if [ -f "$HOME/.zshrc" ]; then
  source "$HOME/.zshrc"
fi

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Use Node.js v20.13.1
nvm use 20.13.1

# Install pnpm if not available
# command -v pnpm >/dev/null 2>&1 || npm install -g pnpm

# Check if port 3000 is already in use
if lsof -i:3000 > /dev/null 2>&1; then
  echo "WARNING: Port 3000 is already in use!"
  echo "Please manually stop any services running on port 3000 before running the tests."
  echo "You can use 'lsof -i:3000' to see what's using the port."
  exit 1
fi

# Set environment variables for testing
export E2E_TESTING_MODE=true
export SKIP_AUTH_CHECKS=true
export MOCK_AUTH_FOR_TESTS=true
export USE_MOCK_DATA=true

echo "Running tests with test environment variables set..."

# Run the tests
./run-e2e-tests.sh
