<script setup lang="ts">
import { useTimeline } from "~/composables/useTimeline";
import { usePageEnter } from "~/composables/usePageEnter";

const { events } = useTimeline();
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
        A structured, non-linear visualization of my main trajectory and
        parallel technical tracks.
      </p>
    </div>

    <div class="relative w-full">
      <div
        v-for="event in events"
        :key="event.id"
        class="relative flex min-h-[140px] group"
      >
        <div class="relative w-24 shrink-0">
          <div class="absolute left-6 top-0 bottom-0 w-px bg-white/20"></div>

          <div
            v-if="!event.isMain && event.status === 'ongoing'"
            class="absolute left-[71px] top-0 bottom-1/2 w-px bg-gradient-to-t from-white/20 to-transparent"
          ></div>

          <svg
            v-if="!event.isMain"
            class="absolute top-1/2 left-6 w-12 h-1/2"
            viewBox="0 0 48 100"
            preserveAspectRatio="none"
          >
            <path
              d="M 0 100 C 0 50, 48 50, 48 0"
              fill="none"
              class="stroke-white/20"
              stroke-width="2"
              vector-effect="non-scaling-stroke"
            />
          </svg>

          <svg
            v-if="!event.isMain && event.status === 'merged'"
            class="absolute bottom-1/2 left-6 w-12 h-1/2"
            viewBox="0 0 48 100"
            preserveAspectRatio="none"
          >
            <path
              d="M 48 100 C 48 50, 0 50, 0 0"
              fill="none"
              class="stroke-white/20"
              stroke-width="2"
              vector-effect="non-scaling-stroke"
            />
          </svg>

          <div
            class="absolute w-4 h-4 rounded-full border-[3px] border-[#0a0a0a] z-10 top-1/2 -translate-y-1/2 transition-transform duration-300 group-hover:scale-125"
            :class="[
              event.color,
              event.isMain
                ? 'left-6 -translate-x-1/2'
                : 'left-[72px] -translate-x-1/2',
            ]"
          ></div>
        </div>

        <div class="flex-1 pb-12 pt-4 pr-4 md:pr-0">
          <div
            class="p-6 md:p-8 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-white/30 transition-all duration-300"
          >
            <div
              class="flex flex-col md:flex-row md:items-center gap-4 mb-2 pb-6 border-b border-white/10"
            >
              <div
                v-if="event.logo"
                class="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 p-2.5 bg-white/05"
              >
                <img
                  :src="event.logo"
                  :alt="event.title"
                  class="w-full h-full object-contain"
                />
              </div>
              <div class="flex-1">
                <div class="flex flex-wrap items-center gap-3 mb-1.5">
                  <h3 class="text-white font-display font-bold text-xl">
                    {{ event.title }}
                  </h3>

                  <span
                    v-if="event.status === 'merged'"
                    class="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] uppercase tracking-widest bg-sky-500/10 text-sky-400 rounded font-mono"
                  >
                    <LucideGitMerge class="w-3 h-3" />
                    Merged
                  </span>
                  <span
                    v-else-if="!event.isMain"
                    class="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] uppercase tracking-widest bg-emerald-500/10 text-emerald-400 rounded font-mono"
                  >
                    <LucideGitBranch class="w-3 h-3" />
                    Active Branch
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] uppercase tracking-widest bg-white/10 text-white/80 rounded font-mono"
                  >
                    <LucideGitCommit class="w-3 h-3" />
                    Main
                  </span>
                </div>
              </div>
            </div>

            <div class="mt-4 flex flex-col">
              <div
                v-for="(role, index) in event.roles"
                :key="index"
                class="relative pl-12 py-2 group/role"
              >
                <svg
                  class="absolute top-0 left-4 w-8 h-full -translate-x-px"
                  fill="none"
                >
                  <line
                    v-if="index !== event.roles.length - 1"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="100%"
                    class="stroke-white/10"
                    stroke-width="1.5"
                  />
                  <path
                    d="M 0 0 V 20 C 0 28, 8 28, 24 28"
                    class="stroke-white/20 group-hover/role:stroke-white/40 transition-colors duration-300"
                    stroke-width="1.5"
                  />
                </svg>

                <div
                  class="absolute left-[40px] top-[28px] w-2 h-2 rounded-full ring-4 ring-[#1a1a1a] -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 group-hover/role:scale-125"
                  :class="index === 0 ? event.color : 'bg-white/20'"
                ></div>

                <div
                  class="bg-white/[0.02] border border-white/5 rounded-xl p-5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300"
                >
                  <div class="flex flex-col gap-1 mb-2">
                    <span
                      class="text-white font-display font-semibold text-base"
                      >{{ role.title }}</span
                    >
                    <time
                      class="text-[11px] font-mono text-white/40 tracking-wider"
                      >{{ role.date }}</time
                    >
                  </div>
                  <p class="text-sm text-white/60 font-display leading-relaxed">
                    {{ role.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
