#!/bin/bash
set -e

echo "Validating js-routes are up-to-date"

bin/rails js:routes

echo "Checking for uncommitted changes in app/frontend/routes/index.js"
if ! git diff --exit-code app/frontend/routes/index.js; then
  echo "❌ js-routes file is out of sync!"
  echo "The generated JavaScript routes file (app/frontend/routes/index.js) has uncommitted changes."
  echo "This usually means the routes.rb file was modified but the js-routes file wasn't regenerated and committed."
  echo ""
  echo "To fix this:"
  echo "1. Run: bin/rails js:routes"
  echo "2. Commit the updated app/frontend/routes/index.js file"
  echo ""
  echo "Diff:"
  exit 1
fi
echo "✅ js-routes file is up-to-date"
