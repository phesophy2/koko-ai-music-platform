-- migrations/002_seed_artists.sql
-- Seed 5 Real Human Artists for KOKO AI Music Platform

INSERT INTO artists (id, name, genre, vibe, vocal_type, vocal_texture, vocal_technique, delivery_style, influences, brand, target_audience, story, is_active, created_at, updated_at)
VALUES
(
    'a0000000-0000-0000-0000-000000000001',
    'RAYA',
    ARRAY['Pop-R&B', 'Alternative R&B', 'Neo-Soul'],
    ARRAY['Emotional', 'Vulnerable', 'Intimate', 'Sensual'],
    'Female (Soprano)',
    ARRAY['Crystalline', 'Breathy', 'Smooth', 'Silky'],
    ARRAY['Falsetto', 'Belting', 'Pure Tone', 'Vocal Runs', 'Whisper'],
    ARRAY['Vulnerable', 'Intimate', 'Confessional', 'Conversational'],
    ARRAY['SZA', 'Ariana Grande', 'Jhené Aiko', 'H.E.R.', 'Tinashe'],
    'Emotional vulnerability meets sonic perfection. RAYA turns heartbreak into art.',
    '{"age": "18-34", "gender": ["Female", "Non-binary"], "location": ["USA", "UK", "Canada", "Australia"], "platforms": ["Spotify", "TikTok", "Instagram", "YouTube"], "interests": ["Self-care", "Journaling", "Late-night drives", "Poetry", "Astrology"]}',
    'RAYA was born in a small coastal town, where she spent her nights watching the ocean and writing poetry. Her music captures the feeling of 3 AM conversations—raw, unfiltered, and deeply human. Every song is a page from her diary.',
    true, NOW(), NOW()
),
(
    'a0000000-0000-0000-0000-000000000002',
    'LEO VANCE',
    ARRAY['Country-Pop', 'Folk', 'Americana', 'Singer-Songwriter'],
    ARRAY['Warm', 'Storytelling', 'Authentic', 'Nostalgic'],
    'Male (Baritone)',
    ARRAY['Warm', 'Gravelly', 'Earthy', 'Rich'],
    ARRAY['Folk Strum', 'Crooning', 'Storytelling', 'Harmonica'],
    ARRAY['Storytelling', 'Conversational', 'Nostalgic', 'Down-to-earth'],
    ARRAY['Tyler Childers', 'Zach Bryan', 'Chris Stapleton', 'Jason Isbell', 'Sturgill Simpson'],
    'Stories from the heartland. Leo Vance makes you feel like you''re sitting around a campfire.',
    '{"age": "25-55", "gender": ["Male", "Female"], "location": ["USA", "Canada", "Australia", "UK"], "platforms": ["Spotify", "YouTube", "Apple Music"], "interests": ["Camping", "Fishing", "Truck culture", "Small-town life", "Craft beer"]}',
    'LEO VANCE grew up in a town so small it didn''t have a traffic light. He learned guitar from his grandfather and songwriting from the stories people told at the local diner. His music is a love letter to the places most people drive through.',
    true, NOW(), NOW()
),
(
    'a0000000-0000-0000-0000-000000000003',
    'NOVA',
    ARRAY['Melodic Rap', 'Hip-Hop', 'Trap-Soul', 'Emo-Rap'],
    ARRAY['Dark', 'Introspective', 'Raw', 'Moody'],
    'Male (Tenor)',
    ARRAY['Deep', 'Husky', 'Gritty', 'Warm'],
    ARRAY['Melodic Flow', 'Fast Rap', 'Auto-Tune', 'Layering', 'Ad-libs'],
    ARRAY['Confessional', 'Raw', 'Aggressive', 'Vulnerable'],
    ARRAY['Juice WRLD', 'Lil Peep', 'XXXTentacion', 'Post Malone', 'The Weeknd'],
    'Dark melodies for the midnight thoughts. NOVA turns pain into poetry.',
    '{"age": "16-30", "gender": ["Male", "Female", "Non-binary"], "location": ["USA", "UK", "Canada", "Germany", "Brazil"], "platforms": ["Spotify", "SoundCloud", "TikTok", "YouTube"], "interests": ["Gaming", "Streetwear", "Late-night scrolling", "Mental health", "Tattoos"]}',
    'NOVA grew up in the city that never sleeps—and neither did he. His music was born in abandoned subway stations and rooftop apartments. Every track is a window into the mind of someone who feels too much.',
    true, NOW(), NOW()
),
(
    'a0000000-0000-0000-0000-000000000004',
    'VEGA',
    ARRAY['EDM', 'House', 'Future Bass', 'Pop', 'Dance'],
    ARRAY['Energetic', 'Euphoric', 'Uplifting', 'Electric'],
    'Female (Mezzo-Soprano)',
    ARRAY['Bright', 'Energetic', 'Crisp', 'Powerful'],
    ARRAY['Belting', 'Chest Voice', 'Vocal Fry', 'Harmonies', 'Vocal Chops'],
    ARRAY['Energetic', 'Empowering', 'Euphoric', 'Anthemic'],
    ARRAY['Dua Lipa', 'Lady Gaga', 'Beyoncé', 'Rihanna', 'Kylie Minogue'],
    'Turn up the volume. VEGA is the party you never want to end.',
    '{"age": "18-35", "gender": ["Female", "Male", "Non-binary"], "location": ["USA", "UK", "Germany", "Netherlands", "Spain", "Brazil"], "platforms": ["Spotify", "TikTok", "Instagram", "YouTube"], "interests": ["Festivals", "Fashion", "Dancing", "Travel", "Nightlife"]}',
    'VEGA was born for the spotlight. From her first dance recital at age 4 to selling out clubs by 19, she lives for the moment the beat drops. Her music is pure energy—designed to make you move, scream the lyrics, and lose yourself.',
    true, NOW(), NOW()
),
(
    'a0000000-0000-0000-0000-000000000005',
    'LUNA',
    ARRAY['Dark Pop', 'Art Pop', 'Dream Pop', 'Alternative'],
    ARRAY['Haunting', 'Ethereal', 'Mysterious', 'Atmospheric'],
    'Female (Soprano)',
    ARRAY['Whispered', 'Ethereal', 'Floating', 'Haunting'],
    ARRAY['Whisper', 'Head Voice', 'Vocal Fry', 'Breathy', 'Choral'],
    ARRAY['Haunting', 'Atmospheric', 'Abstract', 'Dreamy'],
    ARRAY['Billie Eilish', 'Lana Del Rey', 'Mitski', 'Florence Welch', 'FKA twigs'],
    'Whispers in the dark. LUNA makes music for the hours between midnight and dawn.',
    '{"age": "16-34", "gender": ["Female", "Non-binary"], "location": ["USA", "UK", "France", "Japan", "South Korea"], "platforms": ["Spotify", "YouTube", "Instagram", "TikTok"], "interests": ["Art", "Photography", "Horror movies", "Dream interpretation", "Philosophy"]}',
    'LUNA exists in the space between dreams and reality. She creates music for the people who lie awake at night, staring at the ceiling, thinking about existence. Her songs are lullabies for the restless mind.',
    true, NOW(), NOW()
)
ON CONFLICT (id) DO NOTHING;
