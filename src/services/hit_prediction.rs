use crate::models::Artist;
use crate::services::QualityScores;

#[derive(Debug, Clone)]
pub struct HitPrediction {
    pub spotify_score: f64,
    pub tiktok_potential: f64,
    pub radio_potential: f64,
    pub overall_score: f64,
    pub viral_probability: String,
    pub recommendations: Vec<String>,
}

pub fn predict_hit_potential(quality: &QualityScores, artist: &Artist, emotion: &str) -> HitPrediction {
    let genre_profile = artist.genre.iter().map(|g| g.to_lowercase()).collect::<Vec<_>>();

    let spotify_score = {
        let base = quality.catchiness * 0.35 + quality.commercial * 0.25 + quality.lyrics * 0.2 + quality.mix * 0.2;
        let genre_boost = if genre_profile.iter().any(|g| g.contains("pop") || g.contains("r&b")) {
            8.0
        } else {
            0.0
        };
        (base + genre_boost).clamp(0.0, 100.0)
    };

    let tiktok_potential = {
        let base = quality.catchiness * 0.4 + quality.originality * 0.3 + quality.commercial * 0.2 + quality.emotion * 0.1;
        let vibe_boost = if artist.vibe.iter().any(|v| {
            let v = v.to_lowercase();
            v.contains("trendy") || v.contains("viral") || v.contains("catchy")
        }) {
            10.0
        } else {
            0.0
        };
        (base + vibe_boost).clamp(0.0, 100.0)
    };

    let radio_potential = {
        let base = quality.commercial * 0.35 + quality.mix * 0.25 + quality.lyrics * 0.2 + quality.vocal * 0.2;
        let emotion_boost = match emotion.to_lowercase().as_str() {
            "happy" | "confident" | "romantic" => 10.0,
            "sad" | "melancholic" => 5.0,
            "angry" | "aggressive" => -5.0,
            _ => 0.0,
        };
        (base + emotion_boost).clamp(0.0, 100.0)
    };

    let overall_score = (spotify_score * 0.35 + tiktok_potential * 0.25 + radio_potential * 0.25 + quality.total * 0.15).clamp(0.0, 100.0);

    let viral_probability = if overall_score >= 80.0 {
        "High".to_string()
    } else if overall_score >= 55.0 {
        "Medium".to_string()
    } else {
        "Low".to_string()
    };

    let mut recommendations = Vec::new();

    if spotify_score < 60.0 {
        recommendations.push("Increase catchiness with a stronger hook or chorus".to_string());
    }
    if tiktok_potential < 50.0 {
        recommendations.push("Add a memorable 15-second viral moment in the bridge".to_string());
    }
    if radio_potential < 55.0 {
        recommendations.push("Polish the mix and master for clearer radio playback".to_string());
    }
    if quality.lyrics < 60.0 {
        recommendations.push("Strengthen lyrical storytelling and emotional connection".to_string());
    }
    if quality.emotion < 65.0 {
        recommendations.push("Deepen the emotional delivery and vocal expression".to_string());
    }
    if quality.originality < 50.0 {
        recommendations.push("Incorporate a unique sonic element or unconventional structure".to_string());
    }
    if overall_score >= 75.0 && recommendations.is_empty() {
        recommendations.push("Strong potential — focus on marketing and playlist pitching".to_string());
    }
    if recommendations.is_empty() {
        recommendations.push("Good baseline — consider A/B testing different mix versions".to_string());
    }

    HitPrediction {
        spotify_score,
        tiktok_potential,
        radio_potential,
        overall_score,
        viral_probability,
        recommendations,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::services::QualityScores;
    use uuid::Uuid;
    use chrono::Utc;

    fn test_artist() -> Artist {
        Artist {
            id: Uuid::new_v4(),
            name: "RAYA".into(),
            genre: vec!["Pop".into(), "R&B".into()],
            vibe: vec!["Trendy".into(), "Catchy".into()],
            vocal_type: "alto".into(),
            vocal_texture: vec!["warm".into()],
            vocal_technique: vec![],
            delivery_style: vec![],
            influences: vec![],
            brand: "".into(),
            target_audience: serde_json::json!({}),
            story: "".into(),
            is_active: true,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        }
    }

    fn high_quality() -> QualityScores {
        QualityScores {
            lyrics: 85.0, emotion: 90.0, vocal: 80.0, mix: 85.0,
            catchiness: 92.0, originality: 75.0, commercial: 88.0, total: 85.0,
        }
    }

    #[test]
    fn test_high_quality_viral_high() {
        let artist = test_artist();
        let q = high_quality();
        let pred = predict_hit_potential(&q, &artist, "happy");
        assert_eq!(pred.viral_probability, "High");
        assert!(pred.overall_score >= 80.0);
    }

    #[test]
    fn test_all_scores_in_range() {
        let artist = test_artist();
        let q = high_quality();
        let pred = predict_hit_potential(&q, &artist, "sad");
        assert!(pred.spotify_score >= 0.0 && pred.spotify_score <= 100.0);
        assert!(pred.tiktok_potential >= 0.0 && pred.tiktok_potential <= 100.0);
        assert!(pred.radio_potential >= 0.0 && pred.radio_potential <= 100.0);
        assert!(pred.overall_score >= 0.0 && pred.overall_score <= 100.0);
        assert!(!pred.recommendations.is_empty());
    }
}
