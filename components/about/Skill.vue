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
    <div class="grid grid-rows-3 gap-4 w-full">
      <!-- Certifications Row -->
      <div
        class="row-span-2 items-center flex flex-col md:flex-row h-full w-full gap-4"
      >
        <div class="w-full md:w-auto">
          <h2 class="text font-display text-primary uppercase">
            Certifications
            <NuxtLink
              to="/about/skill"
              class="cursor-pointer text-reveal-overlay"
              aria-label="View all certifications"
            >
              See More
            </NuxtLink>
          </h2>
        </div>

        <!-- Mobile: Simple Grid -->
        <div class="md:hidden w-full grid grid-cols-3 gap-2">
          <NuxtImg
            v-for="(image, index) in images.slice(0, 6)"
            :key="index"
            :src="image"
            class="w-full aspect-square object-cover rounded-lg"
            alt="certificate"
            width="120"
            height="120"
            format="webp"
            loading="lazy"
          />
        </div>

        <!-- Desktop: Marquee -->
        <div
          class="hidden md:block w-full overflow-hidden relative rounded-2xl bg-transparent"
        >
          <Vue3Marquee :duration="14" :clone="true" :pause-on-hover="true">
            <NuxtImg
              v-for="(image, index) in images"
              :key="index"
              :src="image"
              class="h-40 mx-1 shrink-0 rounded-2xl"
              alt="certificate"
              height="160"
              width="160"
              format="webp"
              loading="lazy"
            />
          </Vue3Marquee>
          <div
            class="absolute inset-0 bg-gradient-to-r from-primary from-0% via-transparent via-50% to-primary to-100% z-10 pointer-events-none"
          ></div>
        </div>
      </div>

      <!-- Tech Stack Row -->
      <div
        class="row-span-1 flex flex-col md:flex-row items-center gap-4 md:gap-8"
      >
        <!-- Mobile: Simple Grid -->
        <div class="md:hidden w-full grid grid-cols-6 gap-2">
          <img
            v-for="(skill, index) in skillIcons.slice(0, 12)"
            :key="index"
            :src="`${skillUrl}?i=${skill}`"
            :alt="skill"
            class="w-full h-auto"
            width="60"
            height="60"
            loading="lazy"
          />
        </div>

        <!-- Desktop: Marquee -->
        <div
          class="hidden md:block w-full overflow-hidden relative rounded-2xl bg-transparent"
        >
          <Vue3Marquee
            :duration="20"
            direction="reverse"
            :clone="true"
            :pause-on-hover="true"
          >
            <img
              v-for="(skill, index) in skillIcons"
              :key="index"
              :src="`${skillUrl}?i=${skill}`"
              :alt="skill"
              class="h-20 mx-1"
              width="80"
              height="80"
              loading="lazy"
            />
          </Vue3Marquee>
          <div
            class="absolute inset-0 bg-gradient-to-r from-primary from-0% via-transparent via-50% to-primary to-100% z-10 pointer-events-none"
          ></div>
        </div>

        <div class="w-full md:w-auto">
          <h2
            class="text items-end text-center md:text-end font-display uppercase"
          >
            tech stack
            <NuxtLink
              to="/about/skill"
              class="cursor-pointer text-reveal-overlay"
              aria-label="View all tech stack"
            >
              See More
            </NuxtLink>
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text {
  font-size: clamp(1.5rem, 5vw, 3rem);
  letter-spacing: -0.01em;
  line-height: 100%;
  margin: 0;
  width: 100%;
  color: rgb(182, 182, 182, 0.2);
  background: linear-gradient(to right, #b6b6b6, #b6b6b6) no-repeat;
  -webkit-background-clip: text;
  background-clip: text;
  background-size: 0%;
  transition: background-size cubic-bezier(0.1, 0.5, 0.5, 1) 0.5s;
  border-bottom: 1px solid #2f2b28;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.text-reveal-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: white;
  color: #505050;
  clip-path: polygon(0 50%, 100% 50%, 100% 50%, 0 50%);
  transform-origin: center;
  transition: all cubic-bezier(0.1, 0.5, 0.5, 1) 0.4s;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.text:hover .text-reveal-overlay {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
}

/* Prevent pointer events on gradient overlay */
.pointer-events-none {
  pointer-events: none;
}
</style>
