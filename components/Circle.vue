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
      class="absolute rounded-full opacity-50 -z-10 md:w-[800px] md:h-[800px] w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      style="background: radial-gradient(circle, #242424, transparent);"
    ></div>
  </div>
</template>
