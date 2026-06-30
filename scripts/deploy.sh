#!/usr/bin/env bash
set -euo pipefail

ENV="${1:-staging}"
echo "==> Deploying to $ENV"

case "$ENV" in
  staging)
    docker compose -f docker/docker-compose.yml --env-file .env.staging up -d --build
    ;;
  production)
    echo "Building and pushing images..."
    docker build -f docker/Dockerfile.backend -t koko-backend:latest .
    docker build -f docker/Dockerfile.frontend -t koko-frontend:latest .

    docker tag koko-backend:latest "$ECR_REPO/koko-backend:latest"
    docker tag koko-frontend:latest "$ECR_REPO/koko-frontend:latest"

    docker push "$ECR_REPO/koko-backend:latest"
    docker push "$ECR_REPO/koko-frontend:latest"

    kubectl apply -f kubernetes/
    kubectl rollout restart deployment/koko-api -n koko
    ;;
  *)
    echo "Usage: $0 {staging|production}"
    exit 1
    ;;
esac

echo "==> Deploy to $ENV complete."
