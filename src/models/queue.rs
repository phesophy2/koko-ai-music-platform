use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct GenerationQueue {
    pub id: Uuid,
    pub project_id: Uuid,
    pub stage: String,
    pub status: String,
    pub progress: i32,
    pub error: Option<String>,
    pub retry_count: i32,
    pub max_retries: i32,
    pub started_at: Option<DateTime<Utc>>,
    pub completed_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize)]
pub struct QueueStatusResponse {
    pub queue_id: Uuid,
    pub project_id: Uuid,
    pub status: String,
    pub progress: i32,
    pub stage: String,
}
