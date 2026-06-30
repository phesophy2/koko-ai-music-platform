import { component$ } from '@builder.io/qwik';

interface ProgressBarProps {
  value: number;
  color?: string;
  label?: string;
}

export const ProgressBar = component$<ProgressBarProps>(({ value, color = 'from-purple-accent to-pink-secondary', label }) => {
  return (
    <div class="w-full">
      {label && (
        <div class="flex justify-between mb-1">
          <span class="text-sm text-gray-400">{label}</span>
          <span class="text-sm text-gray-400">{Math.round(value)}%</span>
        </div>
      )}
      <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          class={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
});
