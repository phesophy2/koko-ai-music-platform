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
        { id: 'raya', name: 'RAYA', genres: ['Pop-R&B', 'Alternative R&B'], vibe: ['emotional', 'vulnerable', 'intimate'], vocalType: 'Soprano', vocalDNA: { timbre: 'Crystalline', range: 'C4-C6', emotion: 'Emotional', clarity: 92, power: 78, breathiness: 65, resonance: 85 }, brandStatement: 'Emotional vulnerability meets sonic perfection.', story: '', influences: ['SZA', 'Ariana Grande', 'Jhené Aiko'], targetAudience: ['Pop fans', 'R&B lovers'] },
        { id: 'leo', name: 'LEO VANCE', genres: ['Country-Pop', 'Folk'], vibe: ['warm', 'storytelling', 'authentic'], vocalType: 'Baritone', vocalDNA: { timbre: 'Warm', range: 'A2-A4', emotion: 'Storytelling', clarity: 88, power: 82, breathiness: 45, resonance: 90 }, brandStatement: 'Stories from the heartland.', story: '', influences: ['Tyler Childers', 'Zach Bryan', 'Chris Stapleton'], targetAudience: ['Country fans', 'Folk listeners'] },
        { id: 'nova', name: 'NOVA', genres: ['Melodic Rap', 'Hip-Hop'], vibe: ['dark', 'introspective', 'raw'], vocalType: 'Tenor', vocalDNA: { timbre: 'Deep', range: 'A2-A4', emotion: 'Raw', clarity: 85, power: 90, breathiness: 55, resonance: 88 }, brandStatement: 'Dark melodies for the midnight thoughts.', story: '', influences: ['Juice WRLD', 'Lil Peep', 'Post Malone'], targetAudience: ['Hip-hop fans', 'Trap lovers'] },
        { id: 'vega', name: 'VEGA', genres: ['EDM', 'House', 'Pop'], vibe: ['energetic', 'euphoric', 'uplifting'], vocalType: 'Mezzo-Soprano', vocalDNA: { timbre: 'Bright', range: 'G3-B5', emotion: 'Energetic', clarity: 95, power: 88, breathiness: 30, resonance: 82 }, brandStatement: 'Turn up the volume.', story: '', influences: ['Dua Lipa', 'Lady Gaga', 'Beyoncé'], targetAudience: ['EDM fans', 'Pop listeners'] },
        { id: 'luna', name: 'LUNA', genres: ['Dark Pop', 'Art Pop'], vibe: ['haunting', 'ethereal', 'mysterious'], vocalType: 'Soprano', vocalDNA: { timbre: 'Ethereal', range: 'C4-C6', emotion: 'Haunting', clarity: 90, power: 76, breathiness: 60, resonance: 92 }, brandStatement: 'Whispers in the dark.', story: '', influences: ['Billie Eilish', 'Lana Del Rey', 'Mitski'], targetAudience: ['Art pop fans', 'Alternative listeners'] },
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
