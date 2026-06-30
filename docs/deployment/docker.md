# Docker Deployment

## Building images

```bash
# Backend
docker build -f docker/Dockerfile.backend -t koko-backend:latest .

# Frontend
docker build -f docker/Dockerfile.frontend -t koko-frontend:latest .
```

## Running with Compose

```bash
docker compose -f docker/docker-compose.yml up -d
```

## Environment variables

See `.env.example` for all required variables. Set them via a `.env` file or your container runtime.

## Health checks

Services expose a `/health` endpoint. Configure Docker healthcheck in the compose file.
