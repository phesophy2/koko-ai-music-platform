use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Project {
    pub id: Uuid,
    pub user_id: Uuid,
    pub artist_id: Uuid,
    pub hex_id: String,
    pub structure: String,
    pub topic: String,
    pub duration: i32,
    pub status: String,
    pub emotion: String,
    pub intensity: i32,
    pub prompt_version: i32,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateProjectRequest {
    pub artist_id: Uuid,
    pub hex_id: String,
    pub structure: String,
    pub topic: String,
    pub duration: i32,
    pub emotion: String,
    pub intensity: i32,
}

#[derive(Debug, Deserialize)]
pub struct GenerateSongRequest {
    pub emotion: String,
    pub intensity: i32,
    pub topic: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct ProjectResponse {
    pub id: Uuid,
    pub artist_id: Uuid,
    pub hex_id: String,
    pub structure: String,
    pub topic: String,
    pub duration: i32,
    pub status: String,
    pub emotion: String,
    pub intensity: i32,
    pub created_at: DateTime<Utc>,
}
