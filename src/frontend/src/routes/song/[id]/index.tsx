import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { useLocation, Link } from '@builder.io/qwik-city';
import { api } from '../../../lib/api';
import type { Song } from '../../../lib/types';
import { SongPlayer } from '../../../components/SongPlayer';
import { ProgressBar } from '../../../components/ProgressBar';

const fallbackSongs: Record<string, Song> = {
  s1: { id: 's1', title: 'Neon Dreams', artistId: 'pulse', artistName: 'PULSE', genres: ['Electronic', 'Pop'], duration: 234, bpm: 128, key: 'Am', playCount: 12450, likeCount: 892, qualityScores: { melody: 88, harmony: 82, rhythm: 95, structure: 78, production: 92, vocalPerformance: 85, lyricQuality: 76, overall: 85 }, hitPrediction: { score: 82, category: 'Potential Hit', factors: [{ name: 'Catchiness', impact: 90 }, { name: 'Production', impact: 85 }, { name: 'Songwriting', impact: 75 }] }, lyrics: 'Strobe lights and city streets\nElectric waves beneath my feet\nNeon dreams that never sleep\nIn this world of digital beats\n\nPulsing through the midnight air\nEvery moment beyond compare\nDigital love without a care\nA symphony of light and flare\n\nThis is the sound of tomorrow\nDrowning out all the sorrow\nIn a world of ones and zeros\nWe are the true heroes' },
  s2: { id: 's2', title: 'Midnight Rain', artistId: 'noir', artistName: 'Noir', genres: ['R&B'], duration: 198, bpm: 92, key: 'Dm', playCount: 8760, likeCount: 654, qualityScores: { melody: 92, harmony: 88, rhythm: 76, structure: 85, production: 90, vocalPerformance: 94, lyricQuality: 89, overall: 88 }, hitPrediction: { score: 76, category: 'Sleeper Hit', factors: [{ name: 'Vibe', impact: 95 }, { name: 'Vocals', impact: 92 }, { name: 'Lyrics', impact: 85 }] }, lyrics: 'Raindrops on the window pane\nEchoes of a forgotten name\nMidnight thoughts that drive me insane\nPlaying out like a bittersweet refrain\n\nI still feel you in the dark\nEvery shadow holds a spark\nOf a love that left its mark\nNow I am wandering in the park\n\nMaybe some things never fade\nLike the memories we made\nIn the midnight rain we wade\nThrough the choices we delayed' },
  s3: { id: 's3', title: 'Stardust', artistId: 'aurora', artistName: 'AURORA', genres: ['Pop', 'Electronic'], duration: 267, bpm: 110, key: 'C', playCount: 15230, likeCount: 1204, qualityScores: { melody: 95, harmony: 90, rhythm: 72, structure: 88, production: 94, vocalPerformance: 96, lyricQuality: 82, overall: 91 }, hitPrediction: { score: 91, category: 'Guaranteed Hit', factors: [{ name: 'Melody', impact: 98 }, { name: 'Vocals', impact: 95 }, { name: 'Production', impact: 90 }] }, lyrics: 'We are made of stardust dreams\nFloating through cosmic streams\nNothing is ever as it seems\nIn this universe of extremes\n\nCelestial bodies dance above\nA cosmic symphony of love\nSent from the stars above\nA message we are dreaming of\n\nClose your eyes and drift away\nTo a galaxy where we can play\nAmong the stars we will stay\nForever and a day' },
  s4: { id: 's4', title: 'Wildfire', artistId: 'ember', artistName: 'Ember', genres: ['Indie', 'Rock'], duration: 245, bpm: 140, key: 'Em', playCount: 6540, likeCount: 487, qualityScores: { melody: 82, harmony: 78, rhythm: 88, structure: 80, production: 84, vocalPerformance: 90, lyricQuality: 86, overall: 84 }, hitPrediction: { score: 68, category: 'Underground', factors: [{ name: 'Energy', impact: 92 }, { name: 'Vocals', impact: 88 }, { name: 'Authenticity', impact: 85 }] }, lyrics: 'A spark, a flicker, then a flame\nNothing ever stays the same\nWildfire burning in my veins\nBreaking all the rules and chains\n\nThey tried to keep me in a cage\nBut fire cannot be assuaged\nTurning over every page\nBurning through this modern age\n\nLet it burn, let it blaze\nThrough the fog and through the haze\nIn these wild and reckless days\nWe will find our own pathways' },
  s5: { id: 's5', title: 'Velvet Sky', artistId: 'nova', artistName: 'Nova', genres: ['Pop', 'R&B'], duration: 212, bpm: 100, key: 'G', playCount: 9890, likeCount: 756, qualityScores: { melody: 90, harmony: 92, rhythm: 74, structure: 82, production: 88, vocalPerformance: 92, lyricQuality: 90, overall: 87 }, hitPrediction: { score: 84, category: 'Potential Hit', factors: [{ name: 'Vocals', impact: 94 }, { name: 'Songwriting', impact: 90 }, { name: 'Production', impact: 85 }] }, lyrics: 'Velvet sky above my head\nSilent words left unsaid\nWrapped in blankets of the night\nEverything will be alright\n\nYour voice a melody so sweet\nMaking my heart skip a beat\nIn this moment we are complete\nA masterpiece so bittersweet\n\nUnderneath the velvet sky\nYou and I, we will fly\nNo more questions asking why\nJust you and I beneath the sky' },
  s6: { id: 's6', title: 'Electric Heart', artistId: 'pulse', artistName: 'PULSE', genres: ['Electronic'], duration: 256, bpm: 150, key: 'Fm', playCount: 11200, likeCount: 834, qualityScores: { melody: 86, harmony: 80, rhythm: 96, structure: 76, production: 94, vocalPerformance: 82, lyricQuality: 70, overall: 83 }, hitPrediction: { score: 78, category: 'Potential Hit', factors: [{ name: 'Energy', impact: 96 }, { name: 'Production', impact: 92 }, { name: 'Catchiness', impact: 88 }] }, lyrics: 'Electric heart, a rhythmic spark\nLighting up the endless dark\nEvery beat a brand new start\nA symphony of modern art\n\nBass so deep it shakes the ground\nSpinning colors all around\nA sonic universe unbound\nWhere the lost can all be found\n\nFeel the pulse inside your chest\nLet the rhythm do the rest\nThis is music at its best\nPut your heart to the test' },
};

