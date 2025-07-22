<script setup lang="ts">
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onMounted, nextTick, computed, ref } from "vue";
import { useTimeline } from "~/composables/useTimeline";
import {
  ImageLayoutOne,
  ImageLayoutTwo,
  ImageLayoutThree,
} from "~/components/about";

const { timeline } = useTimeline();
const shouldAnimate = ref(false);

const items = computed(() => {
  return timeline.value.map((item) => ({
    ...item,
    title: item.title.toUpperCase(),
  }));
});

onMounted(async () => {
  await nextTick();

  gsap.registerPlugin(ScrollTrigger);
  console.log("gsap registered");

  setTimeout(() => {
    ScrollTrigger.create({
      trigger: "#experience-section",
      start: "top 80%",
      end: "bottom 20%",
      markers: true, // Tambahkan ini untuk debugging
      onEnter: () => {
        console.log("ScrollTrigger: enter");
        shouldAnimate.value = true;
      },
      onLeave: () => {
        console.log("ScrollTrigger: leave");
      },
      onEnterBack: () => {
        console.log("ScrollTrigger: enter back");
        shouldAnimate.value = true;
      },
      onLeaveBack: () => {
        console.log("ScrollTrigger: leave back");
      },
    });

    // Refresh ScrollTrigger setelah setup
    ScrollTrigger.refresh();
  }, 100);
});
</script>

<template>
  <div
    class="w-full min-h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth"
  >
    <section
      id="intro-section"
      class="h-full snap-start snap-always flex items-center justify-center"
    >
      <div class="flex flex-col w-full items-center justify-center">
        <div class="w-full md:px-12">
          <span>プロジェクト</span>
          <div class="flex gap-4">
            <USeparator />
            <span>Project</span>
          </div>
        </div>
      </div>

      <div class="flex flex-col w-full items-center justify-center">
        <div class="flex flex-col px-12">hallo</div>
      </div>
    </section>

    <section
      id="experience-section"
      class="h-full snap-start snap-always flex items-center justify-center w-full"
    >
      <div class="grid grid-cols-2 gap-4 w-full">
        <div class="flex justify-center items-center px-12 relative">
          <!-- Layout 1 -->
          <ImageLayoutOne :should-animate="shouldAnimate" />
          <!-- Layout 2 -->
          <ImageLayoutTwo class="hidden" />
          <!-- Layout 3 -->
          <ImageLayoutThree class="hidden" />
        </div>

        <div class="flex justify-center items-center">
          <UTimeline
            :items="items"
            :ui="{
              item: 'even:flex-row-reverse even:-translate-x-[calc(100%-2rem)] even:text-right',
            }"
            class="translate-x-[calc(50%-1rem)]"
          />
        </div>
      </div>
    </section>
  </div>
</template>
