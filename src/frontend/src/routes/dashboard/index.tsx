import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { api } from '../../lib/api';
import type { DashboardStats } from '../../lib/types';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { Link } from '@builder.io/qwik-city';

export default component$(() => {
  const stats = useSignal<DashboardStats | null>(null);
  const loading = useSignal(true);
  const error = useSignal('');

  useVisibleTask$(async () => {
    try {
      stats.value = await api.getDashboardStats();
    } catch (e) {
      error.value = 'Failed to load dashboard data';
    } finally {
      loading.value = false;
    }
  });

  const statCards = [
    { label: 'Total Songs', value: stats.value?.totalSongs ?? 0, icon: '🎵', color: 'from-purple-accent to-purple-600' },
    { label: 'Total Plays', value: stats.value?.totalPlays ?? 0, icon: '▶', color: 'from-blue-500 to-cyan-500' },
    { label: 'Total Likes', value: stats.value?.totalLikes ?? 0, icon: '♥', color: 'from-pink-secondary to-pink-600' },
    { label: 'Credits', value: stats.value?.credits ?? 0, icon: '✦', color: 'from-yellow-400 to-orange-500' },
  ];

  return (
    <div class="px-4 md:px-8 py-8 max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p class="text-gray-400">Overview of your music creation activity</p>
      </div>

      {loading.value ? (
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} class="glass rounded-2xl p-6">
              <div class="shimmer rounded h-4 w-20 mb-4" />
              <div class="shimmer rounded h-8 w-16" />
            </div>
          ))}
        </div>
      ) : error.value ? (
        <div class="glass rounded-2xl p-8 text-center">
          <p class="text-red-300">{error.value}</p>
        </div>
      ) : (
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((card) => (
            <div key={card.label} class="glass rounded-2xl p-6 hover:shadow-[0_0_20px_rgba(108,92,231,0.15)] transition-all">
              <div class="flex items-center justify-between mb-4">
                <span class="text-2xl">{card.icon}</span>
                <div class={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center opacity-80`}>
                  <span class="text-white text-xs font-bold">{card.label.charAt(0)}</span>
                </div>
              </div>
              <p class="text-3xl font-bold text-white mb-1">{card.value.toLocaleString()}</p>
              <p class="text-sm text-gray-400">{card.label}</p>
            </div>
          ))}
        </div>
      )}

      <div>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-white">Recent Projects</h2>
          <Link href="/generate" class="text-sm text-purple-accent hover:underline">New Project</Link>
        </div>

        {loading.value ? (
          <LoadingSkeleton count={3} />
        ) : (
          <div class="glass rounded-2xl overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-white/10">
                    <th class="text-left text-xs text-gray-500 font-medium uppercase tracking-wider px-6 py-4">Project</th>
                    <th class="text-left text-xs text-gray-500 font-medium uppercase tracking-wider px-6 py-4">Artist</th>
                    <th class="text-left text-xs text-gray-500 font-medium uppercase tracking-wider px-6 py-4">Emotion</th>
                    <th class="text-left text-xs text-gray-500 font-medium uppercase tracking-wider px-6 py-4">Status</th>
                    <th class="text-left text-xs text-gray-500 font-medium uppercase tracking-wider px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats.value?.recentProjects ?? []).length === 0 ? (
                    <tr>
                      <td colSpan={5} class="px-6 py-12 text-center text-gray-500">
                        No projects yet. Start creating!
                      </td>
                    </tr>
                  ) : (
                    (stats.value?.recentProjects ?? []).map((project) => (
                      <tr key={project.id} class="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td class="px-6 py-4">
                          <div>
                            <p class="text-sm font-medium text-white">{project.name || project.hexId}</p>
                            <p class="text-xs text-gray-500">{project.hexId}</p>
                          </div>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-400">{project.artistName}</td>
                        <td class="px-6 py-4">
                          <span class="text-sm text-gray-400 capitalize">{project.emotion}</span>
                        </td>
                        <td class="px-6 py-4">
                          <StatusBadge status={project.status} />
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-500">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
