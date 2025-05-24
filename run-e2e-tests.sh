#!/bin/bash

# Set colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=======================================${NC}"
echo -e "${YELLOW}    RUNNING END-TO-END TESTS          ${NC}"
echo -e "${YELLOW}=======================================${NC}"

# Check if port 3000 is already in use
if lsof -i:3000 > /dev/null 2>&1; then
  echo -e "${RED}WARNING: Port 3000 is already in use!${NC}"
  echo -e "${BLUE}Please manually stop any services running on port 3000 before running the tests.${NC}"
  echo -e "${BLUE}You can use 'lsof -i:3000' to see what's using the port.${NC}"
  exit 1
fi

# Set environment variables for testing
export E2E_TESTING_MODE=true
export SKIP_AUTH_CHECKS=true
export MOCK_AUTH_FOR_TESTS=true
export USE_MOCK_DATA=true

echo -e "${BLUE}Running tests with test environment variables set...${NC}"

# Run the tests and capture the output
TEST_OUTPUT=$(pnpm test:e2e:list 2>&1)
# Get the exit code of the test command
EXIT_CODE=$?

# Display the full output for debugging
echo "$TEST_OUTPUT"

echo -e "${YELLOW}=======================================${NC}"
if [ $EXIT_CODE -eq 0 ]; then
  echo -e "${GREEN}✓ END-TO-END TESTS COMPLETED SUCCESSFULLY${NC}"
else
  echo -e "${RED}✗ END-TO-END TESTS FAILED${NC}"
fi
echo -e "${YELLOW}=======================================${NC}"

# Return the original exit code
exit $EXIT_CODE
