<script setup lang="ts">
import { useTimeline } from "~/composables/useTimeline";
import { usePageEnter } from "~/composables/usePageEnter";

const { timeline } = useTimeline();
const pageRef = usePageEnter({ y: 20, duration: 0.6 });
</script>

<template>
  <div ref="pageRef" class="min-h-screen pt-32 pb-24 max-w-4xl mx-auto px-4">
    <div class="mb-16">
      <NuxtLink
        to="/about"
        class="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white mb-8 transition-colors font-display"
      >
        <LucideArrowLeft class="w-4 h-4" />
        Back to About
      </NuxtLink>
      <h1 class="text-4xl font-display font-bold text-white mb-4">
        Git Log: Career Path
      </h1>
      <p class="text-white/40 font-display text-sm">
        A complete history of my experience, active branches, and shipped
        projects.
      </p>
    </div>

    <div
      class="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-white/10"
    >
      <div
        v-for="(item, index) in timeline"
        :key="index"
        class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
      >
        <div
          class="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-black text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"
        >
          <LucideGitCommit class="w-5 h-5" />
        </div>

        <div
          class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-white/30 transition-all duration-300"
        >
          <div class="flex flex-col gap-1 mb-3">
            <div class="flex flex-wrap items-center gap-3">
              <span class="text-white font-display font-bold">{{
                item.title
              }}</span>
              <span
                v-if="item.concurrent"
                class="px-2 py-0.5 text-[10px] uppercase tracking-widest bg-white/10 text-white/80 rounded font-mono"
              >
                Active Branch
              </span>
            </div>
            <time class="text-xs font-mono text-white/40">{{ item.date }}</time>
          </div>
          <p class="text-sm text-white/60 font-display leading-relaxed">
            {{ item.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
