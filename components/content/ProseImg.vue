<template>
  <figure class="my-8">
    <img
      :src="src"
      :alt="alt"
      class="w-full rounded-lg border border-white/10 object-cover"
    />
    <figcaption
      v-if="alt"
      class="text-xs text-white/40 font-display text-center mt-2"
    >
      {{ alt }}
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
defineProps<{
  src: string;
  alt?: string;
}>();
</script>
