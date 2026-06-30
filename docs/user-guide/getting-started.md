# Getting Started

Welcome to Koko AI Music Platform.

## Creating an account

Register at https://app.koko-music.ai/signup or via the API:

```
POST /api/v1/auth/register
{
  "email": "you@example.com",
  "password": "secure-password",
  "name": "Your Name"
}
```

## Generating your first track

```bash
curl -X POST https://api.koko-music.ai/v1/generation/generate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "upbeat electronic with piano melody",
    "duration_seconds": 30,
    "style": "electronic"
  }'
```

Your generated audio will be available for download once processing completes.
