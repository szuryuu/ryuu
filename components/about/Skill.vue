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
  <ClientOnly>
    <div class="h-full z-20 flex items-center max-w-6xl w-full">
      <div class="grid grid-rows-3 gap-4">
        <div
          class="row-span-2 items-center flex flex-col md:flex-row h-full w-full gap-4"
        >
          <div class="w-full">
            <h1 class="text font-display text-primary uppercase">
              Certifications
              <NuxtLink
                to="/about/skill"
                class="cursor-pointer text-reveal-overlay"
              >
                See More
              </NuxtLink>
            </h1>
          </div>
          <div
            class="w-full overflow-hidden relative rounded-2xl bg-transparent"
          >
            <Vue3Marquee :duration="14" :clone="true">
              <NuxtImg
                v-for="(image, index) in images"
                :key="index"
                :src="image"
                class="h-40 mx-1 shrink-0 rounded-2xl cursor-none"
                alt="certificate"
                height="160"
                width="160"
                format="webp"
                loading="lazy"
              />
            </Vue3Marquee>
            <div
              class="absolute inset-0 bg-gradient-to-r from-primary from-0% via-transparent via-50% to-primary to-100% z-10"
            ></div>
          </div>
        </div>
        <div class="row-span-1 flex items-center gap-8">
          <div
            class="w-full overflow-hidden relative rounded-2xl bg-transparent"
          >
            <Vue3Marquee :duration="20" :direction="'reverse'" :clone="true">
              <img
                v-for="(skill, index) in skillIcons"
                :key="index"
                :src="`${skillUrl}?i=${skill}`"
                :alt="skill"
                class="h-20 mx-1"
                height="80"
                width="80"
                loading="eager"
              />
            </Vue3Marquee>
            <div
              class="absolute inset-0 bg-gradient-to-r from-primary from-0% via-transparent via-50% to-primary to-100% z-10"
            ></div>
          </div>
          <div class="w-full">
            <h1 class="text items-end text-end font-display uppercase">
              tech stack
              <NuxtLink
                to="/about/skill"
                class="cursor-pointer text-reveal-overlay"
              >
                See More
              </NuxtLink>
            </h1>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped>
/* Text */
.text {
  font-size: 5vw;
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
</style>
