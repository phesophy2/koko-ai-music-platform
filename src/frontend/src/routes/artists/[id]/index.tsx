import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { useLocation, Link } from '@builder.io/qwik-city';
import { api } from '../../../lib/api';
import type { Artist } from '../../../lib/types';
import { ProgressBar } from '../../../components/ProgressBar';

const fallbackArtists: Record<string, Artist> = {
  raya: { id: 'raya', name: 'RAYA', genres: ['Pop-R&B', 'Alternative R&B'], vibe: ['emotional', 'vulnerable', 'intimate'], vocalType: 'Soprano', vocalDNA: { timbre: 'Crystalline', range: 'C4-C6', emotion: 'Emotional', clarity: 92, power: 78, breathiness: 65, resonance: 85 }, brandStatement: 'Emotional vulnerability meets sonic perfection. RAYA turns heartbreak into art.', story: 'RAYA was born in a small coastal town, where she spent her nights watching the ocean and writing poetry. Her music captures the feeling of 3 AM conversations—raw, unfiltered, and deeply human. Every song is a page from her diary.', influences: ['SZA', 'Ariana Grande', 'Jhené Aiko', 'H.E.R.'], targetAudience: ['Pop fans', 'R&B lovers', 'Late-night listeners'] },
  leo: { id: 'leo', name: 'LEO VANCE', genres: ['Country-Pop', 'Folk'], vibe: ['warm', 'storytelling', 'authentic'], vocalType: 'Baritone', vocalDNA: { timbre: 'Warm', range: 'A2-A4', emotion: 'Storytelling', clarity: 88, power: 82, breathiness: 45, resonance: 90 }, brandStatement: 'Stories from the heartland. Leo Vance makes you feel like you are sitting around a campfire.', story: 'LEO VANCE grew up in a town so small it did not have a traffic light. He learned guitar from his grandfather and songwriting from the stories people told at the local diner.', influences: ['Tyler Childers', 'Zach Bryan', 'Chris Stapleton', 'Jason Isbell'], targetAudience: ['Country fans', 'Folk listeners', 'Storytellers'] },
  nova: { id: 'nova', name: 'NOVA', genres: ['Melodic Rap', 'Hip-Hop'], vibe: ['dark', 'introspective', 'raw'], vocalType: 'Tenor', vocalDNA: { timbre: 'Deep', range: 'A2-A4', emotion: 'Raw', clarity: 85, power: 90, breathiness: 55, resonance: 88 }, brandStatement: 'Dark melodies for the midnight thoughts. NOVA turns pain into poetry.', story: 'NOVA grew up in the city that never sleeps—and neither did he. His music was born in abandoned subway stations and rooftop apartments.', influences: ['Juice WRLD', 'Lil Peep', 'Post Malone', 'The Weeknd'], targetAudience: ['Hip-hop fans', 'Trap lovers', 'Late-night listeners'] },
  vega: { id: 'vega', name: 'VEGA', genres: ['EDM', 'House', 'Pop'], vibe: ['energetic', 'euphoric', 'uplifting'], vocalType: 'Mezzo-Soprano', vocalDNA: { timbre: 'Bright', range: 'G3-B5', emotion: 'Energetic', clarity: 95, power: 88, breathiness: 30, resonance: 82 }, brandStatement: 'Turn up the volume. VEGA is the party you never want to end.', story: 'VEGA was born for the spotlight. From her first dance recital at age 4 to selling out clubs by 19, she lives for the moment the beat drops.', influences: ['Dua Lipa', 'Lady Gaga', 'Beyoncé', 'Rihanna'], targetAudience: ['EDM fans', 'Festival goers', 'Pop listeners'] },
  luna: { id: 'luna', name: 'LUNA', genres: ['Dark Pop', 'Art Pop'], vibe: ['haunting', 'ethereal', 'mysterious'], vocalType: 'Soprano', vocalDNA: { timbre: 'Ethereal', range: 'C4-C6', emotion: 'Haunting', clarity: 90, power: 76, breathiness: 60, resonance: 92 }, brandStatement: 'Whispers in the dark. LUNA makes music for the hours between midnight and dawn.', story: 'LUNA exists in the space between dreams and reality. She creates music for the people who lie awake at night, staring at the ceiling, thinking about existence.', influences: ['Billie Eilish', 'Lana Del Rey', 'Mitski', 'Florence Welch'], targetAudience: ['Art pop fans', 'Alternative listeners', 'Night owls'] },
};

