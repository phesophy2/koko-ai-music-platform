use actix_web::{HttpResponse, ResponseError};
use std::fmt;

#[derive(Debug)]
pub enum AppError {
    NotFound(String),
    Unauthorized(String),
    BadRequest(String),
    Conflict(String),
    Internal(String),
    Database(sqlx::Error),
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            AppError::NotFound(msg) => write!(f, "Not found: {}", msg),
            AppError::Unauthorized(msg) => write!(f, "Unauthorized: {}", msg),
            AppError::BadRequest(msg) => write!(f, "Bad request: {}", msg),
            AppError::Conflict(msg) => write!(f, "Conflict: {}", msg),
            AppError::Internal(msg) => write!(f, "Internal error: {}", msg),
            AppError::Database(e) => write!(f, "Database error: {}", e),
        }
    }
}

impl ResponseError for AppError {
    fn error_response(&self) -> HttpResponse {
        match self {
            AppError::NotFound(msg) => HttpResponse::NotFound().json(serde_json::json!({"error": msg})),
            AppError::Unauthorized(msg) => HttpResponse::Unauthorized().json(serde_json::json!({"error": msg})),
            AppError::BadRequest(msg) => HttpResponse::BadRequest().json(serde_json::json!({"error": msg})),
            AppError::Conflict(msg) => HttpResponse::Conflict().json(serde_json::json!({"error": msg})),
            AppError::Internal(msg) => HttpResponse::InternalServerError().json(serde_json::json!({"error": msg})),
            AppError::Database(_) => HttpResponse::InternalServerError().json(serde_json::json!({"error": "Database error"})),
        }
    }
}

impl From<sqlx::Error> for AppError {
    fn from(e: sqlx::Error) -> Self {
        match &e {
            sqlx::Error::RowNotFound => AppError::NotFound("Resource not found".into()),
            _ => AppError::Database(e),
        }
    }
}

impl From<anyhow::Error> for AppError {
    fn from(e: anyhow::Error) -> Self {
        AppError::Internal(e.to_string())
    }
}
