import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { api } from '../../lib/api';
import type { Artist } from '../../lib/types';
import { ArtistCard } from '../../components/ArtistCard';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

export default component$(() => {
  const artists = useSignal<Artist[]>([]);
  const loading = useSignal(true);

  useVisibleTask$(async () => {
    try {
      artists.value = await api.getArtists();
    } catch {
      artists.value = [
        { id: 'aurora', name: 'AURORA', genres: ['Pop', 'Electronic'], vibe: ['ethereal', 'dreamy', 'cinematic'], vocalType: 'Soprano', vocalDNA: { timbre: 'Bright', range: 'C4-C6', emotion: 'Ethereal', clarity: 92, power: 78, breathiness: 65, resonance: 85 }, brandStatement: '', story: '', influences: [], targetAudience: [] },
        { id: 'noir', name: 'Noir', genres: ['R&B', 'HipHop'], vibe: ['smooth', 'dark', 'moody'], vocalType: 'Tenor', vocalDNA: { timbre: 'Warm', range: 'A2-A4', emotion: 'Smooth', clarity: 88, power: 82, breathiness: 45, resonance: 90 }, brandStatement: '', story: '', influences: [], targetAudience: [] },
        { id: 'pulse', name: 'PULSE', genres: ['Electronic', 'Pop'], vibe: ['energetic', 'uplifting', 'anthemic'], vocalType: 'Mezzo-Soprano', vocalDNA: { timbre: 'Bright', range: 'G3-B5', emotion: 'Energetic', clarity: 95, power: 88, breathiness: 30, resonance: 82 }, brandStatement: '', story: '', influences: [], targetAudience: [] },
        { id: 'ember', name: 'Ember', genres: ['Indie', 'Rock'], vibe: ['raw', 'passionate', 'intense'], vocalType: 'Alto', vocalDNA: { timbre: 'Rich', range: 'G3-E5', emotion: 'Passionate', clarity: 85, power: 90, breathiness: 55, resonance: 88 }, brandStatement: '', story: '', influences: [], targetAudience: [] },
        { id: 'nova', name: 'Nova', genres: ['Pop', 'R&B'], vibe: ['warm', 'soulful', 'velvety'], vocalType: 'Contralto', vocalDNA: { timbre: 'Smooth', range: 'F3-D5', emotion: 'Soulful', clarity: 90, power: 76, breathiness: 60, resonance: 92 }, brandStatement: '', story: '', influences: [], targetAudience: [] },
      ];
    } finally {
      loading.value = false;
    }
  });

  return (
    <div class="px-4 md:px-8 py-8 max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Artists</h1>
        <p class="text-gray-400">Meet our roster of AI vocalists</p>
      </div>

      {loading.value ? (
        <LoadingSkeleton count={5} />
      ) : (
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {artists.value.map((artist) => (
            <ArtistCard
              key={artist.id}
              id={artist.id}
              name={artist.name}
              genres={artist.genres}
              vibe={artist.vibe}
              vocalType={artist.vocalType}
            />
          ))}
        </div>
      )}
    </div>
  );
});
