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
        <div class="row-span-2 items-center flex h-full">
          <Vue3Marquee :pause-on-hover="true" :duration="25">
            <CertificateCard
              v-for="(cert, index) in certificateArray"
              :key="index"
              :certificate="cert"
              class="mx-4"
            />
          </Vue3Marquee>
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
