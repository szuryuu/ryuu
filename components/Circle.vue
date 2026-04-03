<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <div
    class="fixed inset-x-0 top-0 h-[100svh] w-full flex justify-center items-center -z-10 pointer-events-none overflow-hidden"
  >
    <div
      class="absolute rounded-full opacity-50 -z-10 md:w-[800px] md:h-[800px] w-[500px] h-[500px] transform-gpu will-change-transform"
      style="
        background: radial-gradient(circle, #242424, transparent);
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
      "
    ></div>
  </div>
</template>
