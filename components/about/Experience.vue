<!-- Experience.vue - Text Reveal Style -->
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

// Stats - make these specific
const stats = [
  {
    number: `${projects.value?.length ?? 0}+`,
    label: "Projects",
    sublabel: "Shipped to Production",
    link: "/project",
  },
  {
    number: `${certificates.length}+`,
    label: "Certifications",
    sublabel: "Full-Stack & Security",
    link: "/about/skill",
  },
  {
    number: "2+",
    label: "Years",
    sublabel: "Building & Learning",
    link: "/about#journey",
  },
];
</script>

<template>
  <div
    class="flex w-full h-full justify-center items-center max-w-7xl mx-auto px-4"
  >
    <div class="w-full space-y-12">
      <!-- HEADER SECTION -->
      <section class="grid grid-cols-1 gap-8 lg:gap-12 items-center">
        <div class="space-y-6">
          <div class="flex items-center gap-4">
            <div class="h-px flex-1 bg-white/10"></div>
            <span class="text-6xl font-display text-white/10 font-bold"
              >00</span
            >
          </div>

          <h2 class="text-reveal font-display uppercase group cursor-pointer">
            <span class="text-gradient-base">The<br />Journey</span>
            <span class="text-reveal-overlay">The<br />Journey</span>
          </h2>

          <div class="space-y-2 pl-1">
            <p class="font-decoration text-white/30">経験</p>
            <p
              class="text-xs text-white/40 max-w-xs font-display leading-relaxed"
            >
              From first "Hello World" to production deployments. Each step
              taught something new.
            </p>
          </div>
        </div>
      </section>

      <!-- STATS GRID -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NuxtLink
          v-for="(stat, index) in stats"
          :key="index"
          :to="stat.link"
          class="group relative overflow-hidden"
        >
          <div
            class="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-white/30 transition-all duration-500"
          >
            <!-- Number indicator -->
            <div
              class="absolute top-4 right-4 text-4xl font-display text-white/5 font-bold"
            >
              {{ String(index + 1).padStart(2, "0") }}
            </div>

            <!-- Content -->
            <div class="relative z-10">
              <div class="text-5xl font-display font-bold text-white mb-2">
                {{ stat.number }}
              </div>
              <div class="text-lg font-display text-white/80">
                {{ stat.label }}
              </div>
              <div class="text-xs text-white/40 mt-1 font-display">
                {{ stat.sublabel }}
              </div>

              <!-- Arrow indicator on hover -->
              <div
                class="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <svg
                  class="w-5 h-5 text-white group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </NuxtLink>
      </section>

      <!-- TIMELINE SECTION -->
      <section class="w-full">
        <div class="flex items-center gap-4 mb-8">
          <div class="h-px flex-1 bg-white/10"></div>
          <span
            class="text-xs uppercase tracking-wider text-white/30 font-display"
            >Timeline</span
          >
        </div>

        <div
          class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10"
        >
          <div class="mb-8">
            <h3 class="text-2xl font-display font-bold text-white mb-2">
              Career Path
            </h3>
            <p class="text-sm text-white/40 font-display">
              Each milestone represents growth, learning, and shipping code that
              matters.
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

          <!-- Footer CTA -->
          <div class="mt-8 pt-6 border-t border-white/10">
            <div
              class="flex flex-col md:flex-row md:justify-between md:items-center gap-4"
            >
              <div>
                <p class="text-sm text-white/60 font-display mb-1">
                  Want the full story?
                </p>
                <p class="text-xs text-white/40 font-display">
                  Let's talk about what we can build together.
                </p>
              </div>

              <div class="flex gap-3">
                <NuxtLink
                  to="mailto:your@email.com"
                  class="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg text-sm font-display font-semibold hover:bg-white/90 transition-colors"
                >
                  Get in Touch
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </NuxtLink>

                <NuxtLink
                  to="/cv.pdf"
                  target="_blank"
                  class="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white rounded-lg text-sm font-display hover:bg-white/10 transition-colors"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download CV
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
