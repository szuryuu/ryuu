<script setup lang="ts">
import gsap from "gsap";
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import ProjectList from "~/components/project/ProjectList.vue";
import { useMediaQuery } from "@vueuse/core";

const isDesktop = useMediaQuery("(min-width: 768px)");

const scroll_container = ref<HTMLElement | null>(null);
const scroll_progress = ref(0);

const scrollX = (e: WheelEvent) => {
  if (!isDesktop.value) return;

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

onMounted(async () => {
  await nextTick();

  window.addEventListener("scroll", handleScroll);

  gsap.from("#title", {
    autoAlpha: 0,
    x: -200,
    duration: 1,
    ease: "power2.out",
  });
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div class="flex flex-1 relative">
    <div
      ref="scroll_container"
      class="items-center justify-center w-full h-full transition-all duration-500 grid gap-4 md:grid-cols-3 overflow-auto"
      @wheel="scrollX"
      @scroll="handleScroll"
    >
      <div
        id="title"
        class="flex justify-center items-center md:col-span-1 select-none"
      >
        <div class="flex w-full md:px-12" :class="isDesktop ? 'flex-col' : ''">
          <span
            class="text-2xl font-bold font-decoration shrink-0"
            :class="isDesktop ? '' : 'upside'"
            >プロジェクト</span
          >
          <div class="flex gap-4" :class="isDesktop ? '' : 'flex-col'">
            <USeparator
              color="secondary"
              :orientation="isDesktop ? 'horizontal' : 'vertical'"
            />
            <span
              class="font-display text-xs uppercase px-1"
              :class="isDesktop ? '' : '[writing-mode:vertical-lr]'"
              >Project</span
            >
          </div>
        </div>
      </div>

      <div
        id="project"
        class="flex justify-center items-center md:col-span-2 transition-all duration-500"
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
