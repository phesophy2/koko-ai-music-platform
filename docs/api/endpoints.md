# KOKO API v1.0

## Base URL

`https://api.koko.ai/v1`

## Authentication

All endpoints require JWT authentication except `/auth/*`.

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Auth Service

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| POST | `/auth/refresh` | Refresh JWT token |
| POST | `/auth/logout` | Logout user |
| GET | `/auth/me` | Get current user |

### Artist Service

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/artists` | List all artists |
| GET | `/artists/:id` | Get artist details |
| GET | `/artists/:id/dna` | Get artist DNA |

### Project Service

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/projects` | Create project |
| GET | `/projects` | List projects |
| GET | `/projects/:id` | Get project |
| PUT | `/projects/:id` | Update project |
| DELETE | `/projects/:id` | Delete project |
| POST | `/projects/:id/generate` | Generate song |

### Song Service

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/songs` | List songs |
| GET | `/songs/:id` | Get song |
| GET | `/songs/:id/stream` | Stream audio |
| POST | `/songs/:id/like` | Like song |
| POST | `/songs/:id/share` | Share song |
| POST | `/songs/:id/comment` | Comment on song |

### Generation Service

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/generation/status/:queue_id` | Get generation status |
| POST | `/generation/retry/:queue_id` | Retry generation |
| DELETE | `/generation/:queue_id` | Cancel generation |

### Dashboard Service

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/stats` | Get dashboard stats |
| GET | `/dashboard/recent` | Get recent projects |
| GET | `/dashboard/analytics` | Get analytics data |

## Request/Response Examples

### Register User

```
POST /auth/register
```

Request:
```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "username": "music_lover"
}
```

Response:
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "username": "music_lover",
    "credits": 50,
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Generate Song

```
POST /projects/:id/generate
```

Request:
```json
{
  "emotion": "sad",
  "intensity": 8,
  "topic": "Heartbreak in the Digital Age"
}
```

Response:
```json
{
  "queue_id": "660e8400-e29b-41d4-a716-446655440000",
  "project_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "pending",
  "estimated_cost": 0.16,
  "estimated_duration": 45
}
```
