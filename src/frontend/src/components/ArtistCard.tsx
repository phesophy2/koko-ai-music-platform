import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

interface ArtistCardProps {
  id: string;
  name: string;
  genres: string[];
  vibe: string[];
  vocalType: string;
}

const genreColors: Record<string, string> = {
  Pop: 'bg-pink-500/20 text-pink-300',
  Rock: 'bg-red-500/20 text-red-300',
  HipHop: 'bg-orange-500/20 text-orange-300',
  'R&B': 'bg-purple-500/20 text-purple-300',
  Electronic: 'bg-blue-500/20 text-blue-300',
  Jazz: 'bg-yellow-500/20 text-yellow-300',
  Classical: 'bg-green-500/20 text-green-300',
  Indie: 'bg-teal-500/20 text-teal-300',
  Metal: 'bg-gray-500/20 text-gray-300',
  Folk: 'bg-amber-500/20 text-amber-300',
};

export const ArtistCard = component$<ArtistCardProps>(({ id, name, genres, vibe, vocalType }) => {
  return (
    <Link href={`/artists/${id}`} class="group block">
      <div class="glass rounded-2xl p-6 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-[0_0_30px_rgba(108,92,231,0.3)] animate-fade-in">
        <div class="w-20 h-20 rounded-full bg-gradient-to-br from-purple-accent to-pink-secondary mx-auto mb-4 flex items-center justify-center">
          <span class="text-2xl font-bold text-white">{name.charAt(0)}</span>
        </div>

        <h3 class="text-lg font-semibold text-white text-center mb-2">{name}</h3>

        <p class="text-xs text-gray-500 text-center mb-3">{vocalType}</p>

        <div class="flex flex-wrap justify-center gap-2 mb-3">
          {genres.map((genre) => (
            <span
              key={genre}
              class={`text-xs px-2 py-0.5 rounded-full ${
                genreColors[genre] || 'bg-gray-500/20 text-gray-300'
              }`}
            >
              {genre}
            </span>
          ))}
        </div>

        <div class="flex flex-wrap justify-center gap-1">
          {vibe.slice(0, 3).map((v) => (
            <span key={v} class="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded">
              #{v}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
});
