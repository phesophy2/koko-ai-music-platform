import { component$ } from '@builder.io/qwik';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
}

const typeStyles: Record<string, string> = {
  success: 'border-green-500/50 bg-green-500/10 text-green-300',
  error: 'border-red-500/50 bg-red-500/10 text-red-300',
  info: 'border-purple-accent/50 bg-purple-accent/10 text-purple-300',
};

const typeIcons: Record<string, string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
};

export const Toast = component$<ToastProps>(({ message, type, visible }) => {
  return (
    <div
      class={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl border ${typeStyles[type]} backdrop-blur-lg transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <span class="text-lg">{typeIcons[type]}</span>
      <span class="text-sm font-medium">{message}</span>
    </div>
  );
});
