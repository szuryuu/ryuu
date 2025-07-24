<script setup lang="ts">
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onMounted, onUnmounted, nextTick, watch } from "vue";

onMounted(async () => {
  await nextTick();
});

onUnmounted(() => {
  ScrollTrigger.getAll().forEach((st) => st.kill());
});
</script>

<template>
  <div class="flex w-full bg-yellow-400 justify-center items-center">
    <h1 class="w-full">hallo</h1>
  </div>
</template>
