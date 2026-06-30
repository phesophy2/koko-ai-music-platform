# Webhooks

Webhooks notify your application when events occur in the Koko platform.

## Registering a webhook

```
POST /api/v1/webhooks
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://your-app.com/webhooks/koko",
  "events": ["generation.complete", "generation.failed"],
  "secret": "your-webhook-secret"
}
```

## Supported events

| Event                  | Description                     |
|------------------------|---------------------------------|
| generation.complete    | Music generation finished       |
| generation.failed      | Music generation failed         |
| track.uploaded         | New track uploaded              |
| artist.updated         | Artist profile updated          |

## Payload format

```json
{
  "event": "generation.complete",
  "id": "evt_abc123",
  "created_at": "2026-01-15T12:00:00Z",
  "data": { ... }
}
```

## Verification

Verify webhooks by comparing the `X-Koko-Signature` header against an HMAC-SHA256 of the body using your secret.
