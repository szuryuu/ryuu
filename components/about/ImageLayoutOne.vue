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

let animationTimeline: gsap.core.Timeline;

onMounted(async () => {
  await nextTick();

  animationTimeline = gsap.timeline({ paused: true });

  animationTimeline
    .from("#image-0", {
      autoAlpha: 0,
      x: -200,
      duration: 1,
      ease: "power2.out",
    })
    .from(
      "#image-1",
      {
        autoAlpha: 0,
        y: -200,
        duration: 1,
        ease: "power2.out",
      },
      "-=0.5",
    )
    .from(
      "#image-2",
      {
        autoAlpha: 0,
        y: 200,
        duration: 1,
        ease: "power2.out",
      },
      "-=0.5",
    );

  watch(
    () => props.shouldAnimate,
    (newValue) => {
      if (newValue && animationTimeline) {
        animationTimeline.play();
      }
    },
  );
});
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
