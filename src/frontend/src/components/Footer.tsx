import { component$ } from '@builder.io/qwik';

export const Footer = component$(() => {
  return (
    <footer class="bg-dark-base border-t border-white/10 px-4 md:px-8 py-8">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-2">
            <span class="text-lg font-bold bg-gradient-to-r from-purple-accent to-pink-secondary bg-clip-text text-transparent">
              KOKO
            </span>
            <span class="text-gray-500 text-sm">© 2024 KOKO AI Music</span>
          </div>

          <div class="flex items-center gap-6">
            <a href="#" class="text-gray-500 hover:text-purple-accent text-sm transition-colors">
              Docs
            </a>
            <a href="#" class="text-gray-500 hover:text-purple-accent text-sm transition-colors">
              GitHub
            </a>
            <a href="#" class="text-gray-500 hover:text-purple-accent text-sm transition-colors">
              Discord
            </a>
            <a href="#" class="text-gray-500 hover:text-purple-accent text-sm transition-colors">
              hello@koko.ai
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
});
