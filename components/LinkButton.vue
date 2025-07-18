<script setup lang="ts">
defineProps({
  to: String,
  ariaLabel: String,
});
</script>

<template>
  <NuxtLink
    :to="to"
    class="border border-neutral-600 rounded-lg hover:bg-neutral-800 p-2 bg-[#0F172B] text-xs flex items-center"
    :aria-label="ariaLabel"
  >
    <slot />
  </NuxtLink>
</template>
