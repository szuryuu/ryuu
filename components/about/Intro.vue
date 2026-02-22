<script setup lang="ts"></script>

<template>
  <div class="h-full z-20 flex items-center max-w-7xl w-full px-4">
    <div class="w-full space-y-12">
      <!-- NAME & ROLE SECTION -->
      <section class="grid grid-cols-1 gap-8 lg:gap-12 items-center">
        <div class="space-y-6">
          <!-- Indicator -->
          <div class="flex items-center gap-4">
            <div class="h-px flex-1 bg-white/10"></div>
            <span class="text-6xl font-display text-white/10 font-bold"
              >01</span
            >
          </div>

          <!-- Text Reveal -->
          <h1 class="text-reveal font-display uppercase group cursor-pointer">
            <span class="text-gradient-base"
              >Shafwan<br />Ilham<br />Dzaky</span
            >
            <span class="text-reveal-overlay"
              >Shafwan<br />Ilham<br />Dzaky</span
            >
          </h1>

          <!-- Meta info -->
          <div class="space-y-2 pl-1">
            <p class="font-decoration text-white/30">開発者</p>
            <p
              class="text-xs text-white/40 max-w-xs font-display leading-relaxed"
            >
              Software & DevOps Engineer. Bridging the gap between full-stack
              development, automated infrastructure, and security-first
              architecture.
            </p>

            <!-- Status -->
            <div class="flex items-center gap-2 pt-2">
              <span
                class="w-2 h-2 bg-green-400 rounded-full animate-pulse"
              ></span>
              <span
                class="text-xs text-green-400 uppercase tracking-wider font-display"
                >Available for work</span
              >
            </div>

            <!-- CTA -->
            <NuxtLink
              to="/project"
              class="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-white hover:text-white/60 transition-colors duration-300 font-display pt-4 group/link"
              aria-label="View projects"
            >
              <span
                class="border-b border-white group-hover/link:border-white/60"
                >View Work</span
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
