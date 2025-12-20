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
  <div class="flex w-full justify-center items-center max-w-6xl">
    <div class="grid grid-cols-1 lg:grid-cols-2 md:gap-12">
      <div class="col-span-full md:col-span-1 flex justify-center items-center">
        <div class="flex flex-col h-full justify-center gap-4">
          <!-- Name Section -->
          <div class="flex flex-col">
            <!-- Name -->
            <div class="flex gap-2 font-display items-end">
              <h1 class="text-4xl md:text-5xl font-light text-white">
                Shafwan Ilham Dzaky
              </h1>
            </div>

            <!-- Separator -->
            <div class="w-16 h-1 bg-white mt-2 rounded-full"></div>
          </div>

          <!-- Description -->
          <div class="text-xl text-justify select-none font-display text-white">
            <span class="bg-white text-black font-semibold px-1"
              >Fullstack developer</span
            >
            building secure, scalable, and user-friendly software from frontend
            interfaces to backend systems. Currently deepening knowledge in
            <span class="bg-white text-black font-semibold px-1"
              >cybersecurity</span
            >
            to create solutions that are not just functional, but also
            <span class="bg-white text-black font-semibold px-1"
              >resilient and secure</span
            >.
          </div>

          <!-- Contact -->
          <div
            class="flex gap-4 text-gray-400 justify-start md:justify-center lg:justify-start"
          >
            <LinkButton to="#" aria-label="Contact Me">Contact Me</LinkButton>
          </div>
        </div>
      </div>

      <div
        class="md:col-span-1 hidden md:flex lg:justify-end md:justify-center md:items-center"
      >
        <NuxtImg
          src="/images/profile.jpeg"
          alt="Me"
          class="w-96 h-96 shadow-2xl rounded-lg"
          height="400"
          width="400"
          format="webp"
          preload
        />
      </div>
    </div>
  </div>
</template>
