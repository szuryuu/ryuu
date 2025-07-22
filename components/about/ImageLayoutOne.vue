<script setup lang="ts">
import gsap from "gsap";
import { onMounted, nextTick, watch } from "vue";

const images = [
  {
    src: "https://picsum.photos/200?1",
    alt: "Card Back",
    class: "w-48 h-52 rounded-md absolute -top-5 left-28 z-10 ",
  },
  {
    src: "https://picsum.photos/200?2",
    alt: "Card Middle",
    class: "w-48 h-52 rounded-md absolute -top-8 -left-28 z-20  ",
  },
  {
    src: "https://picsum.photos/200?3",
    alt: "Card Front",
    class: "w-48 h-52 rounded-md absolute top-0 left-0 z-30  ",
  },
];

const props = defineProps<{
  shouldAnimate: boolean;
}>();

let inTimeline: gsap.core.Timeline;
let outTimeline: gsap.core.Timeline;

onMounted(async () => {
  await nextTick();

  inTimeline = gsap.timeline({ paused: true });
  inTimeline
    .from("#image-0", {
      autoAlpha: 0,
      x: -50,
      duration: 1,
      ease: "power2.out",
    })
    .from(
      "#image-1",
      { autoAlpha: 0, y: -50, duration: 1, ease: "power2.out" },
      "-=0.5",
    )
    .from(
      "#image-2",
      { autoAlpha: 0, y: 50, duration: 1, ease: "power2.out" },
      "-=0.5",
    );

  outTimeline = gsap.timeline({ paused: true });
  outTimeline
    .to("#image-2", { autoAlpha: 0, y: 100, duration: 0.5, ease: "power2.in" })
    .to(
      "#image-1",
      { autoAlpha: 0, y: -100, duration: 0.5, ease: "power2.in" },
      "-=0.3",
    )
    .to(
      "#image-0",
      { autoAlpha: 0, x: 100, duration: 0.5, ease: "power2.in" },
      "-=0.3",
    );
});

watch(
  () => props.shouldAnimate,
  (val) => {
    if (!inTimeline || !outTimeline) return;
    if (val) {
      outTimeline.pause(0); // reset out
      inTimeline.restart();
    } else {
      inTimeline.pause(0); // reset in
      outTimeline.restart();
    }
  },
);
</script>

<template>
  <div class="absolute w-52 h-60 mx-auto">
    <img
      v-for="(img, i) in images"
      :id="`image-${i}`"
      :key="i"
      :src="img.src"
      :alt="img.alt"
      :class="img.class"
    />
  </div>
</template>
