#!/bin/bash

cd "$(dirname "$0")"

echo "=== 1. Building React app ==="
npm run build

echo ""
echo "=== 2. Bundling server.ts ==="
npx esbuild server.ts --bundle --platform=node --format=esm --outfile=working-server.js \
  --external:better-sqlite3 \
  --external:multer \
  --external:express \
  --external:xlsx \
  --external:dotenv

echo ""
echo "=== Done! ==="
echo "Run 'node working-server.js' to start the server"
