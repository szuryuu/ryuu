<script setup lang="ts">
import { skillIcons, skillUrl } from "@/utils/skills";
import { certificateArray } from "@/utils/certificates";
import LinkButton from "@/components/LinkButton.vue";
</script>

<template>
  <ClientOnly>
    <div class="h-auto z-20">
      <div class="grid grid-rows-3 gap-4">
        <div class="row-span-2 items-center flex h-full">
          <Vue3Marquee :pause-on-hover="true" :duration="7">
            <UCard
              v-for="certificate in certificateArray"
              :key="certificate.id"
              class="ml-4 w-72 bg-primary border-2 border-accent"
            >
              <div class="flex flex-col gap-2">
                <img
                  :src="certificate.Image"
                  class="w-full h-40 object-cover"
                />
                <div>
                  <h1 class="text-lg font-display font-semibold">
                    {{ certificate.title }}
                  </h1>
                  <p class="line-clamp-2 text-xs font-display">
                    {{ certificate.description }}
                  </p>
                </div>
              </div>

              <div class="flex justify-between pt-2">
                <LinkButton
                  to="#"
                  aria-label="View Certificate"
                  class="flex gap-2"
                >
                  view
                </LinkButton>
                <UBadge class="bg-accent text-white font-display">{{
                  certificate.skill
                }}</UBadge>
              </div>
            </UCard>
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
