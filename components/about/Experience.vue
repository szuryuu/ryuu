<script setup lang="ts">
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onMounted, onUnmounted, nextTick, computed, ref } from "vue";
import { useTimeline } from "~/composables/useTimeline";

const { timeline } = useTimeline();

const items = computed(() => {
  return timeline.value.map((item) => ({
    ...item,
    title: item.title.toUpperCase(),
  }));
});

onMounted(async () => {
  await nextTick();

  // Optional: Add entrance animations
  gsap.from(".experience-header", {
    y: 50,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
  });

  gsap.from(".experience-quote", {
    y: 30,
    opacity: 0,
    duration: 0.8,
    delay: 0.2,
    ease: "power2.out",
  });

  gsap.from(".experience-timeline", {
    y: 40,
    opacity: 0,
    duration: 0.8,
    delay: 0.4,
    ease: "power2.out",
  });
});

onUnmounted(() => {
  ScrollTrigger.getAll().forEach((st) => st.kill());
});
</script>

<template>
  <div class="flex w-full h-full justify-center items-center px-4 md:px-12">
    <div class="w-full max-w-6xl">
      <!-- Header Section -->
      <div
        class="experience-header grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 lg:mb-16"
      >
        <!-- Title -->
        <section
          class="flex flex-col items-center lg:items-start justify-center lg:justify-end text-center lg:text-left"
        >
          <h2 class="font-decoration text-2xl md:text-3xl mb-2 select-none">
            経験
          </h2>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-display font-bold">
            Experience
          </h1>
          <div class="w-16 h-1 bg-white mt-4 rounded-full"></div>
        </section>

        <!-- Quote -->
        <section
          class="experience-quote flex items-center justify-center lg:items-end lg:justify-center"
        >
          <div class="text-center lg:text-right max-w-sm">
            <blockquote class="relative">
              <div class="mb-4">
                <svg
                  class="w-8 h-8 text-gray-400 mx-auto lg:ml-auto lg:mr-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"
                  />
                </svg>
              </div>
              <p
                class="text-sm md:text-base italic text-gray-300 leading-relaxed font-display mb-4"
              >
                "Every expert was once a beginner. Every pro was once an
                amateur."
              </p>
              <cite
                class="block text-xs md:text-sm text-gray-400 not-italic font-medium"
              >
                — Robin Sharma
              </cite>
            </blockquote>
          </div>
        </section>
      </div>

      <!-- Timeline Section -->
      <section class="experience-timeline w-full">
        <div class="mb-6 text-center">
          <h3
            class="text-xl md:text-2xl font-display text-gray-300 mb-2 select-none"
          >
            My Journey
          </h3>
          <div
            class="w-24 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent mx-auto"
          ></div>
        </div>

        <div
          class="bg-black/20 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50"
        >
          <UTimeline
            color="neutral"
            size="sm"
            orientation="horizontal"
            :default-value="3"
            :items="items"
            class="w-full overflow-x-auto"
          />
        </div>
      </section>
    </div>
  </div>
</template>
