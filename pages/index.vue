<script setup lang="ts">
import Hero from "~/components/Hero.vue";
import { usePageEnter } from "~/composables/usePageEnter";

const pageRef = usePageEnter({ y: 20, duration: 0.6 });
</script>

<template>
  <div ref="pageRef" class="min-h-screen flex flex-col" style="opacity: 0">
    <Hero />
    <div class="items-end flex flex-1">
      <div
        class="w-full py-2 justify-between items-end grid grid-cols-1 md:grid-cols-3 select-none"
      >
        <div class="md:col-span-2">
          <h5 class="py-4 uppercase font-display text-xs text-white">
            full stack developer / devops / cyber security
          </h5>
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
  </div>
</template>
