use actix_web::{web, HttpRequest, HttpResponse, Responder, get, post};
use uuid::Uuid;
use crate::models::*;
use crate::db::PgPool;
use crate::api::handlers::extract_user_id;

#[get("/songs")]
pub async fn list_songs(
    pool: web::Data<PgPool>,
    req_http: HttpRequest,
) -> impl Responder {
    let user_id = extract_user_id(&req_http).ok();

    let rows = if let Some(uid) = user_id {
        sqlx::query_as::<_, Song>(
            "SELECT s.* FROM songs s LEFT JOIN projects p ON s.project_id = p.id WHERE s.is_public = true OR p.user_id = $1 ORDER BY s.created_at DESC"
        )
        .bind(uid)
        .fetch_all(pool.get_ref())
        .await
    } else {
        sqlx::query_as::<_, Song>(
            "SELECT * FROM songs WHERE is_public = true ORDER BY created_at DESC"
        )
        .fetch_all(pool.get_ref())
        .await
    };

    match rows {
        Ok(songs) => {
            let responses: Vec<SongResponse> = songs.into_iter().map(|s| SongResponse {
                id: s.id,
                project_id: s.project_id,
                artist_id: s.artist_id,
                title: s.title,
                lyrics: s.lyrics,
                audio_url: s.audio_url,
                poster_url: s.poster_url,
                duration: s.duration,
                genre: s.genre,
                bpm: s.bpm,
                musical_key: s.musical_key,
                quality_score: s.quality_score,
                hit_prediction: s.hit_prediction,
                plays: s.plays,
                likes: s.likes,
                shares: s.shares,
                generated_at: s.generated_at,
            }).collect();

            HttpResponse::Ok().json(responses)
        }
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to fetch songs: {}", e)
        })),
    }
}

#[get("/songs/{id}")]
pub async fn get_song(
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
) -> impl Responder {
    let song_id = path.into_inner();

    let row = sqlx::query_as::<_, Song>(
        "SELECT * FROM songs WHERE id = $1"
    )
    .bind(song_id)
    .fetch_optional(pool.get_ref())
    .await;

    match row {
        Ok(Some(song)) => {
            let _ = sqlx::query("UPDATE songs SET plays = plays + 1 WHERE id = $1")
                .bind(song_id)
                .execute(pool.get_ref())
                .await;

            let response = SongResponse {
                id: song.id,
                project_id: song.project_id,
                artist_id: song.artist_id,
                title: song.title,
                lyrics: song.lyrics,
                audio_url: song.audio_url,
                poster_url: song.poster_url,
                duration: song.duration,
                genre: song.genre,
                bpm: song.bpm,
                musical_key: song.musical_key,
                quality_score: song.quality_score,
                hit_prediction: song.hit_prediction,
                plays: song.plays + 1,
                likes: song.likes,
                shares: song.shares,
                generated_at: song.generated_at,
            };

            HttpResponse::Ok().json(response)
        }
        Ok(None) => HttpResponse::NotFound().json(serde_json::json!({
            "error": "Song not found"
        })),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to fetch song: {}", e)
        })),
    }
}

#[get("/songs/{id}/stream")]
pub async fn stream_song(
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
) -> impl Responder {
    let song_id = path.into_inner();

    let row = sqlx::query(
        "SELECT audio_url FROM songs WHERE id = $1"
    )
    .bind(song_id)
    .fetch_optional(pool.get_ref())
    .await;

    match row {
        Ok(Some(row)) => {
            let audio_url: String = row.get("audio_url");
            HttpResponse::TemporaryRedirect()
                .insert_header(("Location", audio_url.as_str()))
                .finish()
        }
        Ok(None) => HttpResponse::NotFound().json(serde_json::json!({
            "error": "Song not found"
        })),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to fetch song: {}", e)
        })),
    }
}

#[post("/songs/{id}/like")]
pub async fn like_song(
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
    req_http: HttpRequest,
) -> impl Responder {
    let _user_id = match extract_user_id(&req_http) {
        Ok(uid) => uid,
        Err(resp) => return resp,
    };

    let song_id = path.into_inner();

    let existing = sqlx::query("SELECT id FROM songs WHERE id = $1")
        .bind(song_id)
        .fetch_optional(pool.get_ref())
        .await;

    match existing {
        Ok(None) => {
            return HttpResponse::NotFound().json(serde_json::json!({
                "error": "Song not found"
            }));
        }
        Err(e) => {
            return HttpResponse::InternalServerError().json(serde_json::json!({
                "error": format!("Database error: {}", e)
            }));
        }
        _ => {}
    }

    let result = sqlx::query("UPDATE songs SET likes = likes + 1 WHERE id = $1")
        .bind(song_id)
        .execute(pool.get_ref())
        .await;

    match result {
        Ok(_) => HttpResponse::Ok().json(serde_json::json!({
            "message": "Song liked successfully"
        })),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to like song: {}", e)
        })),
    }
}
