<script lang="ts">
  import { onMount } from 'svelte';
  let countdown = 5;

  onMount(() => {
    const timer = setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        clearInterval(timer);
        window.location.href = '/';
      }
    }, 1000);

    return () => clearInterval(timer);
  });
</script>

<div class="text-center space-y-4">
  <div class="bg-green-500 text-white p-4 rounded-lg inline-block mb-8">
    <h1 class="text-2xl font-bold">Payment Successful!</h1>
    <p>Your message is now the last word.</p>
  </div>

  <p>Redirecting to home in {countdown} seconds...</p>
  <a href="/" class="btn inline-block">Return Now</a>
</div>