use actix_web::{web, HttpRequest, HttpResponse, Responder, post, get, put, delete};
use uuid::Uuid;
use crate::models::*;
use crate::db::PgPool;
use crate::api::handlers::extract_user_id;
use crate::queue::{self, GenerationTask, publish_generation_task};
use crate::config::Config;

#[post("/projects")]
pub async fn create_project(
    pool: web::Data<PgPool>,
    req: web::Json<CreateProjectRequest>,
    req_http: HttpRequest,
) -> impl Responder {
    let user_id = match extract_user_id(&req_http) {
        Ok(uid) => uid,
        Err(resp) => return resp,
    };

    let project_id = Uuid::new_v4();

    let result = sqlx::query(
        "INSERT INTO projects (id, user_id, artist_id, hex_id, structure, topic, duration, status, emotion, intensity, prompt_version, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())"
    )
    .bind(project_id)
    .bind(user_id)
    .bind(req.artist_id)
    .bind(&req.hex_id)
    .bind(&req.structure)
    .bind(&req.topic)
    .bind(req.duration)
    .bind("draft")
    .bind(&req.emotion)
    .bind(req.intensity)
    .bind(1i32)
    .execute(pool.get_ref())
    .await;

    match result {
        Ok(_) => {
            let response = ProjectResponse {
                id: project_id,
                artist_id: req.artist_id,
                hex_id: req.hex_id.clone(),
                structure: req.structure.clone(),
                topic: req.topic.clone(),
                duration: req.duration,
                status: "draft".to_string(),
                emotion: req.emotion.clone(),
                intensity: req.intensity,
                created_at: chrono::Utc::now(),
            };

            HttpResponse::Created().json(response)
        }
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to create project: {}", e)
        })),
    }
}

#[get("/projects")]
pub async fn list_projects(
    pool: web::Data<PgPool>,
    req_http: HttpRequest,
) -> impl Responder {
    let user_id = match extract_user_id(&req_http) {
        Ok(uid) => uid,
        Err(resp) => return resp,
    };

    let rows = sqlx::query_as::<_, Project>(
        "SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC"
    )
    .bind(user_id)
    .fetch_all(pool.get_ref())
    .await;

    match rows {
        Ok(projects) => {
            let responses: Vec<ProjectResponse> = projects.into_iter().map(|p| ProjectResponse {
                id: p.id,
                artist_id: p.artist_id,
                hex_id: p.hex_id,
                structure: p.structure,
                topic: p.topic,
                duration: p.duration,
                status: p.status,
                emotion: p.emotion,
                intensity: p.intensity,
                created_at: p.created_at,
            }).collect();

            HttpResponse::Ok().json(responses)
        }
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to fetch projects: {}", e)
        })),
    }
}

#[get("/projects/{id}")]
pub async fn get_project(
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
    req_http: HttpRequest,
) -> impl Responder {
    let user_id = match extract_user_id(&req_http) {
        Ok(uid) => uid,
        Err(resp) => return resp,
    };

    let project_id = path.into_inner();

    let row = sqlx::query_as::<_, Project>(
        "SELECT * FROM projects WHERE id = $1 AND user_id = $2"
    )
    .bind(project_id)
    .bind(user_id)
    .fetch_optional(pool.get_ref())
    .await;

    match row {
        Ok(Some(project)) => {
            let response = ProjectResponse {
                id: project.id,
                artist_id: project.artist_id,
                hex_id: project.hex_id,
                structure: project.structure,
                topic: project.topic,
                duration: project.duration,
                status: project.status,
                emotion: project.emotion,
                intensity: project.intensity,
                created_at: project.created_at,
            };

            HttpResponse::Ok().json(response)
        }
        Ok(None) => HttpResponse::NotFound().json(serde_json::json!({
            "error": "Project not found"
        })),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to fetch project: {}", e)
        })),
    }
}

