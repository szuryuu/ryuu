<script setup lang="ts">
defineProps<{
  to: string;
  ariaLabel?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
}>();
</script>

<template>
  <NuxtLink
    :to="to"
    :target="target"
    :rel="target === '_blank' ? (rel ?? 'noopener noreferrer') : rel"
    class="border rounded-lg p-2 bg-primary border-accent text-xs flex items-center hover:bg-white transform transition-all duration-400 transform-fill hover:text-black"
    :aria-label="ariaLabel"
  >
    <slot />
  </NuxtLink>
</template>
