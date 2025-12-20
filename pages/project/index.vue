<script setup lang="ts">
import gsap from "gsap";
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import ProjectList from "~/components/project/ProjectList.vue";

const scroll_container = ref<HTMLElement | null>(null);
const scroll_progress = ref(0);
const useNativeScroll = ref(false);

const scrollX = (e: WheelEvent) => {
  const el = scroll_container.value;
  if (!el || useNativeScroll.value) return;

  // Prevent default ONLY if we're handling it
  e.preventDefault();

  const sensitivity = 0.4;
  const scrollAmount =
    Math.abs(e.deltaX) > Math.abs(e.deltaY)
      ? e.deltaX * sensitivity
      : e.deltaY * sensitivity;

  el.scrollLeft += scrollAmount;
};

const calculateProgress = () => {
  if (scroll_container.value) {
    const { scrollLeft, scrollWidth, clientWidth } = scroll_container.value;
    const maxScroll = scrollWidth - clientWidth;

    if (maxScroll > 0) {
      scroll_progress.value = Math.min(
        100,
        Math.max(0, (scrollLeft / maxScroll) * 100),
      );
    } else {
      scroll_progress.value = 0;
    }
  }
};

const handleScroll = () => {
  requestAnimationFrame(calculateProgress);
};

const checkScrollMode = () => {
  if (!scroll_container.value) return;

  // Detect if we should use native scroll based on viewport
  // Rule: if viewport width < 768px, use native mobile scroll
  useNativeScroll.value = window.innerWidth < 768;
};

onMounted(async () => {
  await nextTick();
  checkScrollMode();

  window.addEventListener("resize", checkScrollMode);

  if (scroll_container.value) {
    scroll_container.value.addEventListener("scroll", handleScroll);
  }

  gsap.from("#title", {
    autoAlpha: 0,
    x: -200,
    duration: 1,
    ease: "power2.out",
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", checkScrollMode);
  if (scroll_container.value) {
    scroll_container.value.removeEventListener("scroll", handleScroll);
  }
});
</script>

<template>
  <div
    class="flex flex-col md:flex-row flex-1 relative max-w-7xl w-full mx-auto min-h-screen items-center justify-center"
  >
    <ClientOnly>
      <!-- Title -->
      <div
        id="title"
        class="flex justify-center items-end md:items-center select-none w-full h-full"
      >
        <div class="flex w-full md:px-12">
          <span
            class="text-2xl font-bold font-decoration shrink-0 [writing-mode:vertical-rl]"
            >プロジェクト</span
          >
          <div class="flex gap-4 flex-col items-center">
            <USeparator color="secondary" orientation="vertical" />
            <span
              class="font-display text-xs uppercase px-1 [writing-mode:vertical-lr]"
              >Project</span
            >
          </div>
        </div>
      </div>
      <div
        ref="scroll_container"
        class="flex items-center justify-center w-full h-full transition-all duration-500 overflow-y-hidden min-w-5xl"
        :class="useNativeScroll ? 'overflow-x-auto' : 'overflow-x-hidden'"
        @wheel="scrollX"
        @scroll="handleScroll"
      >
        <div
          id="project"
          class="flex justify-center items-center transition-all duration-500"
        >
          <div class="w-full">
            <ProjectList />
          </div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div
        class="fixed bottom-0 left-0 h-1 bg-accent z-50 transition-all duration-150"
        :style="{ width: `${scroll_progress}%` }"
      />
    </ClientOnly>
  </div>
</template>
