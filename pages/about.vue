<script setup lang="ts">
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onMounted, onUnmounted, nextTick, computed, ref } from "vue";
import { useTimeline } from "~/composables/useTimeline";
import {
  ImageLayoutOne,
  ImageLayoutTwo,
  ImageLayoutThree,
} from "~/components/about";

const { timeline } = useTimeline();

const items = computed(() => {
  return timeline.value.map((item) => ({
    ...item,
    title: item.title.toUpperCase(),
  }));
});

const shouldAnimate = ref(false);

onMounted(async () => {
  await nextTick();

  gsap.registerPlugin(ScrollTrigger);
  console.log("gsap registered");

  let panels = gsap.utils.toArray(".panel") as HTMLElement[];
  let tops = panels.map((panel) =>
    ScrollTrigger.create({ trigger: panel, start: "top top" }),
  );

  panels.forEach((panel, i) => {
    ScrollTrigger.create({
      trigger: panel,
      start: "top top",
      end: () => `+=${panel.offsetHeight}`,
      pin: true,
      pinSpacing: false,
      snap: 1,
    });
  });

  ScrollTrigger.create({
    snap: {
      snapTo: (progress, self) => {
        if (!self) return 0;

        let panelStarts = tops.map((st) => st.start),
          snapScroll = gsap.utils.snap(panelStarts, self.scroll());
        return gsap.utils.normalize(
          0,
          ScrollTrigger.maxScroll(window),
          snapScroll,
        );
      },
      duration: 0.5,
    },
  });

  ScrollTrigger.create({
    trigger: "#experience-section",
    start: "top 80%",
    end: "bottom 20%",
    onEnter: () => {
      console.log("ScrollTrigger: enter");
      shouldAnimate.value = true;
    },
    onLeave: () => {
      console.log("ScrollTrigger: leave");
      shouldAnimate.value = false;
    },
    onEnterBack: () => {
      console.log("ScrollTrigger: enter back");
      shouldAnimate.value = true;
    },
    onLeaveBack: () => {
      console.log("ScrollTrigger: leave back");
      shouldAnimate.value = false;
    },
  });

  ScrollTrigger.refresh();
});

onUnmounted(() => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
});
</script>

<template>
  <div class="w-full flex-1">
    <section
      id="intro-section"
      class="min-h-screen flex items-center justify-center panel"
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
      class="min-h-screen flex items-center justify-center w-full panel"
    >
      <div class="grid grid-cols-2 gap-4 w-full">
        <div class="flex justify-center items-center px-12 relative">
          <!-- Layout 1 -->
          <ImageLayoutOne :should-animate="shouldAnimate" />
          <!-- Layout 2 -->
          <!-- <ImageLayoutTwo :should-animate="shouldAnimate" class="hidden" /> -->
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
