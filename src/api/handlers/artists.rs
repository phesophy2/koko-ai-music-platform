use actix_web::{web, HttpResponse, Responder, get};
use uuid::Uuid;
use crate::models::*;
use crate::db::PgPool;

#[get("/artists")]
pub async fn list_artists(pool: web::Data<PgPool>) -> impl Responder {
    let rows = sqlx::query_as::<_, Artist>(
        "SELECT * FROM artists WHERE is_active = true ORDER BY name ASC"
    )
    .fetch_all(pool.get_ref())
    .await;

    match rows {
        Ok(artists) => {
            let responses: Vec<ArtistResponse> = artists.into_iter().map(|a| ArtistResponse {
                id: a.id,
                name: a.name,
                genre: a.genre,
                vibe: a.vibe,
                vocal_dna: VocalDNA {
                    r#type: a.vocal_type,
                    texture: a.vocal_texture,
                    technique: a.vocal_technique,
                    delivery: a.delivery_style,
                    influences: a.influences,
                },
                brand: a.brand,
                target_audience: a.target_audience,
                story: a.story,
            }).collect();

            HttpResponse::Ok().json(responses)
        }
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to fetch artists: {}", e)
        })),
    }
}

#[get("/artists/{id}")]
pub async fn get_artist(pool: web::Data<PgPool>, path: web::Path<Uuid>) -> impl Responder {
    let artist_id = path.into_inner();

    let row = sqlx::query_as::<_, Artist>(
        "SELECT * FROM artists WHERE id = $1 AND is_active = true"
    )
    .bind(artist_id)
    .fetch_optional(pool.get_ref())
    .await;

    match row {
        Ok(Some(artist)) => {
            let response = ArtistResponse {
                id: artist.id,
                name: artist.name,
                genre: artist.genre,
                vibe: artist.vibe,
                vocal_dna: VocalDNA {
                    r#type: artist.vocal_type,
                    texture: artist.vocal_texture,
                    technique: artist.vocal_technique,
                    delivery: artist.delivery_style,
                    influences: artist.influences,
                },
                brand: artist.brand,
                target_audience: artist.target_audience,
                story: artist.story,
            };

            HttpResponse::Ok().json(response)
        }
        Ok(None) => HttpResponse::NotFound().json(serde_json::json!({
            "error": "Artist not found"
        })),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to fetch artist: {}", e)
        })),
    }
}
