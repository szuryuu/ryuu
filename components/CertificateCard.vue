<script setup lang="ts">
import LinkButton from "@/components/LinkButton.vue";

defineProps<{
  certificate: {
    id: number;
    Image: string;
    title: string;
    description: string;
    skill: string;
  };
}>();
</script>

<template>
  <UCard class="w-56 md:w-72 max-h-[320px] bg-primary border-2 border-accent">
    <div class="flex flex-col gap-2">
      <NuxtImg
        :src="certificate.Image"
        class="w-full h-40 object-cover"
        width="288"
        height="160"
        format="webp"
        loading="lazy"
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
