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
      <section class="flex items-end">
        <h1 class="text-2xl">Experience</h1>
      </section>
      <section class="flex items-end">Hallo</section>
      <section class="col-span-full w-full flex justify-center items-center">
        <UTimeline
          color="neutral"
          size="xs"
          orientation="horizontal"
          :items="items"
          class="w-full overflow-x-scroll"
        />
      </section>
    </div>
  </div>
</template>
