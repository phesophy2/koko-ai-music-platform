import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';

interface SongPlayerProps {
  title: string;
  artistName: string;
  duration: number;
  imageUrl?: string;
}

export const SongPlayer = component$<SongPlayerProps>(({ title, artistName, duration, imageUrl }) => {
  const isPlaying = useSignal(false);
  const currentTime = useSignal(0);

  useVisibleTask$(({ cleanup }) => {
    if (!isPlaying.value) return;
    const interval = setInterval(() => {
      currentTime.value = (currentTime.value + 1) % duration;
    }, 1000);
    cleanup(() => clearInterval(interval));
  });

  const progress = () => (currentTime.value / duration) * 100;
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div class="glass rounded-2xl p-6 max-w-md mx-auto">
      <div class="flex items-center gap-4 mb-6">
        <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-accent to-pink-secondary flex-shrink-0 flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={title} class="w-full h-full object-cover" />
          ) : (
            <span class="text-2xl">♪</span>
          )}
        </div>
        <div>
          <h3 class="text-white font-semibold">{title}</h3>
          <p class="text-gray-400 text-sm">{artistName}</p>
        </div>
      </div>

      <div class="mb-6">
        <svg viewBox="0 0 300 80" class="w-full h-12">
          {Array.from({ length: 60 }).map((_, i) => {
            const h = 10 + Math.sin(i * 0.3 + currentTime.value * 0.1) * 20 + Math.random() * 10;
            return (
              <rect
                key={i}
                x={i * 5}
                y={60 - h}
                width={3}
                height={h}
                rx={1.5}
                fill={i < (progress() / 100) * 60 ? '#6C5CE7' : 'rgba(255,255,255,0.1)'}
                class="transition-all duration-300"
              />
            );
          })}
        </svg>
      </div>

      <div class="flex items-center justify-between mb-4">
        <span class="text-sm text-gray-400">{formatTime(currentTime.value)}</span>
        <span class="text-sm text-gray-400">{formatTime(duration)}</span>
      </div>

      <div class="w-full h-1 bg-white/10 rounded-full mb-6 overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-purple-accent to-pink-secondary rounded-full transition-all duration-300"
          style={{ width: `${progress()}%` }}
        />
      </div>

      <div class="flex items-center justify-center gap-6">
        <button class="text-gray-400 hover:text-white transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
          </svg>
        </button>

        <button
          onClick$={() => { isPlaying.value = !isPlaying.value; }}
          class="w-14 h-14 rounded-full bg-purple-accent hover:bg-purple-accent/80 flex items-center justify-center transition-all active:scale-95"
        >
          {isPlaying.value ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1"/>
              <rect x="14" y="4" width="4" height="16" rx="1"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>

        <button class="text-gray-400 hover:text-white transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 6v12H16V6zm-3.5 6l-8.5 6V6z"/>
          </svg>
        </button>
      </div>
    </div>
  );
});
