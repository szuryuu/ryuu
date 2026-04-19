<script setup lang="ts">
const { data: githubData } = await useLazyAsyncData("github-commits", () =>
  $fetch("/api/github/commits"),
);
</script>

<template>
  <div
    class="min-h-[100svh] w-full flex flex-col justify-center items-center relative overflow-hidden px-6"
  >
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px] bg-primary/20 blur-[80px] md:blur-[120px] rounded-full pointer-events-none transform-gpu will-change-transform"
    ></div>

    <div class="z-10 flex flex-col items-center justify-center w-full">
      <div
        class="text-xs md:text-sm font-display text-white/50 tracking-widest uppercase mb-6 flex flex-col items-center gap-2"
      >
        <span class="text-center">Shafwan Ilham Dzaky</span>
      </div>

      <div class="relative w-full max-w-4xl mx-auto flex flex-col items-center">
        <h1
          class="text-5xl sm:text-6xl md:text-8xl lg:text-[120px] font-display font-bold text-center leading-[0.9] tracking-tighter w-full"
        >
          <div class="overflow-hidden">
            <span class="block text-white">INFRA</span>
          </div>
          <div
            class="overflow-hidden flex items-center justify-center gap-3 md:gap-4"
          >
            <span class="block text-white/40 italic font-light">&</span>
            <span class="block text-white">SEC</span>
          </div>
        </h1>
      </div>

      <div
        class="mt-10 md:mt-12 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 text-center md:text-left w-full max-w-2xl mx-auto"
      >
        <div class="max-w-[280px]">
          <p class="text-sm font-display text-white/60 leading-relaxed">
            DevOps Engineer specializing in scalable infrastructure, automated
            deployments, and expanding expertise in security operations.
          </p>
        </div>

        <div class="h-px w-16 md:h-16 md:w-px bg-white/20 shrink-0"></div>

        <div class="flex items-center justify-center gap-6 shrink-0">
          <div class="flex flex-col items-center md:items-start gap-1">
            <span class="text-3xl font-display font-bold text-white">2+</span>
            <span class="text-[10px] uppercase tracking-widest text-white/40"
              >Years Exp</span
            >
          </div>
          <div class="flex flex-col items-center md:items-start gap-1">
            <span class="text-3xl font-display font-bold text-white">{{
              githubData?.totalCommits || "500+"
            }}</span>
            <span class="text-[10px] uppercase tracking-widest text-white/40"
              >Git Commits</span
            >
          </div>
        </div>
      </div>

      <div
        class="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
      >
        <NuxtLink
          to="/cv-2026.pdf"
          target="_blank"
          class="w-full sm:w-auto px-8 py-3 bg-white text-black font-display text-xs uppercase tracking-widest text-center hover:bg-white/90 transition-colors"
        >
          Download CV
        </NuxtLink>
        <NuxtLink
          to="/project"
          class="w-full sm:w-auto px-8 py-3 bg-transparent border border-white/20 text-white font-display text-xs uppercase tracking-widest text-center hover:bg-white/5 hover:border-white/40 transition-all"
        >
          View Projects
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
