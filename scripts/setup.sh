#!/usr/bin/env bash
set -euo pipefail

echo "==> Koko AI Music Platform Setup"

# Check prerequisites
command -v rustc >/dev/null 2>&1 || { echo "Error: Rust is required"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "Error: Node.js is required"; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "Error: Python 3 is required"; exit 1; }

# Copy environment file
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example"
fi

# Start infrastructure
docker compose up -d postgres redis rabbitmq
echo "Infrastructure started."

# Build backend
cd backend
cargo build
echo "Backend built."

# Install frontend deps
cd ../frontend
npm install
echo "Frontend dependencies installed."

# Setup generation service
cd ../services/generation
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
echo "Generation service ready."

echo "==> Setup complete!"
