<script setup lang="ts">
import {
  fullStackSkills,
  devOpsSkills,
  cyberSecuritySkills,
  skillUrl,
} from "@/utils/skills";
import { certificateArray } from "@/utils/certificates";
import CertificateCard from "../CertificateCard.vue";

const skillIcons = [
  ...fullStackSkills,
  ...devOpsSkills,
  ...cyberSecuritySkills,
];
</script>

<template>
  <ClientOnly>
    <div class="h-auto z-20">
      <div class="grid grid-rows-3 gap-4">
        <div class="row-span-2 items-center flex h-full w-full">
          <div class="w-full">
            <h1 class="text font-display uppercase">
              Certifications
              <NuxtLink
                to="/about/skill"
                class="cursor-pointer text-reveal-overlay"
              >
                See More
              </NuxtLink>
            </h1>
          </div>
          <div class="w-full">
            <!-- <Vue3Marquee :pause-on-hover="true" :duration="25">
              <CertificateCard
                v-for="(cert, index) in certificateArray"
                :key="index"
                :certificate="cert"
                class="mx-4"
              />
            </Vue3Marquee> -->

            <!-- <UCarousel
              v-slot="{ item }"
              :items="certificateArray"
              :ui="{
                item: 'basis-full md:basis-1/2 lg:basis-1/3',
                container: 'gap-4',
              }"
              class="rounded-lg overflow-hidden"
              arrows
            >
              <CertificateCard :certificate="item" />
            </UCarousel> -->
          </div>
        </div>
        <div class="row-span-1 flex items-center">
          <Vue3Marquee :duration="20" :direction="'reverse'" :clone="true">
            <img
              v-for="(skill, index) in skillIcons"
              :key="index"
              :src="`${skillUrl}?i=${skill}`"
              :alt="skill"
              class="w-18 h-18 mx-1"
            />
          </Vue3Marquee>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped>
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
  align-items: flex-start;
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
