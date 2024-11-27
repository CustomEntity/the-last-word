<script lang="ts">
  import { onMount } from 'svelte';
  import { formatDistanceToNow } from 'date-fns';
  let message = '';
  let nickname = '';
  let currentMessage: any = null;
  let isSubmitting = false;

  async function submitMessage() {
    if (!message || !nickname) return;

    isSubmitting = true;
    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, nickname })
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      isSubmitting = false;
    }
  }

  onMount(async () => {
    try {
      const response = await fetch('/api/last-message');
      currentMessage = await response.json();

      setInterval(async () => {
        const response = await fetch('/api/last-message');
        currentMessage = await response.json();
      }, 10000);

    } catch (error) {
      console.error('Error fetching last message:', error);
    }
  });
</script>

<!-- Contenu principal -->
<div class="flex flex-col h-[calc(100vh-theme(spacing.16))]">
  <div class="flex-grow flex items-center justify-center px-4 sm:px-6 py-8">
    {#if currentMessage}
      <div class="w-full text-center space-y-6 sm:space-y-8">
        <!-- Message -->
        <p class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight break-words mx-auto max-w-[90vw]">
          {currentMessage.content}
        </p>

        <!-- Metadata -->
        <div class="space-y-1 sm:space-y-2 text-gray-400">
          <p class="text-lg sm:text-xl">— {currentMessage.author}</p>
          <p class="text-base sm:text-lg">
            ruling for {formatDistanceToNow(new Date(currentMessage.timestamp))}
          </p>
        </div>
      </div>
    {:else}
      <div class="text-center">
        <p class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-500">
          Be the first to speak
        </p>
      </div>
    {/if}
  </div>

  <div class="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm py-4 px-4 sm:px-6">
    <form on:submit|preventDefault={submitMessage} class="flex flex-col sm:flex-row gap-4">
      <div class="flex-grow space-y-4 sm:space-y-0 sm:flex sm:gap-4">
        <input
          type="text"
          bind:value={nickname}
          class="w-full sm:w-40 px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm"
          placeholder="Your name"
          required
        />
        <input
          type="text"
          bind:value={message}
          class="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm"
          placeholder="Type your message..."
          maxlength="280"
          required
        />
      </div>

      <button
        type="submit"
        class="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
        disabled={isSubmitting || !message || !nickname}
      >
        {isSubmitting ? 'Processing...' : 'Take over (€1)'}
      </button>
    </form>
  </div>
</div>

<style>
  :global(body) {
    @apply bg-gray-900 text-white;
  }
</style>