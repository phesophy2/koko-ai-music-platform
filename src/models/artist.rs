use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Artist {
    pub id: Uuid,
    pub name: String,
    pub genre: Vec<String>,
    pub vibe: Vec<String>,
    pub vocal_type: String,
    pub vocal_texture: Vec<String>,
    pub vocal_technique: Vec<String>,
    pub delivery_style: Vec<String>,
    pub influences: Vec<String>,
    pub brand: String,
    pub target_audience: serde_json::Value,
    pub story: String,
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VocalDNA {
    pub r#type: String,
    pub texture: Vec<String>,
    pub technique: Vec<String>,
    pub delivery: Vec<String>,
    pub influences: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ArtistResponse {
    pub id: Uuid,
    pub name: String,
    pub genre: Vec<String>,
    pub vibe: Vec<String>,
    pub vocal_dna: VocalDNA,
    pub brand: String,
    pub target_audience: serde_json::Value,
    pub story: String,
}
