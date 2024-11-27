<script lang="ts">
  import { onMount } from 'svelte';
  import { formatDistanceToNow } from 'date-fns';

  let messages: any[] = [];

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
  
  <div class="space-y-4">
    {#each messages as message}
      <div class="bg-gray-800 p-6 rounded-lg">
        <p class="text-xl mb-2">{message.content}</p>
        <div class="flex justify-between text-sm text-gray-400">
          <span>by {message.author}</span>
          <span>Lasted {formatDistanceToNow(new Date(message.timestamp))}</span>
        </div>
      </div>
    {/each}
  </div>
</div>