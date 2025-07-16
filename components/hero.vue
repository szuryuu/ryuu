<script setup lang="ts">
import { computed } from "vue";
import { useMediaQuery } from "@vueuse/core";

const isDesktop = useMediaQuery("(min-width: 768px)");

const gradientClass = computed(() =>
  isDesktop.value
    ? "bg-[radial-gradient(circle_400px_at_50%_300px,#2E2E2E,transparent)]"
    : "bg-[radial-gradient(circle_500px_at_50%_400px,#2E2E2E,transparent)]",
);
</script>

<template>
  <div
    class="absolute top-0 right-0 bottom-0 -z-10 left-0 flex justify-center items-center"
    :class="gradientClass"
  >
    <div class="flex items-start gap-0">
      <div
        class="upside dark:text-white text-2xl font-bold font-decoration flex-shrink-0"
      >
        ポルトフォリオ
      </div>
      <span class="font-display [writing-mode:vertical-lr]">(portofolio)</span>
    </div>
  </div>
</template>
