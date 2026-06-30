import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { api } from '../../lib/api';
import type { Artist, Project } from '../../lib/types';
import { ProgressBar } from '../../components/ProgressBar';

const emotions = ['Happy', 'Sad', 'Energetic', 'Melancholic', 'Angry'];

function generateHexId(): string {
  const chars = '0123456789ABCDEF';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default component$(() => {
  const artists = useSignal<Artist[]>([]);
  const selectedArtist = useSignal('');
  const selectedEmotion = useSignal('Happy');
  const intensity = useSignal(5);
  const topic = useSignal('');
  const hexId = useSignal(generateHexId());
  const generating = useSignal(false);
  const progress = useSignal(0);
  const createdProject = useSignal<Project | null>(null);
  const loadingArtists = useSignal(true);

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
      loadingArtists.value = false;
    }
  });

  const handleGenerate = async () => {
    generating.value = true;
    progress.value = 0;

    const interval = setInterval(() => {
      progress.value = Math.min(progress.value + Math.random() * 15, 95);
    }, 500);

    try {
      const project = await api.createProject({
        artist_id: selectedArtist.value,
        hex_id: hexId.value,
        structure: 'Verse-Chorus-Verse-Chorus-Bridge',
        topic: topic.value || selectedEmotion.value,
        duration: 180,
        emotion: selectedEmotion.value,
        intensity: intensity.value,
      });
      createdProject.value = project;
      progress.value = 100;
    } catch {
      progress.value = 100;
    } finally {
      clearInterval(interval);
      setTimeout(() => { generating.value = false; }, 1000);
    }
  };

  return (
    <div class="px-4 md:px-8 py-8 max-w-5xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Generation Studio</h1>
        <p class="text-gray-400">Configure your AI music generation parameters</p>
      </div>

      {createdProject.value ? (
        <div class="glass rounded-2xl p-8 text-center animate-fade-in">
          <div class="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <span class="text-3xl text-green-400">✓</span>
          </div>
          <h2 class="text-2xl font-bold text-white mb-2">Generation Complete!</h2>
          <p class="text-gray-400 mb-2">Project ID: {createdProject.value.hexId}</p>
          <p class="text-gray-500 text-sm mb-6">
            Your song is being processed. Check the Library to view results.
          </p>
          <div class="flex gap-4 justify-center">
            <button
              onClick$={() => {
                createdProject.value = null;
                hexId.value = generateHexId();
                topic.value = '';
              }}
              class="px-6 py-3 rounded-full bg-purple-accent text-white hover:bg-purple-accent/80 transition-all"
            >
              Create Another
            </button>
          </div>
        </div>
      ) : (
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="glass rounded-2xl p-6">
            <h2 class="text-lg font-semibold text-white mb-4">Artist Selection</h2>
            {loadingArtists.value ? (
              <div class="flex gap-3 flex-wrap">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} class="shimmer rounded-xl h-24 w-28" />
                ))}
              </div>
            ) : (
              <div class="flex gap-3 flex-wrap">
                {artists.value.map((artist) => (
                  <button
                    key={artist.id}
                    onClick$={() => { selectedArtist.value = artist.id; }}
                    class={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                      selectedArtist.value === artist.id
                        ? 'border-purple-accent bg-purple-accent/10 shadow-[0_0_15px_rgba(108,92,231,0.2)]'
                        : 'border-white/10 hover:border-white/30 bg-white/5'
                    }`}
                  >
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-accent to-pink-secondary flex items-center justify-center">
                      <span class="text-sm font-bold">{artist.name.charAt(0)}</span>
                    </div>
                    <span class="text-xs text-white font-medium">{artist.name}</span>
                    <span class="text-[10px] text-gray-500">{artist.vocalType}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div class="glass rounded-2xl p-6">
            <h2 class="text-lg font-semibold text-white mb-4">Emotion</h2>
            <div class="flex gap-2 flex-wrap">
              {emotions.map((emotion) => (
                <button
                  key={emotion}
                  onClick$={() => { selectedEmotion.value = emotion; }}
                  class={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedEmotion.value === emotion
                      ? 'bg-purple-accent text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {emotion}
                </button>
              ))}
            </div>
          </div>

          <div class="glass rounded-2xl p-6">
            <h2 class="text-lg font-semibold text-white mb-4">
              Intensity: <span class="text-purple-accent">{intensity.value}</span>
            </h2>
            <input
              type="range"
              min="1"
              max="10"
              value={intensity.value}
              onInput$={(e) => { intensity.value = parseInt((e.target as HTMLInputElement).value); }}
              class="w-full h-2 rounded-full appearance-none bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-accent [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(108,92,231,0.5)]"
            />
            <div class="flex justify-between mt-2 text-xs text-gray-500">
              <span>Subtle</span>
              <span>Intense</span>
            </div>
          </div>

          <div class="glass rounded-2xl p-6">
            <h2 class="text-lg font-semibold text-white mb-4">Topic</h2>
            <input
              type="text"
              value={topic.value}
              onInput$={(e) => { topic.value = (e.target as HTMLInputElement).value; }}
              placeholder="Enter a topic, theme, or keywords..."
              class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-accent transition-colors"
            />
          </div>

          <div class="glass rounded-2xl p-6 lg:col-span-2">
            <h2 class="text-lg font-semibold text-white mb-2">Session ID</h2>
            <div class="flex items-center gap-3">
              <code class="px-4 py-2 rounded-lg bg-white/5 text-purple-accent font-mono text-sm">
                {hexId.value}
              </code>
              <button
                onClick$={() => { hexId.value = generateHexId(); }}
                class="text-xs text-gray-500 hover:text-white transition-colors"
              >
                Regenerate
              </button>
            </div>
          </div>

          <div class="lg:col-span-2">
            {generating.value ? (
              <div class="glass rounded-2xl p-8">
                <h3 class="text-white font-semibold text-center mb-6">Generating Your Song...</h3>
                <ProgressBar value={progress.value} label="Generation Progress" />
                <p class="text-center text-gray-500 text-sm mt-4">
                  {progress.value < 30 ? 'Analyzing artist DNA...' :
                   progress.value < 60 ? 'Composing melody and harmony...' :
                   progress.value < 90 ? 'Generating vocals and mixing...' :
                   'Finalizing your track...'}
                </p>
              </div>
            ) : (
              <button
                onClick$={handleGenerate}
                disabled={!selectedArtist.value}
                class="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-accent to-pink-secondary text-white font-semibold text-lg hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Generate Song
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
});
