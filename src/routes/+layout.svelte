<script lang="ts">
  import '../app.css';
</script>

<div class="min-h-screen">
  <nav class="bg-gray-800 p-4">
    <div class="max-w-4xl mx-auto flex justify-between items-center">
      <a href="/" class="text-xl font-bold text-purple-400">The Last Word</a>
      <div class="space-x-4">
        <a href="/history" class="text-gray-300 hover:text-white">History</a>
        <a href="/stats" class="text-gray-300 hover:text-white">Stats</a>
      </div>
    </div>
  </nav>

  <slot />
</div>