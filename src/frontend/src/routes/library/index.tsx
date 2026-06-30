import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { api } from '../../lib/api';
import type { Song } from '../../lib/types';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

const genreColors: Record<string, string> = {
  Pop: 'bg-pink-500/20 text-pink-300',
  Rock: 'bg-red-500/20 text-red-300',
  HipHop: 'bg-orange-500/20 text-orange-300',
  R&B: 'bg-purple-500/20 text-purple-300',
  Electronic: 'bg-blue-500/20 text-blue-300',
  Jazz: 'bg-yellow-500/20 text-yellow-300',
  Classical: 'bg-green-500/20 text-green-300',
  Indie: 'bg-teal-500/20 text-teal-300',
};

export default component$(() => {
  const songs = useSignal<Song[]>([]);
  const loading = useSignal(true);
  const search = useSignal('');
  const genreFilter = useSignal('All');
  const viewMode = useSignal<'grid' | 'list'>('grid');

  const allGenres = ['All', 'Pop', 'Electronic', 'R&B', 'HipHop', 'Rock', 'Indie'];

  useVisibleTask$(async () => {
    try {
      songs.value = await api.getSongs();
    } catch {
      songs.value = [
        { id: 's1', title: 'Neon Dreams', artistId: 'pulse', artistName: 'PULSE', genres: ['Electronic', 'Pop'], duration: 234, bpm: 128, key: 'Am', playCount: 12450, likeCount: 892, qualityScores: { melody: 88, harmony: 82, rhythm: 95, structure: 78, production: 92, vocalPerformance: 85, lyricQuality: 76, overall: 85 }, hitPrediction: { score: 82, category: 'Potential Hit', factors: [{ name: 'Catchiness', impact: 90 }, { name: 'Production', impact: 85 }, { name: 'Songwriting', impact: 75 }] }, lyrics: 'Sample lyrics for Neon Dreams...' },
        { id: 's2', title: 'Midnight Rain', artistId: 'noir', artistName: 'Noir', genres: ['R&B'], duration: 198, bpm: 92, key: 'Dm', playCount: 8760, likeCount: 654, qualityScores: { melody: 92, harmony: 88, rhythm: 76, structure: 85, production: 90, vocalPerformance: 94, lyricQuality: 89, overall: 88 }, hitPrediction: { score: 76, category: 'Sleeper Hit', factors: [{ name: 'Vibe', impact: 95 }, { name: 'Vocals', impact: 92 }, { name: 'Lyrics', impact: 85 }] }, lyrics: 'Sample lyrics for Midnight Rain...' },
        { id: 's3', title: 'Stardust', artistId: 'aurora', artistName: 'AURORA', genres: ['Pop', 'Electronic'], duration: 267, bpm: 110, key: 'C', playCount: 15230, likeCount: 1204, qualityScores: { melody: 95, harmony: 90, rhythm: 72, structure: 88, production: 94, vocalPerformance: 96, lyricQuality: 82, overall: 91 }, hitPrediction: { score: 91, category: 'Guaranteed Hit', factors: [{ name: 'Melody', impact: 98 }, { name: 'Vocals', impact: 95 }, { name: 'Production', impact: 90 }] }, lyrics: 'Sample lyrics for Stardust...' },
        { id: 's4', title: 'Wildfire', artistId: 'ember', artistName: 'Ember', genres: ['Indie', 'Rock'], duration: 245, bpm: 140, key: 'Em', playCount: 6540, likeCount: 487, qualityScores: { melody: 82, harmony: 78, rhythm: 88, structure: 80, production: 84, vocalPerformance: 90, lyricQuality: 86, overall: 84 }, hitPrediction: { score: 68, category: 'Underground', factors: [{ name: 'Energy', impact: 92 }, { name: 'Vocals', impact: 88 }, { name: 'Authenticity', impact: 85 }] }, lyrics: 'Sample lyrics for Wildfire...' },
        { id: 's5', title: 'Velvet Sky', artistId: 'nova', artistName: 'Nova', genres: ['Pop', 'R&B'], duration: 212, bpm: 100, key: 'G', playCount: 9890, likeCount: 756, qualityScores: { melody: 90, harmony: 92, rhythm: 74, structure: 82, production: 88, vocalPerformance: 92, lyricQuality: 90, overall: 87 }, hitPrediction: { score: 84, category: 'Potential Hit', factors: [{ name: 'Vocals', impact: 94 }, { name: 'Songwriting', impact: 90 }, { name: 'Production', impact: 85 }] }, lyrics: 'Sample lyrics for Velvet Sky...' },
        { id: 's6', title: 'Electric Heart', artistId: 'pulse', artistName: 'PULSE', genres: ['Electronic'], duration: 256, bpm: 150, key: 'Fm', playCount: 11200, likeCount: 834, qualityScores: { melody: 86, harmony: 80, rhythm: 96, structure: 76, production: 94, vocalPerformance: 82, lyricQuality: 70, overall: 83 }, hitPrediction: { score: 78, category: 'Potential Hit', factors: [{ name: 'Energy', impact: 96 }, { name: 'Production', impact: 92 }, { name: 'Catchiness', impact: 88 }] }, lyrics: 'Sample lyrics for Electric Heart...' },
      ];
    } finally {
      loading.value = false;
    }
  });

  const filteredSongs = () => {
    let result = songs.value;
    if (search.value) {
      const q = search.value.toLowerCase();
      result = result.filter(
        (s) => s.title.toLowerCase().includes(q) || s.artistName.toLowerCase().includes(q)
      );
    }
    if (genreFilter.value !== 'All') {
      result = result.filter((s) => s.genres.includes(genreFilter.value));
    }
    return result;
  };

  return (
    <div class="px-4 md:px-8 py-8 max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Song Library</h1>
        <p class="text-gray-400">Browse and discover AI-generated tracks</p>
      </div>

      <div class="flex flex-col lg:flex-row gap-4 mb-8">
        <div class="flex-1">
          <input
            type="text"
            value={search.value}
            onInput$={(e) => { search.value = (e.target as HTMLInputElement).value; }}
            placeholder="Search songs or artists..."
            class="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-accent transition-colors"
          />
        </div>
        <div class="flex gap-2 flex-wrap">
          {allGenres.map((genre) => (
            <button
              key={genre}
              onClick$={() => { genreFilter.value = genre; }}
              class={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                genreFilter.value === genre
                  ? 'bg-purple-accent text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
        <div class="flex gap-1">
          <button
            onClick$={() => { viewMode.value = 'grid'; }}
            class={`p-2 rounded-lg transition-colors ${viewMode.value === 'grid' ? 'bg-white/10 text-white' : 'text-gray-500'}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z"/></svg>
          </button>
          <button
            onClick$={() => { viewMode.value = 'list'; }}
            class={`p-2 rounded-lg transition-colors ${viewMode.value === 'list' ? 'bg-white/10 text-white' : 'text-gray-500'}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v2H3zm0 7h18v2H3zm0 7h18v2H3z"/></svg>
          </button>
        </div>
      </div>

      {loading.value ? (
        <LoadingSkeleton count={6} />
      ) : filteredSongs().length === 0 ? (
        <div class="glass rounded-2xl p-12 text-center">
          <p class="text-gray-400 text-lg mb-2">No songs found</p>
          <p class="text-gray-500 text-sm">Try adjusting your search or filters</p>
        </div>
      ) : viewMode.value === 'grid' ? (
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSongs().map((song, i) => (
            <Link
              key={song.id}
              href={`/song/${song.id}`}
              class="group block animate-fade-in"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div class="glass rounded-2xl p-5 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-[0_0_30px_rgba(108,92,231,0.25)]">
                <div class="w-full aspect-square rounded-xl bg-gradient-to-br from-purple-accent/30 to-pink-secondary/30 mb-4 flex items-center justify-center group-hover:from-purple-accent/50 group-hover:to-pink-secondary/50 transition-all">
                  <span class="text-4xl opacity-60 group-hover:opacity-100 transition-opacity">♪</span>
                </div>
                <h3 class="text-white font-semibold truncate">{song.title}</h3>
                <p class="text-gray-500 text-sm mb-3">{song.artistName}</p>
                <div class="flex items-center justify-between">
                  <div class="flex gap-1">
                    {song.genres.slice(0, 2).map((g) => (
                      <span key={g} class={`text-[10px] px-2 py-0.5 rounded-full ${genreColors[g] || 'bg-gray-500/20 text-gray-300'}`}>
                        {g}
                      </span>
                    ))}
                  </div>
                  <div class="flex items-center gap-3 text-xs text-gray-500">
                    <span>▶ {song.playCount.toLocaleString()}</span>
                    <span>♥ {song.likeCount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div class="glass rounded-2xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-white/10">
                  <th class="text-left text-xs text-gray-500 font-medium uppercase tracking-wider px-6 py-4">Title</th>
                  <th class="text-left text-xs text-gray-500 font-medium uppercase tracking-wider px-6 py-4">Artist</th>
                  <th class="text-left text-xs text-gray-500 font-medium uppercase tracking-wider px-6 py-4">Genre</th>
                  <th class="text-left text-xs text-gray-500 font-medium uppercase tracking-wider px-6 py-4">Plays</th>
                  <th class="text-left text-xs text-gray-500 font-medium uppercase tracking-wider px-6 py-4">Likes</th>
                  <th class="text-left text-xs text-gray-500 font-medium uppercase tracking-wider px-6 py-4">Quality</th>
                </tr>
              </thead>
              <tbody>
                {filteredSongs().map((song) => (
                  <tr key={song.id} class="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td class="px-6 py-4">
                      <Link href={`/song/${song.id}`} class="text-sm font-medium text-white hover:text-purple-accent transition-colors">
                        {song.title}
                      </Link>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-400">{song.artistName}</td>
                    <td class="px-6 py-4">
                      <div class="flex gap-1">
                        {song.genres.map((g) => (
                          <span key={g} class={`text-[10px] px-2 py-0.5 rounded-full ${genreColors[g] || 'bg-gray-500/20 text-gray-300'}`}>
                            {g}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-400">{song.playCount.toLocaleString()}</td>
                    <td class="px-6 py-4 text-sm text-gray-400">{song.likeCount.toLocaleString()}</td>
                    <td class="px-6 py-4">
                      <span class={`text-sm font-medium ${
                        song.qualityScores.overall >= 90 ? 'text-green-400' :
                        song.qualityScores.overall >= 80 ? 'text-blue-400' :
                        song.qualityScores.overall >= 70 ? 'text-yellow-400' :
                        'text-gray-400'
                      }`}>
                        {song.qualityScores.overall}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
});
