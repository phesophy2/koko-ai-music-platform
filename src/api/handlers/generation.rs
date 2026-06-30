use actix_web::{web, HttpRequest, HttpResponse, Responder, get};
use uuid::Uuid;
use crate::models::{GenerationQueue, QueueStatusResponse};
use crate::db::PgPool;
use crate::api::handlers::extract_user_id;

#[get("/generation/status/{queue_id}")]
pub async fn get_generation_status(
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
    req_http: HttpRequest,
) -> impl Responder {
    let _user_id = match extract_user_id(&req_http) {
        Ok(uid) => uid,
        Err(resp) => return resp,
    };

    let queue_id = path.into_inner();

    let row = sqlx::query_as::<_, GenerationQueue>(
        "SELECT * FROM generation_queue WHERE id = $1"
    )
    .bind(queue_id)
    .fetch_optional(pool.get_ref())
    .await;

    match row {
        Ok(Some(queue)) => {
            let response = QueueStatusResponse {
                queue_id: queue.id,
                project_id: queue.project_id,
                status: queue.status,
                progress: queue.progress,
                stage: queue.stage,
            };

            HttpResponse::Ok().json(response)
        }
        Ok(None) => HttpResponse::NotFound().json(serde_json::json!({
            "error": "Generation queue item not found"
        })),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to fetch generation status: {}", e)
        })),
    }
}
