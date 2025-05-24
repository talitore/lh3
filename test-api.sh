#!/bin/bash

# Set colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=======================================${NC}"
echo -e "${YELLOW}    TESTING API ROUTES               ${NC}"
echo -e "${YELLOW}=======================================${NC}"

# Test GET /api/runs
echo -e "${BLUE}Testing GET /api/runs...${NC}"
curl -s -X GET http://localhost:3000/api/runs -H "X-Test-Mode: true" -H "X-Mock-Auth: true" | jq .

# Test POST /api/runs
echo -e "${BLUE}Testing POST /api/runs...${NC}"
curl -s -X POST http://localhost:3000/api/runs \
  -H "Content-Type: application/json" \
  -H "X-Test-Mode: true" \
  -H "X-Mock-Auth: true" \
  -d '{
    "number": 999,
    "descriptor": "Test Run",
    "dateTime": "2025-05-20T12:00:00.000Z",
    "address": "123 Test Street, Testville",
    "lat": 34.0522,
    "lng": -118.2437,
    "introLink": "https://example.com/intro"
  }' | jq .

# Test GET /api/runs/[id]
echo -e "${BLUE}Testing GET /api/runs/[id]...${NC}"
curl -s -X GET http://localhost:3000/api/runs/mock-run-id-1 -H "X-Test-Mode: true" -H "X-Mock-Auth: true" | jq .

# Test PUT /api/runs/[id]
echo -e "${BLUE}Testing PUT /api/runs/[id]...${NC}"
curl -s -X PUT http://localhost:3000/api/runs/mock-run-id-1 \
  -H "Content-Type: application/json" \
  -H "X-Test-Mode: true" \
  -H "X-Mock-Auth: true" \
  -d '{
    "descriptor": "Updated Test Run"
  }' | jq .

echo -e "${YELLOW}=======================================${NC}"
echo -e "${GREEN}✓ API TESTS COMPLETED${NC}"
echo -e "${YELLOW}=======================================${NC}"
