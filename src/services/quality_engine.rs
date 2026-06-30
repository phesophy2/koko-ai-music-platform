use crate::models::Artist;
use rand::Rng;
use std::hash::{Hash, Hasher};
use std::collections::hash_map::DefaultHasher;

#[derive(Debug, Clone)]
pub struct QualityScores {
    pub lyrics: f64,
    pub emotion: f64,
    pub vocal: f64,
    pub mix: f64,
    pub catchiness: f64,
    pub originality: f64,
    pub commercial: f64,
    pub total: f64,
}

fn seeded_rng(artist_id: &uuid::Uuid, emotion: &str) -> impl Rng {
    let mut hasher = DefaultHasher::new();
    artist_id.hash(&mut hasher);
    emotion.hash(&mut hasher);
    rand::rngs::StdRng::seed_from_u64(hasher.finish())
}

fn score_with_variation(base: f64, variation: f64, rng: &mut impl Rng) -> f64 {
    let offset = rng.gen_range(-variation..variation);
    (base + offset).clamp(0.0, 100.0)
}

pub fn evaluate_quality(artist: &Artist, emotion: &str, intensity: i32) -> QualityScores {
    let mut rng = seeded_rng(&artist.id, emotion);

    let intensity_bonus = (intensity as f64 / 100.0) * 15.0;

    let (lyrics_base, emotion_base, vocal_base, mix_base, catchiness_base, originality_base, commercial_base) = match emotion.to_lowercase().as_str() {
        "sad" | "melancholic" => (85.0, 90.0, 80.0, 75.0, 65.0, 80.0, 60.0),
        "happy" | "joyful" => (70.0, 80.0, 75.0, 80.0, 90.0, 60.0, 85.0),
        "angry" | "aggressive" => (75.0, 85.0, 85.0, 85.0, 75.0, 75.0, 70.0),
        "romantic" | "love" => (80.0, 85.0, 70.0, 70.0, 70.0, 65.0, 75.0),
        "confident" | "powerful" => (75.0, 80.0, 85.0, 90.0, 85.0, 70.0, 90.0),
        _ => (70.0, 70.0, 70.0, 70.0, 70.0, 65.0, 70.0),
    };

    let artist_bonus = {
        let mut bonus = 0.0;
        for tex in &artist.vocal_texture {
            match tex.to_lowercase().as_str() {
                "warm" => bonus += 3.0,
                "powerful" => bonus += 5.0,
                "versatile" => bonus += 4.0,
                "unique" => bonus += 6.0,
                _ => bonus += 1.0,
            }
        }
        bonus.min(20.0)
    };

    let lyrics = score_with_variation(lyrics_base + intensity_bonus * 0.5, 8.0, &mut rng);
    let emotion = score_with_variation(emotion_base + artist_bonus * 0.3, 5.0, &mut rng);
    let vocal = score_with_variation(vocal_base + artist_bonus, 7.0, &mut rng);
    let mix = score_with_variation(mix_base + intensity_bonus * 0.3, 6.0, &mut rng);
    let catchiness = score_with_variation(catchiness_base + intensity_bonus * 0.7, 10.0, &mut rng);
    let originality = score_with_variation(originality_base + artist_bonus * 0.5, 8.0, &mut rng);
    let commercial = score_with_variation(commercial_base + intensity_bonus * 0.4, 9.0, &mut rng);

    let total = (lyrics + emotion + vocal + mix + catchiness + originality + commercial) / 7.0;

    QualityScores {
        lyrics,
        emotion,
        vocal,
        mix,
        catchiness,
        originality,
        commercial,
        total,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use uuid::Uuid;
    use chrono::Utc;

    fn test_artist() -> Artist {
        Artist {
            id: Uuid::new_v4(),
            name: "Test".into(),
            genre: vec!["Pop".into()],
            vibe: vec![],
            vocal_type: "tenor".into(),
            vocal_texture: vec!["warm".into(), "powerful".into()],
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

    #[test]
    fn test_all_scores_in_range() {
        let artist = test_artist();
        let q = evaluate_quality(&artist, "happy", 50);
        assert!(q.lyrics >= 0.0 && q.lyrics <= 100.0);
        assert!(q.emotion >= 0.0 && q.emotion <= 100.0);
        assert!(q.vocal >= 0.0 && q.vocal <= 100.0);
        assert!(q.mix >= 0.0 && q.mix <= 100.0);
        assert!(q.catchiness >= 0.0 && q.catchiness <= 100.0);
        assert!(q.originality >= 0.0 && q.originality <= 100.0);
        assert!(q.commercial >= 0.0 && q.commercial <= 100.0);
        assert!(q.total >= 0.0 && q.total <= 100.0);
    }

    #[test]
    fn test_total_is_average() {
        let artist = test_artist();
        let q = evaluate_quality(&artist, "sad", 75);
        let expected = (q.lyrics + q.emotion + q.vocal + q.mix + q.catchiness + q.originality + q.commercial) / 7.0;
        assert!((q.total - expected).abs() < 0.01);
    }
}