#[put("/projects/{id}")]
pub async fn update_project(
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
    req: web::Json<CreateProjectRequest>,
    req_http: HttpRequest,
) -> impl Responder {
    let user_id = match extract_user_id(&req_http) {
        Ok(uid) => uid,
        Err(resp) => return resp,
    };

    let project_id = path.into_inner();

    let existing = sqlx::query(
        "SELECT id FROM projects WHERE id = $1 AND user_id = $2"
    )
    .bind(project_id)
    .bind(user_id)
    .fetch_optional(pool.get_ref())
    .await;

    match existing {
        Ok(None) => {
            return HttpResponse::NotFound().json(serde_json::json!({
                "error": "Project not found"
            }));
        }
        Err(e) => {
            return HttpResponse::InternalServerError().json(serde_json::json!({
                "error": format!("Database error: {}", e)
            }));
        }
        _ => {}
    }

    let result = sqlx::query(
        "UPDATE projects SET artist_id = $1, hex_id = $2, structure = $3, topic = $4, duration = $5, emotion = $6, intensity = $7, updated_at = NOW() WHERE id = $8 AND user_id = $9"
    )
    .bind(req.artist_id)
    .bind(&req.hex_id)
    .bind(&req.structure)
    .bind(&req.topic)
    .bind(req.duration)
    .bind(&req.emotion)
    .bind(req.intensity)
    .bind(project_id)
    .bind(user_id)
    .execute(pool.get_ref())
    .await;

    match result {
        Ok(_) => {
            let updated = sqlx::query_as::<_, Project>("SELECT * FROM projects WHERE id = $1")
                .bind(project_id)
                .fetch_one(pool.get_ref())
                .await;

            match updated {
                Ok(project) => {
                    let response = ProjectResponse {
                        id: project.id,
                        artist_id: project.artist_id,
                        hex_id: project.hex_id,
                        structure: project.structure,
                        topic: project.topic,
                        duration: project.duration,
                        status: project.status,
                        emotion: project.emotion,
                        intensity: project.intensity,
                        created_at: project.created_at,
                    };

                    HttpResponse::Ok().json(response)
                }
                Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
                    "error": format!("Failed to fetch updated project: {}", e)
                })),
            }
        }
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to update project: {}", e)
        })),
    }
}

#[delete("/projects/{id}")]
pub async fn delete_project(
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
    req_http: HttpRequest,
) -> impl Responder {
    let user_id = match extract_user_id(&req_http) {
        Ok(uid) => uid,
        Err(resp) => return resp,
    };

    let project_id = path.into_inner();

    let result = sqlx::query(
        "DELETE FROM projects WHERE id = $1 AND user_id = $2"
    )
    .bind(project_id)
    .bind(user_id)
    .execute(pool.get_ref())
    .await;

    match result {
        Ok(res) => {
            if res.rows_affected() == 0 {
                HttpResponse::NotFound().json(serde_json::json!({
                    "error": "Project not found"
                }))
            } else {
                HttpResponse::Ok().json(serde_json::json!({
                    "message": "Project deleted successfully"
                }))
            }
        }
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to delete project: {}", e)
        })),
    }
}

#[post("/projects/{id}/generate")]
pub async fn generate_song(
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
    req: web::Json<GenerateSongRequest>,
    req_http: HttpRequest,
    nats: web::Data<async_nats::Client>,
    config: web::Data<Config>,
) -> impl Responder {
    let user_id = match extract_user_id(&req_http) {
        Ok(uid) => uid,
        Err(resp) => return resp,
    };

    let project_id = path.into_inner();

    let project = sqlx::query_as::<_, Project>(
        "SELECT * FROM projects WHERE id = $1 AND user_id = $2"
    )
    .bind(project_id)
    .bind(user_id)
    .fetch_optional(pool.get_ref())
    .await;

    let project = match project {
        Ok(Some(p)) => p,
        Ok(None) => return HttpResponse::NotFound().json(serde_json::json!({
            "error": "Project not found"
        })),
        Err(e) => return HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Database error: {}", e)
        })),
    };

    let queue_id = Uuid::new_v4();
    let emotion = req.emotion.clone();
    let topic = req.topic.clone().unwrap_or_else(|| project.topic.clone());

    let _ = sqlx::query(
        r#"INSERT INTO generation_queue (id, project_id, stage, status, progress, retry_count, max_retries, created_at)
           VALUES ($1, $2, 'initializing', 'pending', 0, 0, 3, NOW())"#
    )
    .bind(queue_id)
    .bind(project_id)
    .execute(pool.get_ref())
    .await;

    let _ = sqlx::query(
        "UPDATE projects SET status = 'generating', updated_at = NOW() WHERE id = $1"
    )
    .bind(project_id)
    .execute(pool.get_ref())
    .await;

    let task = GenerationTask {
        queue_id,
        project_id,
        artist_id: project.artist_id,
        user_id,
        emotion,
        intensity: req.intensity,
        topic,
        structure: project.structure,
        duration: project.duration,
    };

    if let Err(e) = publish_generation_task(nats.get_ref(), &task).await {
        log::warn!("Failed to publish generation task to NATS: {}", e);
    }

    let estimated_cost = crate::services::cost_optimizer::estimate_cost(project.duration, req.intensity);

    HttpResponse::Accepted().json(serde_json::json!({
        "queue_id": queue_id,
        "project_id": project_id,
        "status": "pending",
        "estimated_cost": estimated_cost.total,
        "estimated_duration": 45
    }))
}
