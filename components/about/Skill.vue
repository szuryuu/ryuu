<script setup lang="ts">
import LinkButton from "@/components/LinkButton.vue";

const skillIcons = [
  "js",
  "typescript",
  "react",
  "vue",
  "svelte",
  "nuxtjs",
  "tailwindcss",
  "nodejs",
  "php",
  "laravel",
  "python",
  "go",
  "mysql",
  "sqlite",
  "git",
  "npm",
  "bun",
  "linux",
  "docker",
];

const skillUrl = `https://skillicons.dev/icons`;

const certificateArray = [
  {
    id: 1,
    Image: "https://picsum.photos/200/200",
    title: "Certificate Title",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    skill: "Skill Name",
  },
];
</script>

<template>
  <client-only>
    <div class="h-auto z-20">
      <div class="grid grid-rows-3 gap-4">
        <div class="row-span-2 items-center flex h-full py-2">
          <Vue3Marquee :pause-on-hover="true" :duration="7">
            <UCard
              v-for="certificate in certificateArray"
              :key="certificate.id"
              class="ml-4 w-72"
            >
              <div class="flex flex-col gap-2">
                <img
                  :src="certificate.Image"
                  class="w-full h-40 object-cover"
                />
                <div>
                  <h1>{{ certificate.title }}</h1>
                  <p class="line-clamp-2">
                    {{ certificate.description }}
                  </p>
                </div>
              </div>
              <template #footer>
                <div class="flex justify-between">
                  <LinkButton
                    to="#"
                    aria-label="View Certificate"
                    class="flex gap-2"
                  >
                    view
                  </LinkButton>
                  <UBadge>{{ certificate.skill }}</UBadge>
                </div>
              </template>
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
  </client-only>
</template>
