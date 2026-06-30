#[derive(Debug, Clone)]
pub struct CostBreakdown {
    pub lyric_generation: f64,
    pub vocal_synthesis: f64,
    pub audio_production: f64,
    pub mastering: f64,
    pub total: f64,
    pub credits_used: i32,
}

const RATE_LYRIC_GENERATION: f64 = 0.002;
const RATE_VOCAL_SYNTHESIS_PER_SECOND: f64 = 0.01;
const RATE_AUDIO_PRODUCTION_PER_SECOND: f64 = 0.015;
const RATE_MASTERING: f64 = 0.005;

const CREDITS_PER_DOLLAR: f64 = 100.0;

pub fn estimate_cost(duration: i32, intensity: i32) -> CostBreakdown {
    let intensity_multiplier = 1.0 + (intensity as f64 / 100.0) * 0.5;
    let duration_secs = duration as f64;

    let lyric_generation = RATE_LYRIC_GENERATION * intensity_multiplier;
    let vocal_synthesis = RATE_VOCAL_SYNTHESIS_PER_SECOND * duration_secs * intensity_multiplier;
    let audio_production = RATE_AUDIO_PRODUCTION_PER_SECOND * duration_secs * intensity_multiplier;
    let mastering = RATE_MASTERING * duration_secs;

    let total = lyric_generation + vocal_synthesis + audio_production + mastering;

    let credits_used = (total * CREDITS_PER_DOLLAR).ceil() as i32;

    CostBreakdown {
        lyric_generation: (lyric_generation * 100.0).round() / 100.0,
        vocal_synthesis: (vocal_synthesis * 100.0).round() / 100.0,
        audio_production: (audio_production * 100.0).round() / 100.0,
        mastering: (mastering * 100.0).round() / 100.0,
        total: (total * 100.0).round() / 100.0,
        credits_used,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_cost_increases_with_duration() {
        let short = estimate_cost(30, 50);
        let long = estimate_cost(180, 50);
        assert!(long.total > short.total);
    }

    #[test]
    fn test_cost_increases_with_intensity() {
        let low = estimate_cost(120, 20);
        let high = estimate_cost(120, 90);
        assert!(high.total > low.total);
    }

    #[test]
    fn test_credits_are_positive() {
        let cost = estimate_cost(60, 50);
        assert!(cost.credits_used > 0);
        assert!(cost.lyric_generation > 0.0);
        assert!(cost.vocal_synthesis > 0.0);
        assert!(cost.audio_production > 0.0);
        assert!(cost.mastering > 0.0);
        assert!(cost.total > 0.0);
    }

    #[test]
    fn test_components_sum_to_total() {
        let cost = estimate_cost(120, 75);
        let sum = cost.lyric_generation + cost.vocal_synthesis + cost.audio_production + cost.mastering;
        assert!((sum - cost.total).abs() < 0.01);
    }
}
