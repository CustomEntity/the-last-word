<script lang="ts">
  import { onMount } from 'svelte';
  import { formatDistanceToNow, formatDuration, intervalToDuration } from 'date-fns';
  import type { Message } from '$lib/types';

  let stats = {
    totalMessages: 0,
    averageDuration: '0',
    longestMessage: null,
    shortestMessage: null
  } as {
    totalMessages: number;
    averageDuration: string;
    longestMessage: Message | null;
    shortestMessage: Message | null;
  }

  function formatSeconds(seconds: number) {
    if (seconds < 60) return `${seconds} seconds`;
    const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
    return formatDuration(duration);
  }

  onMount(async () => {
    try {
      const response = await fetch('/api/stats');
      stats = await response.json();
    } catch (error) {
      console.error('Error:', error);
    }
  });
</script>

<div class="space-y-8 p-4">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="bg-gray-800 p-6 rounded-lg text-center">
      <p class="text-4xl font-bold text-purple-400 mb-2">{stats.totalMessages}</p>
      <h2 class="text-gray-400">Total Messages</h2>
    </div>

    <div class="bg-gray-800 p-6 rounded-lg text-center">
      <p class="text-4xl font-bold text-purple-400 mb-2">{formatSeconds(parseInt(stats.averageDuration))}</p>
      <h2 class="text-gray-400">Average Lifespan</h2>
    </div>

    <div class="bg-gray-800 p-6 rounded-lg text-center">
      <p class="text-4xl font-bold text-purple-400 mb-2">{formatSeconds(stats.longestMessage?.duration || 0)}</p>
      <h2 class="text-gray-400">Longest Lifespan</h2>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    {#if stats.longestMessage}
      <div class="bg-gray-800 p-6 rounded-lg">
        <h2 class="text-lg font-medium mb-4">Longest Lasting Message</h2>
        <p class="text-xl mb-3">{stats.longestMessage.content}</p>
        <div class="text-sm text-gray-400 flex items-center gap-3">
          <span class="text-purple-400">@{stats.longestMessage.author}</span>
          <span>•</span>
          <span>lasted {formatSeconds(stats.longestMessage.duration || 0)}</span>
        </div>
      </div>
    {/if}

    {#if stats.shortestMessage}
      <div class="bg-gray-800 p-6 rounded-lg">
        <h2 class="text-lg font-medium mb-4">Shortest Lasting Message</h2>
        <p class="text-xl mb-3">{stats.shortestMessage.content}</p>
        <div class="text-sm text-gray-400 flex items-center gap-3">
          <span class="text-purple-400">@{stats.shortestMessage.author}</span>
          <span>•</span>
          <span>lasted {formatSeconds(stats.shortestMessage.duration || 0)}</span>
        </div>
      </div>
    {/if}
  </div>
</div>