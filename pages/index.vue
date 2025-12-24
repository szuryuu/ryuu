<script setup lang="ts">
import Hero from "~/components/Hero.vue";
</script>

<template>
  <Hero />
  <div class="items-end flex">
    <div
      class="py-2 justify-between items-end grid grid-cols-1 md:grid-cols-3 select-none"
    >
      <div class="md:col-span-2">
        <h5 class="py-4 uppercase font-display text-xs text-white">
          full stack developer / devops / cyber security
        </h5>

        <!-- Name -->
        <h1 class="text-5xl md:text-7xl lg:text-8xl font-display text-white">
          <span
            class="font-decoration bg-white text-black font-semibold px-2 leading-tight"
            >S.</span
          >
          Ilham Dzaky
        </h1>
      </div>
      <div
        class="text-xs overflow-hidden font-display md:col-span-1 md:block hidden text-right py-4 text-white"
      >
        Full Stack Developer and Cyber Security Engineer dedicated to building
        secure, high-performing software solutions with a strong emphasis on
        functionality and reliability.
      </div>
    </div>
  </div>
</template>
