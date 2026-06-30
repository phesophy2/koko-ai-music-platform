import { $, component$, useSignal } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';

export const Header = component$(() => {
  const menuOpen = useSignal(false);
  const loc = useLocation();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/generate', label: 'Generate' },
    { href: '/artists', label: 'Artists' },
    { href: '/library', label: 'Library' },
  ];

  const toggleMenu = $(() => {
    menuOpen.value = !menuOpen.value;
  });

  return (
    <header class="glass fixed top-0 left-0 right-0 z-50 px-4 md:px-8">
      <div class="max-w-7xl mx-auto flex items-center justify-between h-16">
        <Link href="/" class="flex items-center gap-2">
          <span class="text-2xl font-bold bg-gradient-to-r from-purple-accent to-pink-secondary bg-clip-text text-transparent">
            KOKO
          </span>
        </Link>

        <nav class="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              class={`text-sm font-medium transition-colors hover:text-purple-accent ${
                loc.url.pathname.startsWith(link.href)
                  ? 'text-purple-accent'
                  : 'text-gray-400'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div class="hidden md:flex items-center gap-4">
          <button class="text-sm text-gray-400 hover:text-white transition-colors">
            Login
          </button>
          <button class="text-sm px-4 py-2 rounded-full bg-purple-accent hover:bg-purple-accent/80 text-white transition-all">
            Register
          </button>
        </div>

        <button
          onClick$={toggleMenu}
          class="md:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            {menuOpen.value ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen.value && (
        <div class="md:hidden glass border-t border-white/10 animate-slide-up">
          <div class="px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                class={`text-sm font-medium transition-colors hover:text-purple-accent ${
                  loc.url.pathname.startsWith(link.href)
                    ? 'text-purple-accent'
                    : 'text-gray-400'
                }`}
                onClick$={toggleMenu}
              >
                {link.label}
              </Link>
            ))}
            <hr class="border-white/10" />
            <button class="text-sm text-gray-400 hover:text-white transition-colors text-left">
              Login
            </button>
            <button class="text-sm px-4 py-2 rounded-full bg-purple-accent hover:bg-purple-accent/80 text-white transition-all text-center">
              Register
            </button>
          </div>
        </div>
      )}
    </header>
  );
});
