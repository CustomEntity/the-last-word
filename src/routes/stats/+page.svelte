<script lang="ts">
  import { onMount } from 'svelte';

  let stats = {
    totalMessages: 0,
    averageDuration: '0',
    longestMessage: null,
    shortestMessage: null
  };

  onMount(async () => {
    try {
      const response = await fetch('/api/stats');
      stats = await response.json();
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  });
</script>

<div class="space-y-6 p-4">
  <h1 class="text-2xl font-bold">Statistics</h1>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="bg-gray-800 p-6 rounded-lg">
      <h2 class="text-lg font-medium mb-2">Total Messages</h2>
      <p class="text-3xl font-bold text-purple-400">{stats.totalMessages}</p>
    </div>
    
    <div class="bg-gray-800 p-6 rounded-lg">
      <h2 class="text-lg font-medium mb-2">Average Duration</h2>
      <p class="text-3xl font-bold text-purple-400">{stats.averageDuration}</p>
    </div>
  </div>

  {#if stats.longestMessage}
    <div class="bg-gray-800 p-6 rounded-lg">
      <h2 class="text-lg font-medium mb-2">Longest Lasting Message</h2>
      <p class="text-xl mb-2">{stats.longestMessage.content}</p>
      <div class="text-sm text-gray-400">
        by {stats.longestMessage.author} • 
        Lasted {stats.longestMessage.duration}
      </div>
    </div>
  {/if}

  {#if stats.shortestMessage}
    <div class="bg-gray-800 p-6 rounded-lg">
      <h2 class="text-lg font-medium mb-2">Shortest Lasting Message</h2>
      <p class="text-xl mb-2">{stats.shortestMessage.content}</p>
      <div class="text-sm text-gray-400">
        by {stats.shortestMessage.author} • 
        Lasted {stats.shortestMessage.duration}
      </div>
    </div>
  {/if}
</div>