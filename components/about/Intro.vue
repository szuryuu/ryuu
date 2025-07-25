<script setup lang="ts">
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onMounted, onUnmounted, nextTick, ref } from "vue";
import LinkButton from "~/components/LinkButton.vue";

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
        <div class="flex flex-col h-full justify-between gap-4 md:p-12">
          <div class="flex flex-col font-display">
            <h1
              class="text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight"
            >
              Shafwan
            </h1>
            <h2
              class="text-3xl md:text-4xl font-light text-gray-300 leading-relaxed tracking-wide"
            >
              Ilham Dzaky
            </h2>
            <div class="w-16 h-1 bg-white mt-2 rounded-full"></div>
          </div>
          <div class="text-xl text-justify select-none font-display">
            <span class="bg-white text-black font-semibold px-1 rounded"
              >Fullstack developer</span
            >
            building secure, scalable, and user-friendly software from frontend
            interfaces to backend systems. Currently deepening knowledge in
            <span class="bg-white text-black font-semibold px-1 rounded"
              >cybersecurity</span
            >
            to create solutions that are not just functional, but also
            <span class="bg-white text-black font-semibold px-1 rounded"
              >resilient and secure</span
            >.
          </div>
          <div class="flex gap-4">
            <LinkButton to="#" aria-label="Contact Me">Contact Me</LinkButton>
          </div>
        </div>
      </div>

      <div class="col-span-1 flex justify-center items-center">
        <img
          src="https://picsum.photos/300/300"
          alt="Project Image"
          class="h-96 w-96"
        />
      </div>
    </div>
  </div>
</template>
