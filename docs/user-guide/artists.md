# Artists

Artists represent creators on the Koko platform.

## Creating an artist profile

```
POST /api/v1/artists
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "AI Composer",
  "bio": "An AI-powered music producer.",
  "genres": ["electronic", "ambient"],
  "avatar_url": "https://cdn.koko-music.ai/avatars/artist.png"
}
```

## Managing artists

- `GET /artists` — List all artists
- `GET /artists/{id}` — Get artist details
- `PUT /artists/{id}` — Update artist profile
- `DELETE /artists/{id}` — Remove artist

## Artist dashboard

The web dashboard provides analytics on track plays, revenue, and generation usage.
