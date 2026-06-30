import { component$ } from '@builder.io/qwik';

interface StatusBadgeProps {
  status: 'pending' | 'generating' | 'completed' | 'failed';
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', dot: 'bg-yellow-400' },
  generating: { bg: 'bg-blue-500/20', text: 'text-blue-300', dot: 'bg-blue-400' },
  completed: { bg: 'bg-green-500/20', text: 'text-green-300', dot: 'bg-green-400' },
  failed: { bg: 'bg-red-500/20', text: 'text-red-300', dot: 'bg-red-400' },
};

export const StatusBadge = component$<StatusBadgeProps>(({ status }) => {
  const config = statusConfig[status];

  return (
    <span class={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span class={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
});
