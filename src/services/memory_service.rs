use uuid::Uuid;
use sqlx::PgPool;
use chrono::Utc;

use crate::models::Song;

#[derive(Debug, Clone)]
pub struct ArtistMemory {
    pub favorite_words: Vec<String>,
    pub common_bpms: Vec<i32>,
    pub common_keys: Vec<String>,
    pub song_count: i32,
    pub average_quality: f64,
}

pub async fn get_artist_memory(pool: &PgPool, artist_id: Uuid) -> Result<ArtistMemory, sqlx::Error> {
    let songs = sqlx::query_as::<_, Song>(
        r#"
        SELECT * FROM songs
        WHERE artist_id = $1
        ORDER BY created_at DESC
        "#,
    )
    .bind(artist_id)
    .fetch_all(pool)
    .await?;

    let song_count = songs.len() as i32;

    let mut word_freq: std::collections::HashMap<String, i32> = std::collections::HashMap::new();
    let mut bpm_freq: std::collections::HashMap<i32, i32> = std::collections::HashMap::new();
    let mut key_freq: std::collections::HashMap<String, i32> = std::collections::HashMap::new();
    let mut total_quality = 0.0_f64;
    let mut quality_count = 0;

    for song in &songs {
        for word in song.lyrics.split_whitespace() {
            let clean = word.trim_matches(|c: char| !c.is_alphanumeric()).to_lowercase();
            if clean.len() >= 4 {
                *word_freq.entry(clean).or_insert(0) += 1;
            }
        }

        if let Some(bpm) = song.bpm {
            *bpm_freq.entry(bpm).or_insert(0) += 1;
        }

        if let Some(ref key) = song.musical_key {
            *key_freq.entry(key.clone()).or_insert(0) += 1;
        }

        if let Some(ref quality_json) = song.quality_score {
            if let Some(total) = quality_json.get("total").and_then(|v| v.as_f64()) {
                total_quality += total;
                quality_count += 1;
            }
        }
    }

    let mut favorite_words: Vec<String> = {
        let mut words: Vec<(i32, String)> = word_freq.into_iter().map(|(w, c)| (c, w)).collect();
        words.sort_by(|a, b| b.0.cmp(&a.0));
        words.into_iter().take(20).map(|(_, w)| w).collect()
    };

    if favorite_words.is_empty() {
        favorite_words = vec![
            "love".into(), "never".into(), "heart".into(), "forever".into(),
            "dance".into(), "tonight".into(), "dream".into(), "fire".into(),
        ];
    }

    let mut common_bpms: Vec<i32> = {
        let mut bpms: Vec<(i32, i32)> = bpm_freq.into_iter().map(|(b, c)| (c, b)).collect();
        bpms.sort_by(|a, b| b.0.cmp(&a.0));
        bpms.into_iter().take(5).map(|(_, b)| b).collect()
    };

    let mut common_keys: Vec<String> = {
        let mut keys: Vec<(i32, String)> = key_freq.into_iter().map(|(k, c)| (c, k)).collect();
        keys.sort_by(|a, b| b.0.cmp(&a.0));
        keys.into_iter().take(5).map(|(_, k)| k).collect()
    };

    let average_quality = if quality_count > 0 {
        total_quality / quality_count as f64
    } else {
        50.0
    };

    Ok(ArtistMemory {
        favorite_words,
        common_bpms,
        common_keys,
        song_count,
        average_quality,
    })
}

pub async fn update_artist_memory(pool: &PgPool, artist_id: Uuid, song: &Song) -> Result<(), sqlx::Error> {
    let word_count = song.lyrics.split_whitespace().count() as i32;

    sqlx::query(
        r#"
        INSERT INTO artist_memory (
            artist_id, song_id, word_count, bpm, musical_key,
            created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        ON CONFLICT DO NOTHING
        "#,
    )
    .bind(artist_id)
    .bind(song.id)
    .bind(word_count)
    .bind(song.bpm)
    .bind(&song.musical_key)
    .execute(pool)
    .await?;

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_empty_artist_memory_defaults() {
        let memory = ArtistMemory {
            favorite_words: vec![],
            common_bpms: vec![],
            common_keys: vec![],
            song_count: 0,
            average_quality: 50.0,
        };
        assert_eq!(memory.song_count, 0);
        assert_eq!(memory.average_quality, 50.0);
        assert!(memory.favorite_words.is_empty());
    }
}
