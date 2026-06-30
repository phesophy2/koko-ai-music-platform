import { component$ } from '@builder.io/qwik';

interface LoadingSkeletonProps {
  variant?: 'card' | 'text' | 'avatar';
  count?: number;
}

export const LoadingSkeleton = component$<LoadingSkeletonProps>(({ variant = 'card', count = 1 }) => {
  const items = Array.from({ length: count });

  if (variant === 'text') {
    return (
      <>
        {items.map((_, i) => (
          <div key={i} class="shimmer rounded h-4 w-full mb-2" />
        ))}
      </>
    );
  }

  if (variant === 'avatar') {
    return (
      <div class="flex gap-3">
        {items.map((_, i) => (
          <div key={i} class="shimmer rounded-full w-12 h-12 flex-shrink-0" />
        ))}
      </div>
    );
  }

  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((_, i) => (
        <div key={i} class="glass rounded-2xl p-6">
          <div class="shimmer rounded-full w-20 h-20 mx-auto mb-4" />
          <div class="shimmer rounded h-5 w-2/3 mx-auto mb-3" />
          <div class="shimmer rounded h-3 w-1/2 mx-auto mb-4" />
          <div class="flex justify-center gap-2 mb-3">
            <div class="shimmer rounded-full h-5 w-14" />
            <div class="shimmer rounded-full h-5 w-14" />
          </div>
          <div class="shimmer rounded h-4 w-full mb-2" />
          <div class="shimmer rounded h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
});
