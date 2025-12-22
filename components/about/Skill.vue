<script setup lang="ts">
import {
  fullStackSkills,
  devOpsSkills,
  cyberSecuritySkills,
  skillUrl,
} from "@/utils/skills";
import { certificateArray } from "@/utils/certificates";

const skillIcons = [
  ...fullStackSkills,
  ...devOpsSkills,
  ...cyberSecuritySkills,
];

const images = certificateArray.map((c) => c.Image);
</script>

<template>
  <div class="h-full z-20 flex items-center max-w-7xl w-full px-4">
    <div class="w-full space-y-24">
      <!-- CERTIFICATIONS SECTION -->
      <section
        class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
      >
        <!-- Left -->
        <div class="lg:col-span-5 space-y-6">
          <!-- Number indicator -->
          <div class="flex items-center gap-4">
            <span class="text-6xl font-display text-white/10 font-bold"
              >01</span
            >
            <div class="h-px flex-1 bg-white/10"></div>
          </div>

          <!-- Reveal -->
          <h2 class="text-reveal font-display uppercase group cursor-pointer">
            <span class="text-gradient-base">Certifi-<br />cations</span>
            <span class="text-reveal-overlay">Certifi<br />cations</span>
          </h2>

          <!-- Meta info -->
          <div class="space-y-2 pl-1">
            <p class="font-decoration text-white/30">証明書</p>
            <p
              class="text-xs text-white/40 max-w-xs font-display leading-relaxed"
            >
              Professional credentials spanning full-stack development, DevOps
              automation, and security engineering.
            </p>

            <!-- CTA -->
            <NuxtLink
              to="/about/skill"
              class="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-white hover:text-white/60 transition-colors duration-300 font-display pt-4 group/link"
              aria-label="View all certifications"
            >
              <span
                class="border-b border-white group-hover/link:border-white/60"
                >View All</span
              >
              <svg
                class="w-3 h-3 group-hover/link:translate-x-1 transition-transform"
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
          </div>
        </div>

        <!-- Right -->
        <div class="lg:col-span-7 relative">
          <div
            class="grid grid-cols-3 pl-4 gap-4 border-l-2 border-white/20 lg:border-r-2 lg:border-l-0 lg:pr-4"
          >
            <NuxtImg
              v-for="(image, index) in images.slice(0, 6)"
              :key="index"
              :src="image"
              class="w-full h-auto rounded-2xl border-white/10 md:w-56"
              alt="certificate"
              width="60"
              height="60"
              format="webp"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <!-- TECH STACK SECTION -->
      <section
        class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
      >
        <!-- Left -->
        <div class="lg:col-span-7 lg:order-2 relative">
          <div class="grid grid-cols-6 gap-2 border-r-2 border-white/20 pr-4">
            <img
              v-for="(skill, index) in skillIcons.slice(0, 12)"
              :key="index"
              :src="`${skillUrl}?i=${skill}`"
              :alt="skill"
              class="w-full h-auto opacity-80"
              width="56"
              height="56"
              loading="lazy"
            />
          </div>
        </div>

        <!-- Right -->
        <div class="lg:col-span-5 lg:order-1 space-y-6 lg:text-right">
          <!-- Number indicator -->
          <div class="flex lg:flex-row-reverse items-center gap-4">
            <span class="text-6xl font-display text-white/10 font-bold"
              >02</span
            >
            <div class="h-px flex-1 bg-white/10"></div>
          </div>

          <!-- Reveal -->
          <h2
            class="text-reveal font-display uppercase group cursor-pointer lg:text-right"
          >
            <span class="text-gradient-base">Tech<br />Stack</span>
            <span class="text-reveal-overlay">Tech<br />Stack</span>
          </h2>

          <!-- Meta info -->
          <div class="space-y-2 pr-1 lg:flex lg:flex-col lg:items-end">
            <p class="font-decoration text-white/30">技術スタック</p>
            <p
              class="text-xs text-white/40 max-w-xs font-display leading-relaxed lg:text-right"
            >
              Battle-tested tools and frameworks proven in production
              environments under real load.
            </p>

            <!-- CTA -->
            <NuxtLink
              to="/about/skill"
              class="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-white hover:text-white/60 transition-colors duration-300 font-display pt-4 group/link"
              aria-label="View all tech stack"
            >
              <span
                class="border-b border-white group-hover/link:border-white/60"
                >Explore</span
              >
              <svg
                class="w-3 h-3 group-hover/link:translate-x-1 transition-transform"
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
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.text-reveal {
  font-size: clamp(3.5rem, 9vw, 8rem);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 0.85;
  position: relative;
  display: inline-block;
  padding: 0.5rem 0;
}

.text-gradient-base {
  display: block;
  color: rgba(182, 182, 182, 0.08);
  background: linear-gradient(to right, #b6b6b6 0%, #b6b6b6 0%) no-repeat;
  -webkit-background-clip: text;
  background-clip: text;
  background-size: 0%;
  transition: background-size cubic-bezier(0.1, 0.5, 0.5, 1) 0.8s;
}

.text-reveal:hover .text-gradient-base {
  background-size: 100%;
}

.text-reveal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ffffff;
  color: #0a0a0a;
  clip-path: polygon(0 50%, 100% 50%, 100% 50%, 0 50%);
  transform-origin: center;
  transition: all cubic-bezier(0.1, 0.5, 0.5, 1) 0.65s;
  display: flex;
  align-items: center;
  justify-content: inherit;
  font-weight: 900;
}

.text-reveal:hover .text-reveal-overlay {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}

@media (max-width: 768px) {
  .text-reveal {
    font-size: clamp(2.5rem, 12vw, 5rem);
    line-height: 0.9;
  }
}
</style>