export default component$(() => {
  const loc = useLocation();
  const songId = loc.params.id;
  const song = useSignal<Song | null>(null);
  const loading = useSignal(true);

  useVisibleTask$(async () => {
    try {
      song.value = await api.getSong(songId);
    } catch {
      song.value = fallbackSongs[songId] || null;
    } finally {
      loading.value = false;
    }
  });

  if (loading.value) {
    return (
      <div class="px-4 md:px-8 py-8 max-w-5xl mx-auto">
        <div class="shimmer rounded-2xl h-64 w-full mb-8" />
        <div class="shimmer rounded-2xl h-96 w-full" />
      </div>
    );
  }

  if (!song.value) {
    return (
      <div class="px-4 md:px-8 py-8 max-w-5xl mx-auto text-center">
        <p class="text-gray-400 text-lg mb-2">Song not found</p>
        <Link href="/library" class="text-purple-accent hover:underline">Back to Library</Link>
      </div>
    );
  }

  const s = song.value;
  const scores = s.qualityScores;
  const scoreEntries = [
    { label: 'Melody', value: scores.melody },
    { label: 'Harmony', value: scores.harmony },
    { label: 'Rhythm', value: scores.rhythm },
    { label: 'Structure', value: scores.structure },
    { label: 'Production', value: scores.production },
    { label: 'Vocal Perf.', value: scores.vocalPerformance },
    { label: 'Lyric Quality', value: scores.lyricQuality },
  ];

  return (
    <div class="px-4 md:px-8 py-8 max-w-5xl mx-auto">
      <Link href="/library" class="text-sm text-gray-500 hover:text-purple-accent transition-colors mb-6 inline-block">
        ← Back to Library
      </Link>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
        <div class="lg:col-span-3">
          <SongPlayer
            title={s.title}
            artistName={s.artistName}
            duration={s.duration}
            imageUrl={s.imageUrl}
          />
        </div>

        <div class="lg:col-span-2">
          <div class="glass rounded-2xl p-6 mb-6">
            <h3 class="text-lg font-semibold text-white mb-4">Metadata</h3>
            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">BPM</span>
                <span class="text-white font-medium">{s.bpm}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">Key</span>
                <span class="text-white font-medium">{s.key}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">Duration</span>
                <span class="text-white font-medium">{Math.floor(s.duration / 60)}:{String(s.duration % 60).padStart(2, '0')}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">Genre</span>
                <div class="flex gap-1">
                  {s.genres.map((g) => (
                    <span key={g} class="text-xs px-2 py-0.5 rounded-full bg-purple-accent/20 text-purple-300">{g}</span>
                  ))}
                </div>
              </div>
              <hr class="border-white/10" />
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">Plays</span>
                <span class="text-white font-medium">{s.playCount.toLocaleString()}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">Likes</span>
                <span class="text-white font-medium">{s.likeCount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div class="glass rounded-2xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-white">Hit Prediction</h3>
              <span class={`text-2xl font-bold ${
                s.hitPrediction.score >= 85 ? 'text-green-400' :
                s.hitPrediction.score >= 70 ? 'text-yellow-400' :
                'text-orange-400'
              }`}>
                {s.hitPrediction.score}%
              </span>
            </div>
            <p class="text-sm text-gray-400 mb-4">{s.hitPrediction.category}</p>
            <div class="space-y-2">
              {s.hitPrediction.factors.map((f) => (
                <ProgressBar key={f.name} value={f.impact} label={f.name} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div class="glass rounded-2xl p-6">
          <h3 class="text-lg font-semibold text-white mb-4">Quality Scores</h3>
          <div class="space-y-3">
            {scoreEntries.map((entry) => (
              <ProgressBar
                key={entry.label}
                value={entry.value}
                label={entry.label}
                color={entry.value >= 90 ? 'from-green-500 to-emerald-500' : 'from-purple-accent to-pink-secondary'}
              />
            ))}
            <hr class="border-white/10 my-3" />
            <ProgressBar
              value={scores.overall}
              label="Overall"
              color="from-yellow-400 to-orange-500"
            />
          </div>
        </div>

        <div class="glass rounded-2xl p-6">
          <h3 class="text-lg font-semibold text-white mb-4">Lyrics</h3>
          <pre class="text-gray-300 text-sm leading-relaxed font-sans whitespace-pre-wrap">
            {s.lyrics}
          </pre>
        </div>
      </div>

      <div class="glass rounded-2xl p-6">
        <h3 class="text-lg font-semibold text-white mb-4">Radar Overview</h3>
        <div class="flex justify-center">
          <svg viewBox="0 0 400 400" class="w-full max-w-md">
            {[20, 40, 60, 80, 100].map((pct) => (
              <polygon
                key={pct}
                points={scoreEntries.map((_, i) => {
                  const angle = (i * 2 * Math.PI) / scoreEntries.length - Math.PI / 2;
                  const r = (pct / 100) * 150;
                  return `${200 + r * Math.cos(angle)},${200 + r * Math.sin(angle)}`;
                }).join(' ')}
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                stroke-width="1"
              />
            ))}
            {scoreEntries.map((_, i) => {
              const angle = (i * 2 * Math.PI) / scoreEntries.length - Math.PI / 2;
              const x = 200 + 150 * Math.cos(angle);
              const y = 200 + 150 * Math.sin(angle);
              return <line key={i} x1={200} y1={200} x2={x} y2={y} stroke="rgba(255,255,255,0.05)" stroke-width="1" />;
            })}
            <polygon
              points={scoreEntries.map((entry, i) => {
                const angle = (i * 2 * Math.PI) / scoreEntries.length - Math.PI / 2;
                const r = (entry.value / 100) * 150;
                return `${200 + r * Math.cos(angle)},${200 + r * Math.sin(angle)}`;
              }).join(' ')}
              fill="rgba(108,92,231,0.2)"
              stroke="#6C5CE7"
              stroke-width="2"
            />
            {scoreEntries.map((entry, i) => {
              const angle = (i * 2 * Math.PI) / scoreEntries.length - Math.PI / 2;
              const r = (entry.value / 100) * 150;
              const x = 200 + r * Math.cos(angle);
              const y = 200 + r * Math.sin(angle);
              return (
                <g key={entry.label}>
                  <circle cx={x} cy={y} r="4" fill="#6C5CE7" />
                  <text
                    x={200 + 175 * Math.cos(angle)}
                    y={200 + 175 * Math.sin(angle)}
                    text-anchor="middle"
                    dominant-baseline="middle"
                    fill="rgba(255,255,255,0.5)"
                    font-size="11"
                  >
                    {entry.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
});
