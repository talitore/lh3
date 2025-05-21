#!/bin/bash

# Set colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=======================================${NC}"
echo -e "${YELLOW}    RUNNING SPECIFIC TESTS            ${NC}"
echo -e "${YELLOW}=======================================${NC}"

# Check if port 3000 is already in use
if lsof -i:3000 > /dev/null 2>&1; then
  echo -e "${RED}WARNING: Port 3000 is already in use!${NC}"
  echo -e "${BLUE}Please manually stop any services running on port 3000 before running the tests.${NC}"
  echo -e "${BLUE}You can use 'lsof -i:3000' to see what's using the port.${NC}"
  exit 1
fi

# Run the tests with specific environment variables to enable test mode
# and bypass the cookie checks
echo -e "${BLUE}Setting up test environment...${NC}"
echo -e "${BLUE}This will skip authentication checks and use mock data for tests.${NC}"

# Use environment variables to enable test mode and bypass authentication
export MOCK_AUTH_FOR_TESTS=true
export E2E_TESTING_MODE=true
export SKIP_AUTH_CHECKS=true
export USE_MOCK_DATA=true

# Run only the basic tests that should work in mock mode
TEST_OUTPUT=$(pnpm playwright test tests/api/runs.integration.spec.ts --grep "should allow an authenticated organizer to mark a user as attended|should generate a signed URL for an authenticated user" --reporter=./playwright.reporter.ts 2>&1)

# Get the exit code of the test command
EXIT_CODE=$?

# Display the filtered output
echo "$TEST_OUTPUT" | grep -v "WebServer\|Prisma\|Compiled\|Compiling\|Starting\|Ready\|GET\|POST\|PUT\|DELETE" || true

echo -e "${YELLOW}=======================================${NC}"
if [ $EXIT_CODE -eq 0 ]; then
  echo -e "${GREEN}✓ TESTS COMPLETED SUCCESSFULLY${NC}"
else
  echo -e "${RED}✗ TESTS FAILED${NC}"
fi
echo -e "${YELLOW}=======================================${NC}"

# Return the original exit code
exit $EXIT_CODE
