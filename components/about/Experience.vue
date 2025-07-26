<script setup lang="ts">
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onMounted, onUnmounted, nextTick, computed, ref } from "vue";
import { useTimeline } from "~/composables/useTimeline";

const { timeline } = useTimeline();

const items = computed(() => {
  return timeline.value.map((item) => ({
    ...item,
    title: item.title.toUpperCase(),
  }));
});

onMounted(async () => {
  await nextTick();
});

onUnmounted(() => {
  ScrollTrigger.getAll().forEach((st) => st.kill());
});
</script>

<template>
  <div class="flex w-full h-full justify-center items-center">
    <div class="grid grid-cols-2 w-full h-full">
      <section class="flex flex-col items-start justify-end col-span-1">
        <h2 class="font-decoration text-2xl">経験</h2>
        <h1 class="text-4xl font-display">Experience</h1>
        <div class="w-16 h-1 bg-white mt-2 rounded-full"></div>
      </section>

      <section class="flex items-end justify-center col-span-1">
        <div class="text-right max-w-xs">
          <blockquote class="relative">
            <p
              class="text-sm italic text-gray-500 leading-relaxed font-display"
            >
              "Every expert was once a beginner. Every pro was once an amateur."
            </p>
            <cite class="block text-xs text-gray-400 mt-2 not-italic">
              — Robin Sharma
            </cite>
          </blockquote>
        </div>
      </section>

      <section class="col-span-full w-full flex justify-center items-center">
        <UTimeline
          color="neutral"
          size="xs"
          orientation="horizontal"
          :default-value="3"
          :items="items"
          class="w-full overflow-x-scroll"
        />
      </section>
    </div>
  </div>
</template>
