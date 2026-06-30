use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Song {
    pub id: Uuid,
    pub project_id: Uuid,
    pub artist_id: Uuid,
    pub title: String,
    pub description: Option<String>,
    pub lyrics: String,
    pub audio_url: String,
    pub audio_metadata: Option<serde_json::Value>,
    pub poster_url: Option<String>,
    pub duration: Option<i32>,
    pub tags: Vec<String>,
    pub genre: Option<String>,
    pub bpm: Option<i32>,
    pub musical_key: Option<String>,
    pub is_public: bool,
    pub plays: i32,
    pub likes: i32,
    pub shares: i32,
    pub comments: i32,
    pub quality_score: Option<serde_json::Value>,
    pub hit_prediction: Option<serde_json::Value>,
    pub generated_at: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize)]
pub struct SongResponse {
    pub id: Uuid,
    pub project_id: Uuid,
    pub artist_id: Uuid,
    pub title: String,
    pub lyrics: String,
    pub audio_url: String,
    pub poster_url: Option<String>,
    pub duration: Option<i32>,
    pub genre: Option<String>,
    pub bpm: Option<i32>,
    pub musical_key: Option<String>,
    pub quality_score: Option<serde_json::Value>,
    pub hit_prediction: Option<serde_json::Value>,
    pub plays: i32,
    pub likes: i32,
    pub shares: i32,
    pub generated_at: DateTime<Utc>,
}
