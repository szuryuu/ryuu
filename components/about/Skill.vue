<script setup lang="ts">
import {
  fullStackSkills,
  devOpsSkills,
  cyberSecuritySkills,
  skillUrl,
} from "@/utils/skills";
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
        <div class="row-span-2 items-center flex h-full">
          <Vue3Marquee :pause-on-hover="true" :duration="7">
            <CertificateCard />
          </Vue3Marquee>
        </div>
        <div class="row-span-1 flex items-center">
          <Vue3Marquee :duration="10" :direction="'reverse'">
            <img
              v-for="skill in skillIcons"
              :key="skill"
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
