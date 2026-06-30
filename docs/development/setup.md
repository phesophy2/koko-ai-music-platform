# Development Setup

## Prerequisites

- Rust 1.75+
- Python 3.12+
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16
- Redis 7

## Getting started

```bash
# Clone the repo
git clone git@github.com:anomalyco/koko-ai-music-platform.git
cd koko-ai-music-platform

# Copy environment file
cp .env.example .env

# Start infrastructure (DB, Redis, RabbitMQ)
docker compose up -d

# Backend (Rust)
cd backend
cargo build
cargo run

# Frontend (React)
cd frontend
npm install
npm run dev

# Generation service (Python)
cd services/generation
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```
