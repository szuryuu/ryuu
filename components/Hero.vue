<script setup lang="ts">
import { computed } from "vue";
import { useMediaQuery } from "@vueuse/core";

const isDesktop = useMediaQuery("(min-width: 768px)");
</script>

<template>
  <div
    class="absolute top-0 right-0 bottom-0 -z-10 left-0 flex justify-center items-center"
  >
    <div
      class="absolute rounded-full opacity-50 -z-10"
      :class="isDesktop ? 'w-[800px] h-[800px]' : 'w-[500px] h-[500px]'"
      style="
        background: radial-gradient(circle, #242424, transparent);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      "
    ></div>

    <div class="flex items-start">
      <div class="upside text-2xl font-bold font-decoration shrink-0">
        ポルトフォリオ
      </div>
      <span
        class="font-display [writing-mode:vertical-lr] text-xs uppercase px-1"
        >portofolio</span
      >
    </div>
  </div>
</template>
