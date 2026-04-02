<script setup lang="ts">
import { Experience, Intro, Skill } from "@/components/about";
import { usePageEnter } from "~/composables/usePageEnter";
import { useScrollSpy } from "~/composables/useScrollSpy";

const pageRef = usePageEnter({ y: 20, duration: 0.6 });

const { activeId } = useScrollSpy(["intro", "journey", "skill"]);
</script>

<template>
  <div
    class="w-full min-h-screen flex flex-col lg:flex-row pt-24 gap-8 max-w-7xl mx-auto"
    ref="pageRef"
  >
    <aside class="w-full hidden lg:block">
      <div class="flex items-start flex-col justify-between fixed">
        <div class="flex items-start text-white">
          <span class="[writing-mode:vertical-lr] text-2xl font-decoration">
            私について
          </span>
          <span class="[writing-mode:vertical-lr] text-lg font-display"
            >About</span
          >
        </div>

        <nav class="hidden lg:flex flex-col gap-4 mt-12 text-sm font-display">
          <a
            href="#intro"
            class="transition-colors flex items-center gap-3 group uppercase tracking-widest"
            :class="
              activeId === 'intro'
                ? 'text-white'
                : 'text-white/40 hover:text-white'
            "
          >
            <span
              class="h-px transition-all duration-300"
              :class="
                activeId === 'intro'
                  ? 'w-12 bg-white'
                  : 'w-8 bg-white/20 group-hover:w-12'
              "
            ></span>
            Introduction
          </a>
          <a
            href="#journey"
            class="transition-colors flex items-center gap-3 group uppercase tracking-widest"
            :class="
              activeId === 'journey'
                ? 'text-white'
                : 'text-white/40 hover:text-white'
            "
          >
            <span
              class="h-px transition-all duration-300"
              :class="
                activeId === 'journey'
                  ? 'w-12 bg-white'
                  : 'w-8 bg-white/20 group-hover:w-12'
              "
            ></span>
            Journey
          </a>
          <a
            href="#skill"
            class="transition-colors flex items-center gap-3 group uppercase tracking-widest"
            :class="
              activeId === 'skill'
                ? 'text-white'
                : 'text-white/40 hover:text-white'
            "
          >
            <span
              class="h-px transition-all duration-300"
              :class="
                activeId === 'skill'
                  ? 'w-12 bg-white'
                  : 'w-8 bg-white/20 group-hover:w-12'
              "
            ></span>
            Skill
          </a>
        </nav>
      </div>
    </aside>

    <main class="w-full lg:min-w-5xl max-w-5xl space-y-12 pb-32 mx-auto">
      <section id="intro" class="relative group">
        <div
          class="absolute -left-4 top-0 bottom-0 w-px bg-white/10 origin-top scale-y-0 transition-transform group-hover:scale-y-100 duration-500"
        ></div>
        <h2
          class="text-xs font-display text-white/40 uppercase tracking-widest mb-12 pl-4"
        >
          01 / Introduction
        </h2>
        <Intro />
      </section>

      <section id="journey" class="relative group">
        <div
          class="absolute -left-4 top-0 bottom-0 w-px bg-white/10 origin-top scale-y-0 transition-transform group-hover:scale-y-100 duration-500"
        ></div>
        <h2
          class="text-xs font-display text-white/40 uppercase tracking-widest mb-12 pl-4"
        >
          02 / Journey
        </h2>
        <Experience />
      </section>

      <section id="skill" class="relative group">
        <div
          class="absolute -left-4 top-0 bottom-0 w-px bg-white/10 origin-top scale-y-0 transition-transform group-hover:scale-y-100 duration-500"
        ></div>
        <h2
          class="text-xs font-display text-white/40 uppercase tracking-widest mb-12 pl-4"
        >
          03 / Skill
        </h2>
        <Skill />
      </section>
    </main>
  </div>
</template>
