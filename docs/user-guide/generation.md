# Music Generation

## Parameters

| Parameter          | Type   | Default  | Description                        |
|--------------------|--------|----------|------------------------------------|
| prompt             | string | —        | Text description of desired music  |
| duration_seconds   | int    | 30       | Track length in seconds            |
| style              | string | "auto"   | Genre or style tag                 |
| tempo              | int    | 120      | BPM                                |
| key                | string | "C"      | Musical key                        |
| instruments        | array  | []       | List of desired instruments        |

## Statuses

| Status      | Description                    |
|-------------|--------------------------------|
| queued      | Job is waiting in the queue    |
| processing  | Model is generating audio      |
| completed   | Audio is ready for download    |
| failed      | An error occurred              |

## Streaming progress

Connect via WebSocket to `wss://api.koko-music.ai/v1/generation/{id}/stream` for real-time progress updates.
