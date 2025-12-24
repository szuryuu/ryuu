<script setup lang="ts"></script>

<template>
  <div class="h-full z-20 flex items-center max-w-7xl w-full px-4">
    <div class="w-full space-y-24">
      <!-- CERTIFICATIONS SECTION -->
      <section
        class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
      >
        <!-- Left -->
        <div class="space-y-6">
          <!-- Number indicator -->
          <div class="flex items-center gap-4">
            <span class="text-6xl font-display text-white/10 font-bold"
              >00</span
            >
            <div class="h-px flex-1 bg-white/10"></div>
          </div>

          <!-- Reveal -->
          <h2 class="text-reveal font-display uppercase group cursor-pointer">
            <span class="text-gradient-base text-8xl"
              >Certifi-<br />cations</span
            >
            <span class="text-reveal-overlay text-8xl"
              >Certifi<br />cations</span
            >
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
              <LucideChevronRight
                class="w-3 h-3 group-hover/link:translate-x-1 transition-transform"
              />
            </NuxtLink>
          </div>
        </div>

        <div class="space-y-6 lg:text-right">
          <!-- Number indicator -->
          <div class="flex lg:flex-row-reverse items-center gap-4">
            <span class="text-6xl font-display text-white/10 font-bold"
              >00</span
            >
            <div class="h-px flex-1 bg-white/10"></div>
          </div>

          <!-- Reveal -->
          <h2
            class="text-reveal font-display uppercase group cursor-pointer lg:text-right"
          >
            <span class="text-gradient-base text-8xl">Tech<br />Stack</span>
            <span class="text-reveal-overlay text-8xl">Tech<br />Stack</span>
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
              <LucideChevronRight
                class="w-3 h-3 group-hover/link:translate-x-1 transition-transform"
              />
            </NuxtLink>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
