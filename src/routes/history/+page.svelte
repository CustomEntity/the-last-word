<script lang="ts">
  import { onMount } from 'svelte';
  import { formatDistanceToNow } from 'date-fns';
  import type { Message } from '$lib/types';

  let messages: Message[] = [];

  onMount(async () => {
    try {
      const response = await fetch('/api/messages');
      messages = await response.json();
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  });
</script>

<div class="space-y-6 p-4">
  <h1 class="text-2xl font-bold">Message History</h1>

  <div class="space-y-6">
    {#each messages as message}
      <div class="bg-gray-800 p-6 rounded-lg hover:bg-gray-700/50 transition-colors">
        <p class="text-2xl font-medium mb-3">{message.content}</p>
        <div class="flex flex-col sm:flex-row sm:items-center text-gray-400 gap-2 sm:gap-6">
          <span class="text-purple-400">@{message.author}</span>
          <span>{formatDistanceToNow(new Date(message.timestamp))} ago</span>
        </div>
      </div>
    {/each}
  </div>
</div>