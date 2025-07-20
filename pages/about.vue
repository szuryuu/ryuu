<script setup lang="ts">
// Tidak perlu import apa-apa, cukup CSS!
</script>

<template>
  <div
    class="w-full min-h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth"
  >
    <section
      class="h-full snap-start snap-always flex items-center justify-center"
    >
      <div class="text-center max-w-2xl p-8">
        <h2 class="text-6xl font-bold text-white mb-4">Panel 1</h2>
        <p class="text-xl text-white/80">Scroll down untuk panel berikutnya</p>
      </div>
    </section>

    <section
      class="h-full snap-start snap-always flex items-center justify-center"
    >
      <div class="text-center max-w-2xl p-8">
        <h2 class="text-6xl font-bold text-white mb-4">Panel 2</h2>
        <p class="text-xl text-white/80">Ini panel kedua</p>
      </div>
    </section>

    <section
      class="h-full snap-start snap-always flex items-center justify-center"
    >
      <div class="text-center max-w-2xl p-8">
        <h2 class="text-6xl font-bold text-white mb-4">Panel 3</h2>
        <p class="text-xl text-white/80">Panel terakhir</p>
      </div>
    </section>
  </div>
</template>
