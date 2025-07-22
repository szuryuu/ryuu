<!-- ~/components/about/ImageLayoutOne.vue -->
<template>
  <div class="absolute w-52 h-60 mx-auto" id="layout1">
    <img
      v-for="(img, i) in images"
      :key="i"
      :src="img.src"
      :alt="img.alt"
      :class="img.class"
    />
  </div>
</template>

<script setup lang="ts">
const images = [
  {
    src: "https://picsum.photos/200?1",
    alt: "Card Back",
    class: "w-48 h-52 rounded-md absolute -top-5 left-28 z-10 border",
  },
  {
    src: "https://picsum.photos/200?2",
    alt: "Card Middle",
    class:
      "w-48 h-52 rounded-md absolute -top-8 -left-28 z-20 border border-red-500",
  },
  {
    src: "https://picsum.photos/200?3",
    alt: "Card Front",
    class:
      "w-48 h-52 rounded-md absolute top-0 left-0 z-30 border border-yellow-500",
  },
];
</script>
