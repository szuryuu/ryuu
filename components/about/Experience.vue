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
    <div class="grid grid-cols-2 bg-yellow-300 w-full h-full">
      <section>Hallo</section>
      <section>Hallo</section>
      <section class="col-span-full w-full">
        <UTimeline
          color="neutral"
          size="xs"
          orientation="horizontal"
          :items="items"
          class="w-full"
        />
      </section>
    </div>
  </div>
</template>
