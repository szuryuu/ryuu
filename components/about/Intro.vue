<script setup lang="ts">
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onMounted, onUnmounted, nextTick, ref } from "vue";
// import ImageLayout from "./ImageLayout.vue";

onMounted(async () => {
  await nextTick();
});

onUnmounted(() => {
  ScrollTrigger.getAll().forEach((st) => st.kill());
});
</script>

<template>
  <div class="flex w-full justify-center items-center">
    <div class="grid grid-cols-2">
      <div class="col-span-1 flex justify-center items-center">
        <div class="flex flex-col gap-4 md:p-12">
          <div class="flex flex-col">
            <span class="text-justify text-3xl">Shafwan</span
            ><span class="text-2xl">Ilham Dzaky</span>
          </div>
          <div class="text-xl">
            Building secure, scalable, and user-friendly software from frontend
            interfaces to backend systems. Currently deepening knowledge in
            <span class="text-cyan-400 font-semibold">cybersecurity</span>
            to create solutions that are not just functional, but also
            <span class="text-purple-400 font-semibold"
              >resilient and secure</span
            >.
          </div>
          <div class="flex gap-4">
            <UButton color="neutral">Button</UButton> <UButton>Button</UButton>
          </div>
        </div>
      </div>
      <div class="col-span-1 flex justify-center items-center">hallo</div>
    </div>
  </div>
</template>
