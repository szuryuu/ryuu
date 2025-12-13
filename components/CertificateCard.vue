<script setup lang="ts">
import { certificateArray } from "@/utils/certificates";
import LinkButton from "@/components/LinkButton.vue";
</script>

<template>
  <UCard
    v-for="certificate in certificateArray"
    :key="certificate.id"
    class="ml-4 w-72 bg-primary border-2 border-accent"
  >
    <div class="flex flex-col gap-2">
      <img :src="certificate.Image" class="w-full h-40 object-cover" />
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
        to="/about/skill"
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
</template>
