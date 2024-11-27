<script lang="ts">
  export let type: 'none' | 'bronze' | 'silver' | 'gold' | 'platinum';
  export let size = 24;

  const colors = {
    none: '#6B7280',
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
    platinum: '#E5E4E2'
  };
</script>

{#if type === 'none'}
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={colors[type]} stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
{:else if type === 'bronze'}
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={colors[type]} stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 8v8" />
    <path d="M8 12h8" />
  </svg>
{:else if type === 'silver'}
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={colors[type]} stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M8 12l3 3 5-5" />
  </svg>
{:else if type === 'gold'}
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={colors[type]} stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 9v6" />
    <path d="M9 12h6" />
  </svg>
{:else}
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={colors[type]} stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 9v6" />
    <path d="M9 12h6" />
    <path d="M12 3v3" />
    <path d="M12 18v3" />
    <path d="M5 12h3" />
    <path d="M16 12h3" />
  </svg>
{/if}