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
  return timeline.value.slice(0, 3).map((item) => ({
    title: item.title.toUpperCase(),
    description: item.description,
    date: item.date,
  }));
});

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
    link: "/about/timeline",
  },
];
</script>

<template>
  <div
    class="flex w-full h-full justify-center items-center max-w-7xl mx-auto px-4"
  >
    <div class="w-full space-y-12">
      <section class="grid grid-cols-1 gap-8 lg:gap-12 items-center">
        <div class="space-y-6">
          <div class="flex items-center gap-4">
            <div class="h-px flex-1 bg-white/10"></div>
            <span class="text-6xl font-display text-white/10 font-bold"
              >02</span
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
              Architecting solutions, securing networks, and shipping scalable
              applications.
            </p>
          </div>
        </div>
      </section>

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
            <div
              class="absolute top-4 right-4 text-4xl font-display text-white/5 font-bold"
            >
              {{ String(index + 1).padStart(2, "0") }}
            </div>

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

              <div
                class="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <LucideChevronRight
                  class="w-5 h-5 text-white group-hover:translate-x-1 transition-transform"
                />
              </div>
            </div>
          </div>
        </NuxtLink>
      </section>

      <section class="w-full">
        <div class="flex items-center gap-4 mb-8">
          <div class="h-px flex-1 bg-white/10"></div>
          <span
            class="text-xs uppercase tracking-wider text-white/30 font-display"
            >Recent Activity</span
          >
        </div>

        <div
          class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10"
        >
          <div
            class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4"
          >
            <div>
              <h3 class="text-2xl font-display font-bold text-white mb-2">
                Active Branches
              </h3>
              <p class="text-sm text-white/40 font-display">
                Recent milestones driving my technical growth.
              </p>
            </div>
            <NuxtLink
              to="/about/timeline"
              class="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-xs font-display text-white transition-colors"
            >
              View Full Git Log
              <LucideChevronRight class="w-4 h-4" />
            </NuxtLink>
          </div>

          <UTimeline
            color="neutral"
            size="sm"
            orientation="horizontal"
            :items="items"
            class="w-full overflow-x-auto"
          />

          <div class="mt-8 pt-6 border-t border-white/10">
            <div
              class="flex flex-col md:flex-row md:justify-between md:items-center gap-4"
            >
              <div>
                <p class="text-sm text-white/60 font-display mb-1">
                  Ready to collaborate?
                </p>
                <p class="text-xs text-white/40 font-display">
                  Let's engineer solutions together.
                </p>
              </div>

              <div class="flex gap-3">
                <NuxtLink
                  to="mailto:ilhamdzaky2007@gmail.com"
                  class="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg text-xs md:text-sm font-display font-semibold hover:bg-white/90 transition-colors"
                >
                  Get in Touch
                  <LucideChevronRight class="w-4 h-4" />
                </NuxtLink>

                <NuxtLink
                  to="/cv.pdf"
                  target="_blank"
                  class="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white rounded-lg text-xs md:text-sm font-display hover:bg-white/10 transition-colors"
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
