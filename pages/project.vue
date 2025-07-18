<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { gsap, ScrollTrigger } from "gsap/all";
import ProjectList from "~/components/project/ProjectList.vue";

gsap.registerPlugin(ScrollTrigger);

const isScrolling = ref(false);

onMounted(() => {
  ScrollTrigger.create({
    trigger: "#project",
    start: "left 90%",
    end: "right 10%",
    onEnter: () => {
      isScrolling.value = true;
    },
    onLeave: () => {
      isScrolling.value = false;
    },
    onEnterBack: () => {
      isScrolling.value = true;
    },
    onLeaveBack: () => {
      isScrolling.value = false;
    },
  });

  gsap.fromTo(
    "#title",
    { opacity: 0, x: -200 },
    { opacity: 1, x: 0, duration: 1, ease: "power2.out" },
  );

  gsap.fromTo(
    "#project",
    { opacity: 0, x: -300 },
    { opacity: 1, x: 0, duration: 1, ease: "power2.out" },
  );
});

onUnmounted(() => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
});
</script>

<template>
  <div
    class="items-center justify-center w-full grid gap-4 transition-all duration-500 ease-in-out overflow-auto"
    :class="isScrolling ? 'md:grid-cols-5' : 'md:grid-cols-3'"
  >
    <div
      id="title"
      class="flex justify-center items-center h-full md:col-span-1 col-span-full select-none"
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
      id="project"
      class="flex justify-center items-center h-full col-span-full transition-all duration-500"
      :class="isScrolling ? 'md:col-span-4' : 'md:col-span-2'"
    >
      <div class="w-full">
        <ProjectList />
      </div>
    </div>
  </div>
</template>
