#!/bin/bash
set -euo pipefail

cd /rails

if [ -f script/validate_js_routes_in_sync.sh ]; then
  exec bash script/validate_js_routes_in_sync.sh
else
  echo "Validating js-routes (container default check)"
  bin/rails js:routes
  if ! git diff --exit-code app/frontend/routes/index.js; then
    echo "❌ js-routes file is out of sync!"
    echo "Run: bin/rails js:routes and commit app/frontend/routes/index.js"
    exit 1
  fi
  echo "✅ js-routes file is up-to-date"
fi


