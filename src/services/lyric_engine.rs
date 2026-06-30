use crate::models::Artist;
use rand::Rng;

#[derive(Debug, Clone)]
pub struct LyricOutput {
    pub title: String,
    pub lyrics: String,
    pub themes: Vec<String>,
    pub rhyme_scheme: String,
}

const RHYME_SCHEMES: &[&str] = &["AABB", "ABAB", "ABBA", "ABCB", "AABBA"];

const SAD_THEMES: &[&str] = &[
    "lost love", "heartbreak", "loneliness", "regret", "goodbye",
    "memories", "emptiness", "tears", "silence", "shadows",
];

const HAPPY_THEMES: &[&str] = &[
    "celebration", "freedom", "summer nights", "first love", "dancing",
    "sunshine", "victory", "adventure", "friendship", "dreams",
];

const ANGRY_THEMES: &[&str] = &[
    "betrayal", "revenge", "rebellion", "truth", "rising up",
    "no surrender", "anger", "storm", "fire", "war",
];

const ROMANTIC_THEMES: &[&str] = &[
    "eternal love", "moonlight", "forever", "embrace", "destiny",
    "passion", "whispers", "soulmates", "tender", "devotion",
];

const CONFIDENT_THEMES: &[&str] = &[
    "unstoppable", "king", "greatness", "legacy", "spotlight",
    "on top", "prove them wrong", "champion", "glory", "invincible",
];

fn pick_themes(emotion: &str, rng: &mut impl Rng, count: usize) -> Vec<String> {
    let pool = match emotion.to_lowercase().as_str() {
        "sad" | "melancholic" | "emotional" => &SAD_THEMES,
        "happy" | "joyful" | "excited" => &HAPPY_THEMES,
        "angry" | "aggressive" => &ANGRY_THEMES,
        "romantic" | "love" => &ROMANTIC_THEMES,
        "confident" | "powerful" => &CONFIDENT_THEMES,
        _ => &HAPPY_THEMES,
    };

    let mut selected: Vec<String> = Vec::new();
    let mut indices: Vec<usize> = (0..pool.len()).collect();
    for i in (0..pool.len()).rev() {
        let j = rng.gen_range(0..=i);
        indices.swap(i, j);
    }
    for &idx in indices.iter().take(count.min(pool.len())) {
        selected.push(pool[idx].to_string());
    }
    selected
}

fn build_verse(lines: usize, theme: &str, rhyme: &str, rng: &mut impl Rng, intensity: i32) -> Vec<String> {
    let intens = intensity as f64 / 100.0;
    let mut verse = Vec::new();

    let line_templates: &[&[&str]] = &[
        &[
            "The {theme} echoes through the {place}",
            "I feel it {adverb} in my {body}",
            "Every {noun} reminds me of {memory}",
            "And I {verb} until the {time} comes",
        ],
        &[
            "Walking through the {place} alone tonight",
            "{adverb} searching for a {noun} of light",
            "The {theme} is all I've ever {verb}",
            "And {memory} is etched in {body} and soul",
        ],
        &[
            "They said it wouldn't last, but here we {verb}",
            "Building {noun}s on promises we {verb}",
            "The {place} is witness to our {theme}",
            "And we {verb} like there's no {time} tomorrow",
        ],
    ];

    let templates = line_templates[rng.gen_range(0..line_templates.len())];
    for _ in 0..lines {
        let raw = templates[rng.gen_range(0..templates.len())];
        let line = raw
            .replace("{theme}", theme)
            .replace("{place}", pick_word(&["city", "darkness", "rain", "wind", "dawn", "night", "silence", "storm"], rng))
            .replace("{adverb}", pick_word(&["slowly", "deeply", "softly", "fiercely", "gently", "quietly", "boldly", "endlessly"], rng))
            .replace("{body}", pick_word(&["heart", "mind", "soul", "chest", "veins", "bones", "skin", "blood"], rng))
            .replace("{noun}", pick_word(&["moment", "shadow", "whisper", "flame", "memory", "dream", "teardrop", "promise"], rng))
            .replace("{memory}", pick_word(&["yesterday", "forever", "always", "never", "tonight", "tomorrow", "our song", "that night"], rng))
            .replace("{verb}", pick_word(&["dance", "burn", "fade", "rise", "fall", "sing", "dream", "wait"], rng))
            .replace("{time}", pick_word(&["morning", "midnight", "sunrise", "twilight", "dawn", "dusk", "end", "beginning"], rng));
        verse.push(line);
    }
    verse
}

