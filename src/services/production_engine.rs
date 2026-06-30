use crate::models::Artist;

#[derive(Debug, Clone)]
pub struct MixParameters {
    pub style: String,
    pub tempo: i32,
    pub key: String,
    pub instruments: Vec<String>,
    pub mix_style: Vec<String>,
    pub master_profile: String,
}

#[derive(Debug, Clone)]
pub struct ProductionOutput {
    pub bpm: i32,
    pub musical_key: String,
    pub mix_parameters: MixParameters,
    pub estimated_duration: i32,
}

struct ArtistProfile {
    bpm_range: (i32, i32),
    default_key: String,
    instruments: Vec<String>,
    mix_styles: Vec<String>,
    master_profile: String,
}

fn get_profile(artist: &Artist) -> ArtistProfile {
    let name = artist.name.to_lowercase();
    let genre = artist.genre.iter().map(|g| g.to_lowercase()).collect::<Vec<_>>();

    if name.contains("raya") || name.contains("raya") {
        ArtistProfile {
            bpm_range: (82, 88),
            default_key: if genre.iter().any(|g| g.contains("pop")) { "C#m".into() } else { "Gm".into() },
            instruments: vec![
                "Piano".into(), "808 Bass".into(), "Synth Pad".into(),
                "Rhodes".into(), "Trap Drums".into(), "Strings".into(),
            ],
            mix_styles: vec!["Wide Stereo".into(), "Warm Low-end".into(), "Bright Vocals".into()],
            master_profile: "Pop-R&B Broadcast".into(),
        }
    } else if name.contains("leo") || name.contains("leo") {
        ArtistProfile {
            bpm_range: (72, 78),
            default_key: "G".into(),
            instruments: vec![
                "Acoustic Guitar".into(), "Pedal Steel".into(), "Banjo".into(),
                "Mandolin".into(), "Kick Snare".into(), "Fiddle".into(),
            ],
            mix_styles: vec!["Natural".into(), "Organic".into(), "Warm".into()],
            master_profile: "Country Radio".into(),
        }
    } else if name.contains("nova") || name.contains("nova") {
        ArtistProfile {
            bpm_range: (82, 88),
            default_key: "Dm".into(),
            instruments: vec![
                "808 Bass".into(), "Hi-Hat Rolls".into(), "Synth Lead".into(),
                "Drums".into(), "Sub Bass".into(), "Orchestral Hits".into(),
            ],
            mix_styles: vec!["Aggressive".into(), "Hard Hitting".into(), "Stereo Widen".into()],
            master_profile: "Loud Rap".into(),
        }
    } else if name.contains("vega") || name.contains("vega") {
        ArtistProfile {
            bpm_range: (125, 132),
            default_key: "Fm".into(),
            instruments: vec![
                "Synth Lead".into(), "Bassline".into(), "Arpeggio".into(),
                "Percussion".into(), "Clap".into(), "Riser FX".into(),
            ],
            mix_styles: vec!["Energetic".into(), "Sidechain Pump".into(), "Big Room".into()],
            master_profile: "EDM Club Master".into(),
        }
    } else if name.contains("luna") || name.contains("luna") {
        ArtistProfile {
            bpm_range: (69, 75),
            default_key: "Bm".into(),
            instruments: vec![
                "Dark Synth".into(), "Sub Bass".into(), "Piano".into(),
                "Ambient Pads".into(), "Trap Drums".into(), "Vocal Chops".into(),
            ],
            mix_styles: vec!["Dark".into(), "Moody".into(), "Minimal".into()],
            master_profile: "Alternative Streaming".into(),
        }
    } else {
        ArtistProfile {
            bpm_range: (80, 120),
            default_key: "Am".into(),
            instruments: vec![
                "Piano".into(), "Drums".into(), "Bass".into(),
                "Synth".into(), "Guitar".into(), "Vocals".into(),
            ],
            mix_styles: vec!["Balanced".into(), "Modern".into()],
            master_profile: "Standard Streaming".into(),
        }
    }
}

pub fn generate_production_params(artist: &Artist, emotion: &str, duration: i32) -> ProductionOutput {
    let profile = get_profile(artist);

    let tempo_modifier = match emotion.to_lowercase().as_str() {
        "sad" | "melancholic" => -3,
        "happy" | "excited" => 3,
        "angry" | "aggressive" => 5,
        "romantic" => -2,
        "confident" | "powerful" => 4,
        _ => 0,
    };

    let bpm = ((profile.bpm_range.0 + profile.bpm_range.1) / 2 + tempo_modifier)
        .max(profile.bpm_range.0)
        .min(profile.bpm_range.1);

    let key_adjust = match emotion.to_lowercase().as_str() {
        "sad" => "m",
        "happy" => "",
        _ => "",
    };

    let musical_key = if !profile.default_key.ends_with('m') || emotion.to_lowercase() == "sad" {
        if key_adjust == "m" && !profile.default_key.ends_with('m') {
            format!("{}m", profile.default_key)
        } else {
            profile.default_key.clone()
        }
    } else {
        profile.default_key.clone()
    };

    let mix_parameters = MixParameters {
        style: artist.genre.first().cloned().unwrap_or_else(|| "Pop".into()),
        tempo: bpm,
        key: musical_key.clone(),
        instruments: profile.instruments,
        mix_style: profile.mix_styles,
        master_profile: profile.master_profile,
    };

    ProductionOutput {
        bpm,
        musical_key,
        mix_parameters,
        estimated_duration: duration,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use uuid::Uuid;
    use chrono::Utc;

    fn artist(name: &str) -> Artist {
        Artist {
            id: Uuid::new_v4(),
            name: name.into(),
            genre: vec!["Pop".into()],
            vibe: vec![],
            vocal_type: "tenor".into(),
            vocal_texture: vec![],
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
    fn test_raya_bpm() {
        let output = generate_production_params(&artist("RAYA"), "happy", 180);
        assert!(output.bpm >= 82 && output.bpm <= 88);
    }

    #[test]
    fn test_vega_bpm() {
        let output = generate_production_params(&artist("VEGA"), "angry", 180);
        assert!(output.bpm >= 125 && output.bpm <= 132);
    }

    #[test]
    fn test_luna_bpm() {
        let output = generate_production_params(&artist("LUNA"), "sad", 180);
        assert!(output.bpm >= 69 && output.bpm <= 75);
    }
}
