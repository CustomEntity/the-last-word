<script lang="ts">
  import { onMount } from 'svelte';
  import { formatDistanceToNow } from 'date-fns';
  import ShieldModal from '$lib/components/ShieldModal.svelte';
  import ShieldIcon from '$lib/components/icons/ShieldIcon.svelte';
  import type { Message, Shield } from '$lib/types';

  let message = '';
  let nickname = '';
  let currentMessage: Message | null = null;
  let isSubmitting = false;
  let showShieldModal = false;
  let selectedShield: Shield['type'] = 'none';
  let isLoading = true;

  async function handleSubmit() {
    showShieldModal = true;
  }

  async function submitMessage(shieldType: Shield['type']) {
    if (!message || !nickname) return;

    isSubmitting = true;
    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, nickname, shieldType })
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
      isLoading = false;

      console.log('Current message:', currentMessage);
      setInterval(async () => {
        const response = await fetch('/api/last-message');
        currentMessage = await response.json();
      }, 10000);

    } catch (error) {
      console.error('Error fetching last message:', error);
      isLoading = false;
    }
  });
</script>

<div class="flex flex-col h-[calc(100vh-theme(spacing.16))]">
  <div class="flex-grow flex items-center justify-center px-4 sm:px-6 py-8">
    {#if isLoading}
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    {:else if currentMessage}
      <div class="w-full text-center space-y-6 sm:space-y-8">
        <p class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight break-words mx-auto max-w-[90vw]">
          {currentMessage.content}
        </p>

        <div class="space-y-1 sm:space-y-2 text-gray-400">
          <p class="text-lg sm:text-xl">— {currentMessage.author}</p>
          <p class="text-base sm:text-lg">
            posted {formatDistanceToNow(new Date(currentMessage.timestamp))} ago
          </p>
          {#if currentMessage.shield && currentMessage.shield !== 'none'}
            <p class="text-sm inline-flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-full">
              <ShieldIcon type={currentMessage.shield} size={16} />
              Protected by a {currentMessage.shield} shield
            </p>
          {/if}
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

  <div class="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm m-4 my-auto">
    <div class="max-w-2xl mx-auto m-6">
      <form
        on:submit|preventDefault={handleSubmit}
        class="bg-gray-800/50 hover:bg-gray-800/80 transition-colors duration-300 p-6 rounded-2xl border border-gray-700/50 backdrop-blur-sm shadow-xl"
      >
        <div class="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            bind:value={nickname}
            class="w-full sm:w-40 px-4 py-3 bg-gray-900/50 rounded-xl border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm placeholder-gray-500 transition-colors duration-200"
            placeholder="Your name"
            required
          />
          <div class="flex-grow flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              bind:value={message}
              class="flex-1 px-4 py-3 bg-gray-900/50 rounded-xl border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm placeholder-gray-500 transition-colors duration-200"
              placeholder="Type your message..."
              maxlength="280"
              required
            />
            <button
              type="submit"
              class="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm hover:shadow-lg hover:scale-105 active:scale-95"
              disabled={isSubmitting || !message || !nickname}
            >
              {isSubmitting ? 'Processing...' : 'Take over'}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>

<ShieldModal
  show={showShieldModal}
  onClose={() => showShieldModal = false}
  onSelect={(shield) => submitMessage(shield)}
/>

<style>
  :global(body) {
    @apply bg-gray-900 text-white;
  }
</style>