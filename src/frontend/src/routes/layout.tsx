import { component$, Slot } from '@builder.io/qwik';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import '../global.css';

export default component$(() => {
  return (
    <div class="min-h-screen bg-dark-base flex flex-col">
      <Header />
      <main class="flex-1 pt-16">
        <Slot />
      </main>
      <Footer />
    </div>
  );
});
