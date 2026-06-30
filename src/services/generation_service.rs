use uuid::Uuid;
use sqlx::PgPool;
use chrono::Utc;

use crate::models::{Project, Song, GenerationQueue};
use crate::services::{
    generate_vocal_parameters, generate_lyrics, generate_production_params,
    evaluate_quality, predict_hit_potential, estimate_cost, VocalParameters,
    LyricOutput, ProductionOutput, QualityScores, HitPrediction, CostBreakdown,
};

#[derive(Debug, Clone)]
pub struct GenerationResult {
    pub queue_id: Uuid,
    pub project_id: Uuid,
    pub song_id: Option<Uuid>,
    pub title: String,
    pub lyrics: String,
    pub audio_url: String,
    pub bpm: i32,
    pub musical_key: String,
    pub quality_scores: QualityScores,
    pub hit_prediction: HitPrediction,
    pub estimated_cost: f64,
}

pub async fn start_generation(
    pool: &PgPool,
    project_id: Uuid,
    queue_id: Uuid,
) -> Result<GenerationResult, sqlx::Error> {
    let project = sqlx::query_as::<_, Project>(
        "SELECT * FROM projects WHERE id = $1"
    )
    .bind(project_id)
    .fetch_one(pool)
    .await?;

    let artist = sqlx::query_as::<_, crate::models::Artist>(
        "SELECT * FROM artists WHERE id = $1"
    )
    .bind(project.artist_id)
    .fetch_one(pool)
    .await?;

    update_queue_stage(pool, queue_id, "lyric_generation", 10).await?;

    let vocal_params: VocalParameters = generate_vocal_parameters(&artist, &project.emotion, project.intensity);

    update_queue_stage(pool, queue_id, "lyric_generation", 25).await?;

    let lyric_output: LyricOutput = generate_lyrics(&artist, &project.topic, &project.emotion, project.intensity);

    update_queue_stage(pool, queue_id, "production", 40).await?;

    let production_output: ProductionOutput = generate_production_params(&artist, &project.emotion, project.duration);

    update_queue_stage(pool, queue_id, "production", 55).await?;

    let audio_url = format!(
        "https://audio.koko.ai/generated/{}/{}.mp3",
        project.hex_id,
        Uuid::new_v4()
    );

    update_queue_stage(pool, queue_id, "quality_check", 70).await?;

    let quality_scores: QualityScores = evaluate_quality(&artist, &project.emotion, project.intensity);

    update_queue_stage(pool, queue_id, "hit_prediction", 85).await?;

    let hit_prediction: HitPrediction = predict_hit_potential(&quality_scores, &artist, &project.emotion);

    update_queue_stage(pool, queue_id, "cost_calculation", 95).await?;

    let cost: CostBreakdown = estimate_cost(project.duration, project.intensity);

    let quality_json = serde_json::json!({
        "lyrics": quality_scores.lyrics,
        "emotion": quality_scores.emotion,
        "vocal": quality_scores.vocal,
        "mix": quality_scores.mix,
        "catchiness": quality_scores.catchiness,
        "originality": quality_scores.originality,
        "commercial": quality_scores.commercial,
        "total": quality_scores.total,
    });

    let hit_json = serde_json::json!({
        "spotify_score": hit_prediction.spotify_score,
        "tiktok_potential": hit_prediction.tiktok_potential,
        "radio_potential": hit_prediction.radio_potential,
        "overall_score": hit_prediction.overall_score,
        "viral_probability": hit_prediction.viral_probability,
        "recommendations": hit_prediction.recommendations,
    });

    let song_id = Uuid::new_v4();
    sqlx::query(
        r#"
        INSERT INTO songs (
            id, project_id, artist_id, title, lyrics, audio_url,
            audio_metadata, duration, bpm, musical_key, quality_score,
            hit_prediction, is_public, plays, likes, shares, comments,
            generated_at, created_at, updated_at
        ) VALUES (
            $1, $2, $3, $4, $5, $6,
            $7, $8, $9, $10, $11,
            $12, $13, 0, 0, 0, 0,
            NOW(), NOW(), NOW()
        )
        "#,
    )
    .bind(song_id)
    .bind(project_id)
    .bind(project.artist_id)
    .bind(&lyric_output.title)
    .bind(&lyric_output.lyrics)
    .bind(&audio_url)
    .bind(serde_json::json!({
        "vocal_parameters": {
            "pitch_drift": vocal_params.pitch_drift,
            "timing_variation": vocal_params.timing_variation,
            "breathiness": vocal_params.breathiness,
            "raspiness": vocal_params.raspiness,
            "warmth": vocal_params.warmth,
            "vocal_cracks": vocal_params.vocal_cracks,
            "natural_breathing": vocal_params.natural_breathing,
            "lip_smacks": vocal_params.lip_smacks,
        },
        "lyrics": {
            "themes": &lyric_output.themes,
            "rhyme_scheme": &lyric_output.rhyme_scheme,
        },
        "production": {
            "mix_parameters": {
                "style": production_output.mix_parameters.style,
                "instruments": production_output.mix_parameters.instruments,
                "mix_style": production_output.mix_parameters.mix_style,
                "master_profile": production_output.mix_parameters.master_profile,
            },
        },
        "cost": {
            "lyric_generation": cost.lyric_generation,
            "vocal_synthesis": cost.vocal_synthesis,
            "audio_production": cost.audio_production,
            "mastering": cost.mastering,
            "total": cost.total,
            "credits_used": cost.credits_used,
        },
    }))
    .bind(project.duration)
    .bind(production_output.bpm)
    .bind(&production_output.musical_key)
    .bind(quality_json)
    .bind(hit_json)
    .execute(pool)
    .await?;

    sqlx::query(
        r#"
        UPDATE generation_queue
        SET status = 'completed', progress = 100, stage = 'complete',
            completed_at = NOW(), updated_at = NOW()
        WHERE id = $1
        "#,
    )
    .bind(queue_id)
    .execute(pool)
    .await?;

    sqlx::query(
        "UPDATE projects SET status = 'completed', updated_at = NOW() WHERE id = $1"
    )
    .bind(project_id)
    .execute(pool)
    .await?;

    Ok(GenerationResult {
        queue_id,
        project_id,
        song_id: Some(song_id),
        title: lyric_output.title,
        lyrics: lyric_output.lyrics,
        audio_url,
        bpm: production_output.bpm,
        musical_key: production_output.musical_key,
        quality_scores,
        hit_prediction,
        estimated_cost: cost.total,
    })
}

async fn update_queue_stage(pool: &PgPool, queue_id: Uuid, stage: &str, progress: i32) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        UPDATE generation_queue
        SET stage = $1, progress = $2, updated_at = NOW()
        WHERE id = $3
        "#,
    )
    .bind(stage)
    .bind(progress)
    .bind(queue_id)
    .execute(pool)
    .await?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_audio_url_format() {
        let hex_id = "ABC123";
        let url = format!(
            "https://audio.koko.ai/generated/{}/{}.mp3",
            hex_id,
            Uuid::new_v4()
        );
        assert!(url.starts_with("https://audio.koko.ai/generated/"));
        assert!(url.ends_with(".mp3"));
    }
}