export default component$(() => {
  const loc = useLocation();
  const artistId = loc.params.id;
  const artist = useSignal<Artist | null>(null);
  const loading = useSignal(true);

  useVisibleTask$(async () => {
    try {
      artist.value = await api.getArtist(artistId);
    } catch {
      artist.value = fallbackArtists[artistId] || fallbackArtists['raya'];
    } finally {
      loading.value = false;
    }
  });

  if (loading.value) {
    return (
      <div class="px-4 md:px-8 py-8 max-w-4xl mx-auto">
        <div class="shimmer rounded-2xl h-96 w-full" />
      </div>
    );
  }

  if (!artist.value) {
    return (
      <div class="px-4 md:px-8 py-8 max-w-4xl mx-auto text-center">
        <p class="text-gray-400">Artist not found</p>
        <Link href="/artists" class="text-purple-accent hover:underline mt-4 inline-block">Back to Artists</Link>
      </div>
    );
  }

  const a = artist.value;

  return (
    <div class="px-4 md:px-8 py-8 max-w-4xl mx-auto">
      <Link href="/artists" class="text-sm text-gray-500 hover:text-purple-accent transition-colors mb-6 inline-block">
        ← Back to Artists
      </Link>

      <div class="glass rounded-2xl p-8 mb-8 animate-fade-in">
        <div class="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div class="w-32 h-32 rounded-full bg-gradient-to-br from-purple-accent to-pink-secondary flex items-center justify-center flex-shrink-0">
            <span class="text-5xl font-bold text-white">{a.name.charAt(0)}</span>
          </div>

          <div class="flex-1 text-center md:text-left">
            <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">{a.name}</h1>
            <p class="text-gray-400 mb-4">{a.vocalType}</p>

            <div class="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
              {a.genres.map((genre) => (
                <span key={genre} class="text-xs px-3 py-1 rounded-full bg-purple-accent/20 text-purple-300">
                  {genre}
                </span>
              ))}
              {a.vibe.map((v) => (
                <span key={v} class="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-400">
                  #{v}
                </span>
              ))}
            </div>

            <p class="text-gray-300 italic leading-relaxed">{a.brandStatement}</p>
          </div>
        </div>
      </div>

      <div class="glass rounded-2xl p-8 mb-8">
        <h2 class="text-xl font-semibold text-white mb-4">Vocal DNA</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div class="space-y-2 mb-4">
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">Timbre</span>
                <span class="text-white">{a.vocalDNA.timbre}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">Range</span>
                <span class="text-white">{a.vocalDNA.range}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">Emotion</span>
                <span class="text-white">{a.vocalDNA.emotion}</span>
              </div>
            </div>
          </div>
          <div class="space-y-3">
            <ProgressBar value={a.vocalDNA.clarity} label="Clarity" />
            <ProgressBar value={a.vocalDNA.power} label="Power" />
            <ProgressBar value={a.vocalDNA.breathiness} label="Breathiness" />
            <ProgressBar value={a.vocalDNA.resonance} label="Resonance" />
          </div>
        </div>
      </div>

      <div class="glass rounded-2xl p-8 mb-8">
        <h2 class="text-xl font-semibold text-white mb-4">Story</h2>
        <p class="text-gray-300 leading-relaxed">{a.story}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="glass rounded-2xl p-6">
          <h2 class="text-lg font-semibold text-white mb-4">Influences</h2>
          <div class="flex flex-wrap gap-2">
            {a.influences.map((inf) => (
              <span key={inf} class="text-sm px-3 py-1.5 rounded-lg bg-white/5 text-gray-300">
                {inf}
              </span>
            ))}
          </div>
        </div>

        <div class="glass rounded-2xl p-6">
          <h2 class="text-lg font-semibold text-white mb-4">Target Audience</h2>
          <div class="flex flex-wrap gap-2">
            {a.targetAudience.map((aud) => (
              <span key={aud} class="text-sm px-3 py-1.5 rounded-lg bg-purple-accent/10 text-purple-300">
                {aud}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
