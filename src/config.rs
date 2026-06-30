use serde::Deserialize;

#[derive(Debug, Clone, Deserialize)]
pub struct Config {
    pub database_url: String,
    pub redis_url: String,
    pub nats_url: String,
    pub jwt_secret: String,
    pub jwt_expiration: i64,
    pub aws_access_key_id: String,
    pub aws_secret_access_key: String,
    pub aws_region: String,
    pub aws_s3_bucket: String,
    pub openai_api_key: String,
    pub suno_api_key: String,
    pub musicgen_api_key: String,
    pub stability_api_key: String,
    pub app_env: String,
    pub app_port: u16,
}

impl Config {
    pub fn from_env() -> Self {
        Self {
            database_url: std::env::var("DATABASE_URL").expect("DATABASE_URL must be set"),
            redis_url: std::env::var("REDIS_URL").unwrap_or_else(|_| "redis://localhost:6379".to_string()),
            nats_url: std::env::var("NATS_URL").unwrap_or_else(|_| "nats://localhost:4222".to_string()),
            jwt_secret: std::env::var("JWT_SECRET").expect("JWT_SECRET must be set"),
            jwt_expiration: std::env::var("JWT_EXPIRATION").unwrap_or_else(|_| "86400".to_string()).parse().unwrap(),
            aws_access_key_id: std::env::var("AWS_ACCESS_KEY_ID").unwrap_or_default(),
            aws_secret_access_key: std::env::var("AWS_SECRET_ACCESS_KEY").unwrap_or_default(),
            aws_region: std::env::var("AWS_REGION").unwrap_or_else(|_| "us-east-1".to_string()),
            aws_s3_bucket: std::env::var("AWS_S3_BUCKET").unwrap_or_default(),
            openai_api_key: std::env::var("OPENAI_API_KEY").unwrap_or_default(),
            suno_api_key: std::env::var("SUNO_API_KEY").unwrap_or_default(),
            musicgen_api_key: std::env::var("MUSICGEN_API_KEY").unwrap_or_default(),
            stability_api_key: std::env::var("STABILITY_API_KEY").unwrap_or_default(),
            app_env: std::env::var("APP_ENV").unwrap_or_else(|_| "development".to_string()),
            app_port: std::env::var("APP_PORT").unwrap_or_else(|_| "8080".to_string()).parse().unwrap(),
        }
    }
}
