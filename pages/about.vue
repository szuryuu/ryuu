<script setup lang="ts">
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onMounted, onUnmounted, nextTick, computed, ref } from "vue";
import { useTimeline } from "~/composables/useTimeline";
import {
  ImageLayoutOne,
  ImageLayoutTwo,
  ImageLayoutThree,
  Intro,
} from "~/components/about";

const { timeline } = useTimeline();

const items = computed(() => {
  return timeline.value.map((item) => ({
    ...item,
    title: item.title.toUpperCase(),
  }));
});

const timelineValue = ref(0);
const shouldAnimate = ref(false);
const currentLayout = ref(1);

onMounted(async () => {
  await nextTick();

  gsap.registerPlugin(ScrollTrigger);

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
    scrub: true,
    onUpdate: (self) => {
      const progress = self.progress;

      if (progress < 0.333) {
        currentLayout.value = 1;
      } else if (progress < 0.666) {
        currentLayout.value = 2;
      } else {
        currentLayout.value = 3;
      }

      console.log("Current Layout:", currentLayout.value);
      console.log("Progress:", progress);

      timelineValue.value = Math.floor(currentLayout.value - 1);
    },
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
      class="min-h-screen flex items-center justify-center w-full panel"
    >
      <Intro />
    </section>

    <section
      id="experience-section"
      class="min-h-screen flex items-center justify-center w-full panel"
    >
      <div class="grid grid-cols-2 gap-4 w-full">
        <div class="flex justify-center items-center px-12 relative">
          <!-- Layout 1 -->
          <ImageLayoutOne
            v-show="currentLayout === 1"
            :should-animate="shouldAnimate"
          />
          <!-- Layout 2 -->
          <ImageLayoutTwo
            v-show="currentLayout === 2"
            :should-animate="shouldAnimate"
          />
          <!-- Layout 3 -->
          <ImageLayoutThree
            v-show="currentLayout === 3"
            :should-animate="shouldAnimate"
          />
        </div>

        <div class="flex justify-center items-center">
          <UTimeline
            :items="items"
            :default-value="timelineValue"
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
