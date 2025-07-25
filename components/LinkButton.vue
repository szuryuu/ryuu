<script setup lang="ts">
defineProps({
  to: String,
  ariaLabel: String,
});
</script>

<template>
  <NuxtLink
    :to="to"
    class="border rounded-lg p-2 bg-primary border-accent text-xs flex items-center hover:bg-white transform transition-all duration-400 transform-fill hover:text-black"
    :aria-label="ariaLabel"
  >
    <slot />
  </NuxtLink>
</template>
