use uuid::Uuid;
use sqlx::PgPool;

use crate::models::Project;

#[derive(Debug, Clone)]
pub struct DashboardStats {
    pub total_projects: i64,
    pub total_songs: i64,
    pub total_plays: i64,
    pub total_likes: i64,
    pub average_quality: f64,
    pub credits_remaining: i32,
}

pub async fn get_dashboard_stats(pool: &PgPool, user_id: Uuid) -> Result<DashboardStats, sqlx::Error> {
    let projects_row = sqlx::query_scalar::<_, i64>(
        "SELECT COUNT(*) FROM projects WHERE user_id = $1"
    )
    .bind(user_id)
    .fetch_one(pool)
    .await
    .unwrap_or_else(|_| 0);

    let user = sqlx::query_as::<_, crate::models::User>(
        "SELECT * FROM users WHERE id = $1"
    )
    .bind(user_id)
    .fetch_one(pool)
    .await?;

    let songs_stats = sqlx::query_as::<_, (i64, i64, i64)>(
        r#"
        SELECT
            COALESCE(COUNT(*), 0) as song_count,
            COALESCE(SUM(s.plays), 0) as total_plays,
            COALESCE(SUM(s.likes), 0) as total_likes
        FROM songs s
        JOIN projects p ON s.project_id = p.id
        WHERE p.user_id = $1
        "#,
    )
    .bind(user_id)
    .fetch_one(pool)
    .await
    .unwrap_or_else(|_| (0, 0, 0));

    let avg_quality = sqlx::query_scalar::<_, Option<f64>>(
        r#"
        SELECT AVG((s.quality_score->>'total')::numeric)::float8
        FROM songs s
        JOIN projects p ON s.project_id = p.id
        WHERE p.user_id = $1 AND s.quality_score IS NOT NULL
        "#,
    )
    .bind(user_id)
    .fetch_one(pool)
    .await
    .unwrap_or(None)
    .unwrap_or(0.0);

    Ok(DashboardStats {
        total_projects: projects_row,
        total_songs: songs_stats.0,
        total_plays: songs_stats.1,
        total_likes: songs_stats.2,
        average_quality: (avg_quality * 100.0).round() / 100.0,
        credits_remaining: user.credits,
    })
}

pub async fn get_dashboard_recent(pool: &PgPool, user_id: Uuid) -> Result<Vec<Project>, sqlx::Error> {
    get_recent_projects(pool, user_id, 10).await
}

pub async fn get_recent_projects(pool: &PgPool, user_id: Uuid, limit: i64) -> Result<Vec<Project>, sqlx::Error> {
    let projects = sqlx::query_as::<_, Project>(
        r#"
        SELECT * FROM projects
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT $2
        "#,
    )
    .bind(user_id)
    .bind(limit)
    .fetch_all(pool)
    .await?;

    Ok(projects)
}

#[cfg(test)]
mod tests {
    use super::*;
    use chrono::Utc;

    #[test]
    fn test_dashboard_stats_defaults() {
        let stats = DashboardStats {
            total_projects: 0,
            total_songs: 0,
            total_plays: 0,
            total_likes: 0,
            average_quality: 0.0,
            credits_remaining: 100,
        };
        assert_eq!(stats.total_projects, 0);
        assert_eq!(stats.total_songs, 0);
        assert_eq!(stats.credits_remaining, 100);
    }
}
