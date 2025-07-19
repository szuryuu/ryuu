<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import ProjectList from "~/components/project/ProjectList.vue";

const scroll_container = ref<HTMLElement | null>(null);
const scroll_progress = ref(0);

const scrollX = (e: WheelEvent) => {
  e.preventDefault();
  if (scroll_container.value) {
    const sensitivity = 0.4;
    let scrollAmount = 0;

    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      scrollAmount = e.deltaX * sensitivity; // Trackpad horizontal scroll
    } else {
      scrollAmount = e.deltaY * sensitivity; // Mouse wheel/trackpad vertical scroll
    }

    scroll_container.value.scrollLeft += scrollAmount;
  }
};

const calculateProgress = () => {
  if (scroll_container.value) {
    const scrollLeft = scroll_container.value.scrollLeft;
    const scrollWidth = scroll_container.value.scrollWidth;
    const progress = (scrollLeft / (scrollWidth - window.innerWidth)) * 100;
    scroll_progress.value = progress;
  }
};

const handleScroll = () => {
  requestAnimationFrame(calculateProgress);
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div class="flex flex-1 relative">
    <div
      ref="scroll_container"
      class="items-center justify-center w-full grid gap-4 md:grid-cols-3 transition-all duration-500 overflow-auto"
      @wheel="scrollX"
      @scroll="handleScroll"
    >
      <div
        id="title"
        class="flex justify-center items-center h-full md:col-span-1 col-span-full select-none"
        v-gsap.from="{ autoAlpha: 0, x: -200 }"
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
        class="flex justify-center items-center h-full md:col-span-2 col-span-full transition-all duration-500"
      >
        <div class="w-full">
          <ProjectList />
        </div>
      </div>
    </div>
    <div
      class="fixed bottom-0 left-0 h-0.5 bg-neutral-600 z-50 transition-all duration-150"
      :style="{ width: `${scroll_progress}%` }"
    />
  </div>
</template>
