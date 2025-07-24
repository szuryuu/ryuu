<script setup lang="ts">
import { onMounted, onUnmounted, nextTick, ref, provide } from "vue";
import { Experience, Intro, Skill } from "@/components/about";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const shouldAnimated = ref(false);

provide("shouldAnimate", shouldAnimated);

onMounted(async () => {
  await nextTick();

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
      onEnter: (self) => {
        shouldAnimated.value = self.isActive;
      },
      onLeave: (self) => {
        shouldAnimated.value = !self.isActive;
      },
      onEnterBack: (self) => {
        shouldAnimated.value = self.isActive;
      },
      onLeaveBack: (self) => {
        shouldAnimated.value = !self.isActive;
      },
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

  ScrollTrigger.refresh();
});

onUnmounted(() => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
});
</script>

<template>
  <div class="w-full flex-1">
    <section class="panel min-h-screen flex items-center justify-center w-full">
      <Intro />
    </section>
    <section class="panel min-h-screen flex items-center justify-center w-full">
      <Skill />
    </section>
    <section class="panel min-h-screen flex items-center justify-center w-full">
      <Experience />
    </section>
  </div>
</template>
