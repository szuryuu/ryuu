<script setup lang="ts">
import { onMounted } from "vue";
import {
  fullStackSkills,
  devOpsSkills,
  cyberSecuritySkills,
  skillUrl,
} from "@/utils/skills";
import { certificateArray } from "@/utils/certificates";
import CertificateCard from "../CertificateCard.vue";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

const skillIcons = [
  ...fullStackSkills,
  ...devOpsSkills,
  ...cyberSecuritySkills,
];

gsap.registerPlugin(ScrollTrigger);

onMounted(() => {
  const textElements = gsap.utils.toArray<HTMLElement>(".text");

  textElements.forEach((text) => {
    gsap.to(text, {
      backgroundSize: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: text,
        start: "center 80%",
        end: "center 20%",
        scrub: true,
      },
    });
  });
});
</script>

<template>
  <ClientOnly>
    <div class="h-auto z-20">
      <div class="grid grid-rows-3 gap-4">
        <div class="row-span-2 items-center flex h-full w-full">
          <div class="w-full">
            <h1 class="text font-display uppercase">
              Certifications<span>WOAH</span>
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

            Slider or Something
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

<style>
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

span {
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

.text:hover > span {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
}
</style>
