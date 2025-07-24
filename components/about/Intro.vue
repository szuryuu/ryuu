<script setup lang="ts">
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onMounted, onUnmounted, nextTick, ref } from "vue";
import ImageLayout from "./ImageLayout.vue";

onMounted(async () => {
  await nextTick();
});

onUnmounted(() => {
  ScrollTrigger.getAll().forEach((st) => st.kill());
});
</script>

<template>
  <div class="flex w-full justify-center items-center">
    <div class="grid grid-cols-2">
      <section class="col-span-1 flex justify-center items-center">
        <ImageLayout />
      </section>
      <section class="col-span-1 flex justify-center items-center text-justify">
        Hi! I'm Shafwan Ilham Dzaky, a Full Stack Developer with a strong
        interest in Cyber Security. I build secure, scalable, and user-friendly
        software — from frontend interfaces to backend systems. Currently, I’m
        deepening my knowledge in cybersecurity to complement my development
        skills, aiming to create solutions that are not just functional, but
        also resilient and secure.
      </section>
    </div>
  </div>
</template>
