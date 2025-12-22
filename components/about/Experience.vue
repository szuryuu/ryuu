<script setup lang="ts">
import { computed } from "vue";
import { useTimeline } from "~/composables/useTimeline";
import { certificateArray } from "@/utils/certificates";

const { timeline } = useTimeline();
const certificates = certificateArray;

const { data: projects } = await useAsyncData("projects-count", () =>
  queryCollection("projects").all(),
);

const items = computed(() => {
  return timeline.value.map((item) => ({
    ...item,
    title: item.title.toUpperCase(),
  }));
});

// Key milestones - SPECIFIC achievements
const highlights = [
  {
    id: 1,
    achievement: `${projects.value?.length ?? 0}+ Projects Shipped`,
    impact:
      "End-to-end builds, from raw ideas to production systems people actually use.",
    link: "/project",
  },
  {
    id: 2,
    achievement: `${certificates.length}+ Professional Certifications`,
    impact:
      "Covering full-stack, DevOps, and security, not just surface-level skills.",
    link: "/about/skill",
  },
  {
    id: 3,
    achievement: "2+ Years Experience",
    impact:
      "Growing from intern to reviewer by shipping under real production pressure.",
    link: "/about#experience",
  },
];
</script>

<template>
  <div
    class="flex w-full h-full justify-center items-center max-w-7xl mx-auto px-4"
  >
    <div class="w-full space-y-12">
      <!-- Header -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 text-white">
        <section
          class="flex flex-col items-center lg:items-start text-center lg:text-left"
        >
          <h2 class="font-decoration text-2xl md:text-3xl mb-2">経験</h2>
          <h1 class="text-4xl md:text-5xl font-display font-bold">
            Experience
          </h1>
          <div class="w-16 h-1 bg-white mt-4 rounded-full"></div>
          <p class="mt-4 text-gray-300 max-w-md">
            From first "Hello World" to production deployments — here's how I
            got here.
          </p>
        </section>

        <!-- Highlight Cards - More Engaging Than Quote -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NuxtLink
            v-for="highlight in highlights"
            :key="highlight.id"
            :to="highlight.link"
            class="relative group cursor-pointer"
          >
            <!-- Main Card -->
            <div
              class="relative bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/5 overflow-hidden"
            >
              <!-- Gradient Background Effect -->
              <div
                class="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary opacity-0 group-hover:opacity-90 transition-opacity duration-500 z-10"
              ></div>

              <!-- Content (blur on hover) -->
              <div
                class="relative z-0 transition-all duration-500 group-hover:blur-sm"
              >
                <!-- Achievement -->
                <h3
                  class="text-lg font-display font-semibold text-white mb-2 leading-tight"
                >
                  {{ highlight.achievement }}
                </h3>

                <!-- Impact -->
                <p class="text-xs text-gray-400 leading-relaxed">
                  {{ highlight.impact }}
                </p>
              </div>

              <!-- Overlay Text (not blurred, appears on hover) -->
              <div
                class="absolute inset-0 flex flex-col items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0"
              >
                <span
                  class="text-white font-display font-semibold text-lg mb-2"
                >
                  View Details
                </span>
                <svg
                  class="w-6 h-6 text-white transform transition-transform duration-500 group-hover:translate-y-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </NuxtLink>
        </section>
      </div>

      <!-- Timeline with Context -->
      <section class="w-full">
        <div
          class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10"
        >
          <div class="mb-6">
            <h3 class="text-xl font-display text-white mb-2">The Journey</h3>
            <p class="text-sm text-gray-400">
              Each step taught me something new. Some lessons cost bugs, some
              cost sleepless nights. All worth it.
            </p>
          </div>

          <UTimeline
            color="neutral"
            size="sm"
            orientation="horizontal"
            :default-value="4"
            :items="items"
            class="w-full overflow-x-auto"
          />

          <!-- Call to Action -->
          <div
            class="mt-8 pt-6 border-t border-white/10 flex justify-between items-center"
          >
            <p class="text-sm text-gray-400">
              Want the full story? Let's talk.
            </p>
            <NuxtLink
              to="mailto:your@email.com"
              class="px-4 py-2 bg-white text-black rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
            >
              Get in Touch
            </NuxtLink>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
