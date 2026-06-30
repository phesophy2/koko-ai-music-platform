# Authentication

The Koko AI Music Platform uses JWT-based authentication.

## Obtaining a token

```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your-password"
}
```

Response:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

## Using the token

Include the token in the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## Refresh tokens

```
POST /api/v1/auth/refresh
Authorization: Bearer <token>
```

## API Keys

Machine-to-machine integrations use API keys passed via the `X-API-Key` header.
