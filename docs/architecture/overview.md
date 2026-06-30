# Architecture Overview

The Koko AI Music Platform is built on a microservices architecture.

## High-level components

- **API Gateway** — Route requests and handle auth (Rust / Actix-Web)
- **Generation Service** — AI music model inference (Python / PyTorch)
- **Artist Service** — Artist profiles and metadata management
- **Track Service** — Audio file storage and streaming
- **License Service** — Rights and royalty management
- **Frontend** — React SPA served via Nginx
- **Message Queue** — RabbitMQ for async job processing
- **Database** — PostgreSQL (primary), Redis (cache / queues)
- **Object Storage** — S3-compatible for audio files

## Communication

- Synchronous: HTTP/REST between services
- Asynchronous: RabbitMQ for generation jobs and event publishing
- Streaming: WebSocket for real-time generation progress
