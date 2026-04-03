<script setup lang="ts">
import Hero from "~/components/Hero.vue";
import { usePageEnter } from "~/composables/usePageEnter";

const pageRef = usePageEnter({ y: 20, duration: 0.6 });
</script>

<template>
  <div ref="pageRef" class="w-full min-h-[100svh]">
    <Hero />
  </div>
</template>
