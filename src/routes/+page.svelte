<script lang="ts">
  import { onMount } from 'svelte';
  import { formatDistanceToNow, formatDistance } from 'date-fns';
  import ShieldModal from '$lib/components/ShieldModal.svelte';
  import ShieldIcon from '$lib/components/icons/ShieldIcon.svelte';
  import type { Message, Shield } from '$lib/types';
  import { SHIELD_TIERS } from '$lib/types';

  let message = '';
  let nickname = '';
  let currentMessage: Message | null = null;
  let isSubmitting = false;
  let showShieldModal = false;
  let isLoading = true;
  let shieldTimeRemaining: string | null = null;
  let isShieldExpired = false;
  let progressPercentage = 100;

  function getShieldEndTime(timestamp: string, shieldType: Shield['type']): Date {
    const startTime = new Date(timestamp).getTime(); // On récupère le timestamp en ms
    const durationInMinutes = SHIELD_TIERS[shieldType]?.duration || 0;
    const durationInMs = durationInMinutes * 60 * 1000;
    return new Date(startTime + durationInMs);
  }

  function formatTimeRemaining(milliseconds: number): string {
    if (milliseconds <= 0) return '0s';

    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes === 0) return `${seconds}s`;
    return `${minutes}m ${seconds}s`;
  }

  function updateShieldTimer(timestamp: string, shieldType: Shield['type']) {
    if (!shieldType || shieldType === 'none') {
      isShieldExpired = true;
      shieldTimeRemaining = null;
      progressPercentage = 0;
      return;
    }

    const now = new Date();
    const start = new Date(timestamp);
    const durationMs = SHIELD_TIERS[shieldType].duration * 60 * 1000;
    const end = new Date(start.getTime() + durationMs);

    const timeLeft = end.getTime() - now.getTime();

    if (timeLeft <= 0) {
      isShieldExpired = true;
      shieldTimeRemaining = null;
      progressPercentage = 0;
    } else {
      isShieldExpired = false;
      shieldTimeRemaining = formatTimeRemaining(timeLeft);
      progressPercentage = (timeLeft / durationMs) * 100;
    }
  }
  function getShieldColor(type: Shield['type']): string {
    const colors = {
      none: '#9CA3AF',
      bronze: '#CD7F32',
      silver: '#C0C0C0',
      gold: '#FFD700',
      platinum: '#E5E4E2'
    };
    return colors[type] || colors.none;
  }

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

      if (currentMessage?.shield && currentMessage.shield !== 'none') {
        updateShieldTimer(currentMessage.timestamp, currentMessage.shield);

        const timerInterval = setInterval(() => {
          if (currentMessage?.shield) {
            updateShieldTimer(currentMessage.timestamp, currentMessage.shield);
          }
        }, 1000);

        return () => clearInterval(timerInterval);
      }

      console.log('Current message:', currentMessage);
      setInterval(async () => {
        const response = await fetch('/api/last-message');
        currentMessage = await response.json();
        if (currentMessage?.shield && currentMessage.shield !== 'none') {
          updateShieldTimer(currentMessage.timestamp, currentMessage.shield);
        }
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
            <div class="inline-flex flex-col items-center  pt-8">
              <div class="relative w-16 h-16">
                <svg class="w-full h-full -rotate-90 transform">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    stroke-width="4"
                    fill="none"
                    class="text-gray-700"
                  />
                  {#if !isShieldExpired}
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke={getShieldColor(currentMessage.shield)}
                      stroke-width="4"
                      fill="none"
                      stroke-dasharray="175.93"
                      stroke-dashoffset={175.93 - (175.93 * progressPercentage) / 100}
                      class="transition-all duration-1000 ease-linear"
                    />
                  {/if}
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <ShieldIcon type={currentMessage.shield} size={24} />
                </div>
              </div>
              <p class="text-sm mt-2 px-3 py-1 bg-gray-800 rounded-full inline-flex items-center gap-2">
                {#if isShieldExpired}
                  <span class="text-red-400">Protection expired</span>
                {:else}
        <span>
          {currentMessage.shield.charAt(0).toUpperCase() + currentMessage.shield.slice(1)}
          protection
          {#if shieldTimeRemaining}
            <span class="ml-1 font-mono text-purple-400">
              {shieldTimeRemaining}
            </span>
          {/if}
        </span>
                {/if}
              </p>
            </div>
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
              {isSubmitting ? 'Processing...' : `Take over (€${SHIELD_TIERS.none.price.toFixed(2)})`}
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
  currentShield={isShieldExpired ? 'none' : currentMessage?.shield}
/>

<style>
  :global(body) {
    @apply bg-gray-900 text-white;
  }
</style>