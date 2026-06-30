use actix_web::{web, HttpResponse, Responder, post};
use sqlx::Row;
use uuid::Uuid;
use crate::models::*;
use crate::auth::*;
use crate::config::Config;
use crate::db::PgPool;

#[post("/auth/register")]
pub async fn register(
    pool: web::Data<PgPool>,
    config: web::Data<Config>,
    req: web::Json<CreateUserRequest>,
) -> impl Responder {
    let existing = sqlx::query("SELECT id FROM users WHERE email = $1 OR username = $2")
        .bind(&req.email)
        .bind(&req.username)
        .fetch_optional(pool.get_ref())
        .await;

    match existing {
        Ok(Some(_)) => {
            return HttpResponse::Conflict().json(serde_json::json!({
                "error": "Email or username already exists"
            }));
        }
        Err(e) => {
            return HttpResponse::InternalServerError().json(serde_json::json!({
                "error": format!("Database error: {}", e)
            }));
        }
        _ => {}
    }

    let password_hash = match hash_password(&req.password) {
        Ok(h) => h,
        Err(e) => {
            return HttpResponse::InternalServerError().json(serde_json::json!({
                "error": format!("Failed to hash password: {}", e)
            }));
        }
    };

    let user_id = Uuid::new_v4();

    let result = sqlx::query(
        "INSERT INTO users (id, email, password_hash, username, full_name, credits, role, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())"
    )
    .bind(user_id)
    .bind(&req.email)
    .bind(&password_hash)
    .bind(&req.username)
    .bind(&req.full_name)
    .bind(100i32)
    .bind("user")
    .bind(true)
    .execute(pool.get_ref())
    .await;

    match result {
        Ok(_) => {
            let token = match generate_token(user_id, "user", &config.jwt_secret, config.jwt_expiration) {
                Ok(t) => t,
                Err(e) => {
                    return HttpResponse::InternalServerError().json(serde_json::json!({
                        "error": format!("Failed to generate token: {}", e)
                    }));
                }
            };

            HttpResponse::Created().json(serde_json::json!({
                "token": token,
                "user": {
                    "id": user_id,
                    "email": req.email,
                    "username": req.username,
                    "credits": 100,
                    "role": "user"
                }
            }))
        }
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to create user: {}", e)
        })),
    }
}

#[post("/auth/login")]
pub async fn login(
    pool: web::Data<PgPool>,
    config: web::Data<Config>,
    req: web::Json<LoginRequest>,
) -> impl Responder {
    let row = sqlx::query(
        "SELECT id, email, username, password_hash, credits, role FROM users WHERE email = $1 AND is_active = true"
    )
    .bind(&req.email)
    .fetch_optional(pool.get_ref())
    .await;

    let user = match row {
        Ok(Some(r)) => r,
        Ok(None) => {
            return HttpResponse::Unauthorized().json(serde_json::json!({
                "error": "Invalid email or password"
            }));
        }
        Err(e) => {
            return HttpResponse::InternalServerError().json(serde_json::json!({
                "error": format!("Database error: {}", e)
            }));
        }
    };

    let password_hash: String = user.get("password_hash");
    let valid = match verify_password(&req.password, &password_hash) {
        Ok(v) => v,
        Err(e) => {
            return HttpResponse::InternalServerError().json(serde_json::json!({
                "error": format!("Failed to verify password: {}", e)
            }));
        }
    };

    if !valid {
        return HttpResponse::Unauthorized().json(serde_json::json!({
            "error": "Invalid email or password"
        }));
    }

    let user_id: Uuid = user.get("id");
    let email: String = user.get("email");
    let username: String = user.get("username");
    let credits: i32 = user.get("credits");
    let role: String = user.get("role");

    let _ = sqlx::query("UPDATE users SET last_login = NOW() WHERE id = $1")
        .bind(user_id)
        .execute(pool.get_ref())
        .await;

    let token = match generate_token(user_id, &role, &config.jwt_secret, config.jwt_expiration) {
        Ok(t) => t,
        Err(e) => {
            return HttpResponse::InternalServerError().json(serde_json::json!({
                "error": format!("Failed to generate token: {}", e)
            }));
        }
    };

    HttpResponse::Ok().json(serde_json::json!({
        "token": token,
        "user": {
            "id": user_id,
            "email": email,
            "username": username,
            "credits": credits,
            "role": role
        }
    }))
}
