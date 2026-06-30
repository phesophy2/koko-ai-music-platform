import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { useLocation, Link } from '@builder.io/qwik-city';
import { api } from '../../../lib/api';
import type { Artist } from '../../../lib/types';
import { ProgressBar } from '../../../components/ProgressBar';

const fallbackArtists: Record<string, Artist> = {
  aurora: { id: 'aurora', name: 'AURORA', genres: ['Pop', 'Electronic'], vibe: ['ethereal', 'dreamy', 'cinematic'], vocalType: 'Soprano', vocalDNA: { timbre: 'Bright', range: 'C4-C6', emotion: 'Ethereal', clarity: 92, power: 78, breathiness: 65, resonance: 85 }, brandStatement: 'A voice that floats between dimensions — ethereal, celestial, and impossibly pure.', story: 'Born from the convergence of classical vocal training and neural synthesis, AURORA represents the pinnacle of expressive AI vocalists. Her voice carries the warmth of human emotion with the precision of machine learning.', influences: ['Imogen Heap', 'Enya', 'Björk', 'Sigur Rós'], targetAudience: ['Pop producers', 'Film composers', 'Ambient artists', 'Game developers'] },
  noir: { id: 'noir', name: 'Noir', genres: ['R&B', 'HipHop'], vibe: ['smooth', 'dark', 'moody'], vocalType: 'Tenor', vocalDNA: { timbre: 'Warm', range: 'A2-A4', emotion: 'Smooth', clarity: 88, power: 82, breathiness: 45, resonance: 90 }, brandStatement: 'Deep, smooth, and effortlessly cool — the voice of late-night vibes and soulful confessions.', story: 'Noir was developed to capture the essence of classic R&B and modern hip-hop vocals. His rich, warm timbre and impeccable phrasing make him the go-to choice for emotionally resonant tracks.', influences: ['Frank Ocean', 'The Weeknd', 'Bryson Tiller', '6LACK'], targetAudience: ['R&B producers', 'Hip-hop artists', 'Lo-fi creators', 'Podcast intros'] },
  pulse: { id: 'pulse', name: 'PULSE', genres: ['Electronic', 'Pop'], vibe: ['energetic', 'uplifting', 'anthemic'], vocalType: 'Mezzo-Soprano', vocalDNA: { timbre: 'Bright', range: 'G3-B5', emotion: 'Energetic', clarity: 95, power: 88, breathiness: 30, resonance: 82 }, brandStatement: 'Energy that ignites crowds — powerful, bright, and built for the main stage.', story: 'PULSE was engineered for maximum energy and crowd engagement. Her bright, cutting tone cuts through dense mixes while maintaining warmth and emotional connection with listeners.', influences: ['Dua Lipa', 'Lady Gaga', 'Beyoncé', 'Charli XCX'], targetAudience: ['Pop producers', 'EDM artists', 'Commercial composers', 'Fitness playlists'] },
  ember: { id: 'ember', name: 'Ember', genres: ['Indie', 'Rock'], vibe: ['raw', 'passionate', 'intense'], vocalType: 'Alto', vocalDNA: { timbre: 'Rich', range: 'G3-E5', emotion: 'Passionate', clarity: 85, power: 90, breathiness: 55, resonance: 88 }, brandStatement: 'Raw passion meets sonic fire — every note burns with authenticity.', story: 'Ember brings the grit and authenticity of indie rock to the AI vocal landscape. Her rich, textured voice carries the weight of raw emotion, perfect for songs that need to feel real and urgent.', influences: ['Florence Welch', 'Hozier', 'Brandi Carlile', 'Phoebe Bridgers'], targetAudience: ['Indie artists', 'Rock bands', 'Singer-songwriters', 'Folk producers'] },
  nova: { id: 'nova', name: 'Nova', genres: ['Pop', 'R&B'], vibe: ['warm', 'soulful', 'velvety'], vocalType: 'Contralto', vocalDNA: { timbre: 'Smooth', range: 'F3-D5', emotion: 'Soulful', clarity: 90, power: 76, breathiness: 60, resonance: 92 }, brandStatement: 'Velvet vocals with cosmic warmth — soulful sounds from another dimension.', story: 'Nova embodies the perfect blend of pop accessibility and soul depth. Her velvety contralto range provides a unique sonic signature that stands out in any production.', influences: ['Alicia Keys', 'H.E.R.', 'Toni Braxton', 'Jhené Aiko'], targetAudience: ['Pop producers', 'R&B artists', 'Neo-soul creators', 'Commercial composers'] },
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
      artist.value = fallbackArtists[artistId] || fallbackArtists['aurora'];
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
