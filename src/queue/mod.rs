use async_nats::Client;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GenerationTask {
    pub queue_id: Uuid,
    pub project_id: Uuid,
    pub artist_id: Uuid,
    pub user_id: Uuid,
    pub emotion: String,
    pub intensity: i32,
    pub topic: String,
    pub structure: String,
    pub duration: i32,
}

pub async fn create_client(nats_url: &str) -> Client {
    async_nats::connect_with_options(
        nats_url,
        async_nats::ConnectOptions::new().with_name("koko-backend"),
    )
    .await
    .expect("Failed to connect to NATS")
}

pub async fn publish_generation_task(client: &Client, task: &GenerationTask) -> Result<(), anyhow::Error> {
    let data = serde_json::to_vec(task)?;
    client.publish("generation.tasks", data.into()).await?;
    Ok(())
}
