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
  <div class="flex w-full">
    <div
      id="intro-1"
      class="flex flex-col w-full items-center justify-center panel"
    >
      <div class="w-full md:px-12">
        <span>プロジェクト</span>
        <div class="flex gap-4">
          <USeparator />
          <span>About</span>
        </div>
      </div>
    </div>

    <div
      id="intro-2"
      class="flex flex-col w-full items-center justify-center panel"
    >
      <div class="flex flex-col px-12">
        a Full Stack Developer with a strong interest in Cyber Security. I build
        secure, scalable, and user-friendly software — from frontend interfaces
        to backend systems. Currently, I’m deepening my knowledge in
        cybersecurity to complement my development skills, aiming to create
        solutions that are not just functional, but also resilient and secure.
      </div>
    </div>
  </div>
</template>
