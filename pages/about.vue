<script setup lang="ts">
import { onMounted, onUnmounted, nextTick } from "vue";
import { gsap, ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

function initTriggers() {
  gsap.set(".panel", { zIndex: (i, target, targets) => targets.length - i });

  gsap.to(".panel:not(:last-child)", {
    yPercent: -100,
    ease: "none",
    stagger: 0.5,
    scrollTrigger: {
      trigger: "#panel-container",
      start: "top top",
      end: "+=300%",
      scrub: true,
      pin: true,
    },
  });
}

onMounted(async () => {
  await nextTick();

  setTimeout(() => {
    initTriggers();
    ScrollTrigger.refresh();
  }, 100);
});

onUnmounted(() => {});
</script>

<template>
  <div id="panel-container" class="w-full bg-yellow-500">
    <section class="panel bg-red-500">
      <div class="text-6xl font-bold text-white">Panel 1</div>
    </section>
    <section class="panel bg-yellow-400">
      <div class="text-6xl font-bold text-white">Panel 2</div>
    </section>
    <section class="panel bg-red-500">
      <div class="text-6xl font-bold text-white">Panel 1</div>
    </section>
    <section class="panel bg-yellow-400">
      <div class="text-6xl font-bold text-white">Panel 2</div>
    </section>
  </div>
</template>

<style scoped>
#panel-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
}

.panel {
  position: absolute;
  will-change: transform;
}
</style>
