# Data Flow

## Music Generation Flow

1. Client sends generation request to API Gateway
2. Gateway authenticates and forwards to Generation Service
3. Generation Service publishes job to RabbitMQ
4. Worker picks up job, runs model inference on GPU
5. Output audio saved to S3
6. Worker publishes `generation.complete` event
7. Client receives status via WebSocket or polling

## Track Upload Flow

1. Client uploads audio file to Track Service
2. Track Service stores raw file in S3 staging bucket
3. Background job transcodes to target formats (MP3, FLAC, WAV)
4. Transcodes stored in S3 production bucket
5. Metadata persisted in PostgreSQL

## Licensing Flow

1. Artist defines license terms via API
2. License Service validates and stores in database
3. When a track is used, a royalty record is created
4. Periodic payouts calculated and disbursed
