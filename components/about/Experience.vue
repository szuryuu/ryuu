<script setup lang="ts">
import { computed } from "vue";
import { useTimeline } from "~/composables/useTimeline";
import { certificateArray } from "@/utils/certificates";

const { timeline } = useTimeline();
const certificates = certificateArray;

const items = computed(() => {
  return timeline.value.map((item) => ({
    ...item,
    title: item.title.toUpperCase(),
  }));
});

// Key milestones - SPECIFIC achievements
const highlights = [
  {
    year: "2024",
    achievement: "Built 5+ production apps",
    impact: "Serving 1000+ active users",
    icon: "🚀",
  },
  {
    year: "2023",
    achievement: `${certificates.length} Certifications`,
    impact: "Expanded knowledge base",
    icon: "💻",
  },
  {
    year: "2022",
    achievement: "2+ Years of Professional Experience",
    impact: "Developed a strong portfolio",
    icon: "🔐",
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
        <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="highlight in highlights"
            :key="highlight.year"
            class="relative bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:border-white/30 transition-all group cursor-pointer"
          >
            <div class="text-3xl mb-2">{{ highlight.icon }}</div>
            <div class="text-sm font-semibold text-white mt-1">
              {{ highlight.achievement }}
            </div>
            <div class="text-xs text-gray-400 mt-1">{{ highlight.impact }}</div>

            <!-- View More Overlay -->
            <div
              class="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span class="text-white font-semibold">View More</span>
            </div>
          </div>
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
