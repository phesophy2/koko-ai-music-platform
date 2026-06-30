use actix_web::{web, HttpRequest, HttpResponse, Responder, get};
use crate::db::PgPool;
use crate::api::handlers::extract_user_id;
use crate::services::dashboard_service::*;

#[get("/dashboard/stats")]
pub async fn dashboard_stats(
    pool: web::Data<PgPool>,
    req_http: HttpRequest,
) -> impl Responder {
    let user_id = match extract_user_id(&req_http) {
        Ok(uid) => uid,
        Err(resp) => return resp,
    };

    match get_dashboard_stats(pool.get_ref(), user_id).await {
        Ok(stats) => HttpResponse::Ok().json(stats),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to fetch dashboard stats: {}", e)
        })),
    }
}

#[get("/dashboard/recent")]
pub async fn dashboard_recent(
    pool: web::Data<PgPool>,
    req_http: HttpRequest,
) -> impl Responder {
    let user_id = match extract_user_id(&req_http) {
        Ok(uid) => uid,
        Err(resp) => return resp,
    };

    match get_dashboard_recent(pool.get_ref(), user_id).await {
        Ok(recent) => HttpResponse::Ok().json(recent),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to fetch recent activity: {}", e)
        })),
    }
}
