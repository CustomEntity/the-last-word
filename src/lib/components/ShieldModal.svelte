<script lang="ts">
  import { SHIELD_TIERS } from '$lib/types';
  import type { Shield } from '$lib/types';
  import ShieldIcon from './icons/ShieldIcon.svelte';
  import { Check, X } from 'lucide-svelte';

  export let show = false;
  export let onClose = () => {};
  export let onSelect = (shield: Shield['type']) => {};

  let selectedShield: Shield['type'] = 'none';

  const shields = Object.entries(SHIELD_TIERS).map(([type, details]) => ({
    type,
    ...details
  }));

  function handleConfirm() {
    onSelect(selectedShield);
    onClose();
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal-backdrop')) {
      onClose();
    }
  }

  function formatDuration(minutes: number) {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
</script>

{#if show}
  <div
    class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 modal-backdrop"
    on:click={handleClickOutside}
  >
    <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl p-4">
      <div class="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
        <div class="flex justify-between items-start p-6 border-b border-gray-700">
          <div>
            <h2 class="text-2xl font-bold mb-2">Choose Your Shield</h2>
            <p class="text-gray-400">Protect your message from being overwritten.</p>
          </div>
          <button
            on:click={onClose}
            class="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div class="p-6 space-y-4">
          {#each shields as shield}
            <div
              class="w-full flex text-left items-center justify-between p-4 rounded-xl {shield.type === 'none' ? 'border border-dashed border-gray-600' : 'border border-gray-700'} hover:bg-gray-700/50 transition-all duration-200 {selectedShield === shield.type ? 'border-purple-500 bg-gray-700/50' : ''}"
              role="button"
              on:click={() => selectedShield = shield.type as Shield['type']}
              on:keydown
            >
              <div class="flex items-center gap-4">
                <div class="p-2 rounded-lg bg-gray-900/50">
                  <ShieldIcon type={shield.type as Shield['type']} size={32} />
                </div>
                <div>
                  <span class="font-medium capitalize block">{shield.type === 'none' ? 'No Shield' : `${shield.type} Shield`}</span>
                  {#if shield.duration > 0}
                    <p class="text-sm text-gray-400">Protected for {formatDuration(shield.duration)}</p>
                  {:else}
                    <p class="text-sm text-gray-400">Message can be overwritten instantly</p>
                  {/if}
                </div>
              </div>
              <div class="flex items-center gap-4">
                <span class="text-lg font-bold {
shield.type !== 'none' ? 'text-purple-500' : 'text-gray-400'
                }">€{shield.price.toFixed(2)}</span>
                <div class="w-6 h-6 rounded-full border-2 border-gray-600 flex items-center justify-center {selectedShield === shield.type ? 'border-purple-500 bg-purple-500' : ''}">
                  {#if selectedShield === shield.type}
                    <Check size={14} class="text-white" />
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>

        <div class="p-6 pt-2">
          <button
            class="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:hover:bg-purple-600 py-3 rounded-xl font-medium transition-colors"
            on:click={handleConfirm}
          >
            Post message {selectedShield !== 'none' ? `with ${selectedShield} shield` : ''} (€{SHIELD_TIERS[selectedShield].price.toFixed(2)})
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>

  .form-checkbox:checked {
    background-color: #6b46c1;
    border-color: #6b46c1;
  }
</style>