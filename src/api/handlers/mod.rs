pub mod auth;
pub mod artists;
pub mod projects;
pub mod songs;
pub mod dashboard;
pub mod generation;

use actix_web::{HttpRequest, HttpResponse, web};
use uuid::Uuid;
use crate::auth::verify_token;
use crate::config::Config;

pub fn extract_user_id(req: &HttpRequest) -> Result<Uuid, HttpResponse> {
    let config = req
        .app_data::<web::Data<Config>>()
        .ok_or_else(|| HttpResponse::InternalServerError().json(serde_json::json!({"error": "Server configuration not available"})))?;

    let auth_header = req
        .headers()
        .get("Authorization")
        .ok_or_else(|| HttpResponse::Unauthorized().json(serde_json::json!({"error": "Missing authorization header"})))?;

    let auth_str = auth_header
        .to_str()
        .map_err(|_| HttpResponse::Unauthorized().json(serde_json::json!({"error": "Invalid authorization header"})))?;

    let token = auth_str
        .strip_prefix("Bearer ")
        .ok_or_else(|| HttpResponse::Unauthorized().json(serde_json::json!({"error": "Invalid authorization scheme"})))?;

    let claims = verify_token(token, &config.jwt_secret)
        .map_err(|_| HttpResponse::Unauthorized().json(serde_json::json!({"error": "Invalid or expired token"})))?;

    let user_id = Uuid::parse_str(&claims.sub)
        .map_err(|_| HttpResponse::Unauthorized().json(serde_json::json!({"error": "Invalid token payload"})))?;

    Ok(user_id)
}