fn pick_word(options: &[&str], rng: &mut impl Rng) -> String {
    options[rng.gen_range(0..options.len())].to_string()
}

fn generate_title(theme: &str, emotion: &str, rng: &mut impl Rng, intensity: i32) -> String {
    let prefixes = match emotion.to_lowercase().as_str() {
        "sad" => &["Never", "Lost", "Fading", "Broken", "Empty"][..],
        "happy" => &["Shining", "Dancing", "Wild", "Golden", "Endless"][..],
        "angry" => &["Rising", "Burning", "Shattered", "Defiant", "Storm"][..],
        "romantic" => &["Eternal", "Tender", "Softly", "Cherished", "Heavenly"][..],
        "confident" => &["Unstoppable", "Royal", "On Top", "Legend", "Crown"][..],
        _ => &["Midnight", "Echo", "Crystal", "Velvet", "Infinite"][..],
    };
    let word = theme.split_whitespace().next().unwrap_or("Love");
    let prefix = prefixes[(intensity as usize / 20).min(prefixes.len() - 1)];
    format!("{} {}", prefix, word)
}

pub fn generate_lyrics(artist: &Artist, topic: &str, emotion: &str, intensity: i32) -> LyricOutput {
    let mut rng = rand::thread_rng();
    let rhymer = RHYME_SCHEMES[rng.gen_range(0..RHYME_SCHEMES.len())];
    let themes = pick_themes(emotion, &mut rng, 3);

    let primary_theme = if !topic.is_empty() {
        topic
    } else {
        &themes[0]
    };

    let verse1 = build_verse(4, primary_theme, rhymer, &mut rng, intensity);
    let chorus = build_verse(4, primary_theme, rhymer, &mut rng, intensity);
    let verse2 = build_verse(4, primary_theme, rhymer, &mut rng, intensity);
    let bridge = build_verse(4, primary_theme, rhymer, &mut rng, intensity);

    let title = generate_title(primary_theme, emotion, &mut rng, intensity);

    let mut lyrics = String::new();
    lyrics.push_str(&format!("[Verse 1]\n"));
    for line in &verse1 {
        lyrics.push_str(line);
        lyrics.push('\n');
    }
    lyrics.push('\n');
    lyrics.push_str(&format!("[Chorus]\n"));
    for line in &chorus {
        lyrics.push_str(line);
        lyrics.push('\n');
    }
    lyrics.push('\n');
    lyrics.push_str(&format!("[Verse 2]\n"));
    for line in &verse2 {
        lyrics.push_str(line);
        lyrics.push('\n');
    }
    lyrics.push('\n');
    lyrics.push_str(&format!("[Chorus]\n"));
    for line in &chorus {
        lyrics.push_str(line);
        lyrics.push('\n');
    }
    lyrics.push('\n');
    lyrics.push_str(&format!("[Bridge]\n"));
    for line in &bridge {
        lyrics.push_str(line);
        lyrics.push('\n');
    }
    lyrics.push('\n');
    lyrics.push_str(&format!("[Chorus]\n"));
    for line in &chorus {
        lyrics.push_str(line);
        lyrics.push('\n');
    }

    LyricOutput {
        title,
        lyrics,
        themes,
        rhyme_scheme: rhymer.to_string(),
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
            vocal_texture: vec!["warm".into()],
            vocal_technique: vec!["belting".into()],
            delivery_style: vec!["smooth".into()],
            influences: vec![],
            brand: "Test".into(),
            target_audience: serde_json::json!({}),
            story: "Test".into(),
            is_active: true,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        }
    }

    #[test]
    fn test_generates_lyrics_with_structure() {
        let artist = test_artist();
        let output = generate_lyrics(&artist, "love", "happy", 50);
        assert!(!output.title.is_empty());
        assert!(output.lyrics.contains("[Verse 1]"));
        assert!(output.lyrics.contains("[Chorus]"));
        assert!(output.lyrics.contains("[Verse 2]"));
        assert!(output.lyrics.contains("[Bridge]"));
        assert!(!output.themes.is_empty());
    }
}
