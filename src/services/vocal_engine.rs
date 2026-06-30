use crate::models::Artist;
use rand::Rng;

#[derive(Debug, Clone)]
pub struct VocalParameters {
    pub pitch_drift: f64,
    pub timing_variation: f64,
    pub breathiness: f64,
    pub raspiness: f64,
    pub warmth: f64,
    pub vocal_cracks: f64,
    pub natural_breathing: bool,
    pub lip_smacks: bool,
}

pub fn generate_vocal_parameters(artist: &Artist, emotion: &str, intensity: i32) -> VocalParameters {
    let mut rng = rand::thread_rng();

    let intensity_factor = intensity as f64 / 100.0;

    let (breathiness_base, pitch_drift_base, raspiness_base) = match emotion.to_lowercase().as_str() {
        "sad" | "melancholic" | "emotional" => (60.0, 12.0, 10.0),
        "happy" | "joyful" | "excited" => (20.0, 6.0, 20.0),
        "angry" | "aggressive" => (15.0, 8.0, 70.0),
        "romantic" | "love" => (40.0, 10.0, 5.0),
        "confident" | "powerful" => (10.0, 5.0, 40.0),
        _ => (30.0, 8.0, 25.0),
    };

    let (texture_warmth, texture_rasp) = {
        let mut warmth = 50.0;
        let mut rasp = 20.0;
        for tex in &artist.vocal_texture {
            match tex.to_lowercase().as_str() {
                "warm" | "rich" => warmth += 20.0,
                "bright" | "clear" => warmth -= 10.0,
                "raspy" | "gravelly" => rasp += 35.0,
                "breathy" | "airy" => warmth += 10.0,
                _ => {}
            }
        }
        (warmth.clamp(0.0, 100.0), rasp.clamp(0.0, 100.0))
    };

    let vocal_type_factor = match artist.vocal_type.to_lowercase().as_str() {
        "soprano" | "tenor" => 1.2,
        "alto" | "baritone" => 1.0,
        "bass" => 0.8,
        "falsetto" => 1.4,
        "mixed" => 1.1,
        _ => 0.9,
    };

    let raw_drift = pitch_drift_base * vocal_type_factor;
    let raw_timing = 35.0 + (intensity_factor * 15.0);

    VocalParameters {
        pitch_drift: (raw_drift + rng.gen_range(-2.0..2.0)).clamp(5.0, 15.0),
        timing_variation: (raw_timing + rng.gen_range(-5.0..5.0)).clamp(20.0, 50.0),
        breathiness: (breathiness_base + rng.gen_range(-10.0..10.0) + intensity_factor * 5.0).clamp(0.0, 100.0),
        raspiness: (raspiness_base + texture_rasp + intensity_factor * 15.0).clamp(0.0, 100.0),
        warmth: (texture_warmth + rng.gen_range(-10.0..10.0)).clamp(0.0, 100.0),
        vocal_cracks: (rng.gen::<f64>() * 30.0 + intensity_factor * 20.0).clamp(0.0, 100.0),
        natural_breathing: rng.gen_bool(0.85),
        lip_smacks: rng.gen_bool(0.35),
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
            vibe: vec!["Upbeat".into()],
            vocal_type: "tenor".into(),
            vocal_texture: vec!["warm".into(), "raspy".into()],
            vocal_technique: vec!["belting".into()],
            delivery_style: vec!["smooth".into()],
            influences: vec!["Bowie".into()],
            brand: "Test Brand".into(),
            target_audience: serde_json::json!({}),
            story: "Test story".into(),
            is_active: true,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        }
    }

    #[test]
    fn test_generates_valid_params() {
        let artist = test_artist();
        let params = generate_vocal_parameters(&artist, "sad", 50);
        assert!(params.pitch_drift >= 5.0 && params.pitch_drift <= 15.0);
        assert!(params.timing_variation >= 20.0 && params.timing_variation <= 50.0);
        assert!(params.breathiness >= 0.0 && params.breathiness <= 100.0);
        assert!(params.raspiness >= 0.0 && params.raspiness <= 100.0);
        assert!(params.warmth >= 0.0 && params.warmth <= 100.0);
        assert!(params.vocal_cracks >= 0.0 && params.vocal_cracks <= 100.0);
    }

    #[test]
    fn test_emotion_affects_breathiness() {
        let artist = test_artist();
        let sad = generate_vocal_parameters(&artist, "sad", 50);
        let happy = generate_vocal_parameters(&artist, "happy", 50);
        assert!(sad.breathiness > happy.breathiness);
    }
}
