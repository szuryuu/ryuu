<script setup lang="ts">
import { onMounted } from "vue";
import { gsap, ScrollTrigger } from "gsap/all";
import ProjectList from "~/components/project/ProjectList.vue";

gsap.registerPlugin(ScrollTrigger);

onMounted(() => {
  const panels = gsap.utils.toArray(".panel");

  gsap.to(panels, {
    xPercent: -(100 * (panels.length - 1)),
    ease: "none",
    scrollTrigger: {
      trigger: ".panel-container", // Container yang akan jadi trigger
      start: "top top",
      end: () => "+=" + 100 * panels.length + "%",
      pin: ".panel-container", // Container yang akan di-pin
      scrub: 0.5,
      markers: true, // Hapus ini di production
    },
  });
});
</script>

<template>
  <div
    class="items-center justify-center w-full grid md:grid-cols-3 gap-4 panel-container"
  >
    <div
      class="flex justify-center items-center h-full md:col-span-1 col-span-full select-none panel"
    >
      <div class="w-full md:px-12">
        <span>プロジェクト</span>
        <div class="flex gap-4">
          <USeparator />
          <span>Project</span>
        </div>
      </div>
    </div>
    <div
      class="flex justify-center items-center h-full md:col-span-2 col-span-full overflow-auto panel"
    >
      <ProjectList />
    </div>
  </div>
</template>
