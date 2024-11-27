<script lang="ts">
  import { TOKEN_PACKAGES } from '$lib/types';
  import { userStore } from '$lib/stores/userStore';
  import { createPaymentSession } from '$lib/stripe';

  let isProcessing = false;

  async function buyTokens(packageIndex: number) {
    isProcessing = true;
    try {
      const tokenPackage = TOKEN_PACKAGES[packageIndex];
      const response = await fetch('/api/create-token-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageIndex })
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      isProcessing = false;
    }
  }
</script>

<div class="max-w-4xl mx-auto p-4 space-y-8">
  <div class="text-center space-y-2">
    <h1 class="text-3xl font-bold">Token Shop</h1>
    <p class="text-gray-400">Buy tokens to take over messages and add shields</p>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {#each TOKEN_PACKAGES as pkg, i}
      <div class="bg-gray-800 rounded-lg p-6 space-y-4">
        <div class="text-center">
          <span class="text-3xl font-bold">{pkg.amount}</span>
          <span class="text-gray-400 text-lg">tokens</span>
          {#if pkg.bonus > 0}
            <p class="text-green-400 text-sm">+{pkg.bonus} bonus tokens</p>
          {/if}
        </div>
        
        <div class="text-center">
          <span class="text-2xl font-bold">€{pkg.price}</span>
        </div>

        <button
          on:click={() => buyTokens(i)}
          disabled={isProcessing}
          class="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {isProcessing ? 'Processing...' : 'Buy Now'}
        </button>
      </div>
    {/each}
  </div>

  <div class="text-center text-sm text-gray-400">
    <p>Current balance: {$userStore.tokens} tokens</p>
  </div>
</div>