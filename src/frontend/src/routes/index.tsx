import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { ArtistCard } from '../components/ArtistCard';

const features = [
  {
    title: 'AI Planner',
    desc: 'Architect your song structure with intelligent arrangement suggestions powered by machine learning.',
    icon: '🎵',
  },
  {
    title: 'Vocal Engine',
    desc: 'Generate lifelike vocals with emotional depth and perfect pitch across any genre.',
    icon: '🎤',
  },
  {
    title: 'Lyric Engine',
    desc: 'Craft compelling lyrics with AI that understands rhyme, meter, and storytelling.',
    icon: '✍️',
  },
  {
    title: 'Quality Engine',
    desc: 'Professional-grade mixing and mastering with real-time quality scoring.',
    icon: '✨',
  },
];

const artists = [
  { id: 'raya', name: 'RAYA', genres: ['Pop-R&B', 'Alternative R&B'], vibe: ['emotional', 'vulnerable', 'intimate'], vocalType: 'Soprano' },
  { id: 'leo', name: 'LEO VANCE', genres: ['Country-Pop', 'Folk'], vibe: ['warm', 'storytelling', 'authentic'], vocalType: 'Baritone' },
  { id: 'nova', name: 'NOVA', genres: ['Melodic Rap', 'Hip-Hop'], vibe: ['dark', 'introspective', 'raw'], vocalType: 'Tenor' },
  { id: 'vega', name: 'VEGA', genres: ['EDM', 'House', 'Pop'], vibe: ['energetic', 'euphoric', 'uplifting'], vocalType: 'Mezzo-Soprano' },
  { id: 'luna', name: 'LUNA', genres: ['Dark Pop', 'Art Pop'], vibe: ['haunting', 'ethereal', 'mysterious'], vocalType: 'Soprano' },
];

export default component$(() => {
  return (
    <div>
      <section class="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-b from-purple-accent/10 via-dark-base to-dark-base pointer-events-none" />
        <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-accent/20 rounded-full blur-[120px] pointer-events-none" />

        <div class="relative z-10 text-center max-w-4xl mx-auto animate-fade-in">
          <h1 class="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span class="bg-gradient-to-r from-purple-accent via-purple-400 to-pink-secondary bg-clip-text text-transparent">
              KOKO
            </span>
            <br />
            <span class="text-white">Ultimate AI Music Platform</span>
          </h1>
          <p class="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Create professional-quality music with AI-powered vocals, intelligent composition,
            and real-time quality scoring. Your vision, amplified by artificial intelligence.
          </p>
          <Link
            href="/generate"
            class="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-purple-accent to-pink-secondary text-white font-semibold text-lg hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-accent/30"
          >
            Start Creating
          </Link>
        </div>
      </section>

      <section class="px-4 md:px-8 py-24 max-w-7xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-bold text-white text-center mb-4">Platform Features</h2>
        <p class="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Everything you need to bring your musical vision to life
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              class="glass rounded-2xl p-6 hover:shadow-[0_0_30px_rgba(108,92,231,0.2)] transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <span class="text-3xl mb-4 block">{feature.icon}</span>
              <h3 class="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p class="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section class="px-4 md:px-8 py-24 max-w-7xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-bold text-white text-center mb-4">Our Artists</h2>
        <p class="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Choose from our roster of AI vocalists, each with a unique voice and style
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} {...artist} />
          ))}
        </div>
        <div class="text-center mt-10">
          <Link
            href="/artists"
            class="inline-block px-6 py-3 rounded-full border border-purple-accent/50 text-purple-accent hover:bg-purple-accent/10 transition-all"
          >
            View All Artists
          </Link>
        </div>
      </section>
    </div>
  );
});
