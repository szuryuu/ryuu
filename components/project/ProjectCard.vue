<script setup lang="ts">
import LinkButton from "~/components/LinkButton.vue";

defineProps<{
  project: {
    name: string;
    type: string;
    year: string;
    path: string;
    image?: string;
    projectDetailUrl: string;
    liveDemoUrl?: string;
    githubUrl?: string;
  };
}>();
</script>

<template>
  <UCard
    variant="soft"
    class="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/30 hover:shadow-2xl hover:shadow-white/5 overflow-hidden text-white"
  >
    <!-- Image -->
    <div class="flex justify-between">
      <USeparator
        orientation="vertical"
        color="secondary"
        type="solid"
        class="h-48"
      />

      <NuxtImg
        :src="project.image"
        alt="Project Image"
        class="w-48 h-auto px-2"
        height="180"
        width="180"
        loading="lazy"
      />

      <div
        class="flex justify-between items-center h-48 [writing-mode:vertical-lr]"
      >
        <span class="uppercase text-xs">{{ project.type }}</span>
        <span class="text-xs">{{ project.year }}</span>
      </div>
    </div>

    <!-- Detail -->
    <div class="flex flex-col justify-between items-center mt-8 gap-4">
      <NuxtLink :to="project.path">
        {{ project.name }}
      </NuxtLink>
      <div class="flex justify-between w-full gap-1">
        <LinkButton
          v-if="project.liveDemoUrl"
          :to="project.liveDemoUrl"
          aria-label="Open Live Demo"
          class="flex gap-2 items-center justify-center w-full"
          target="_blank"
        >
          Live Demo
        </LinkButton>
        <LinkButton
          v-if="project.githubUrl"
          :to="project.githubUrl"
          aria-label="Open GitHub"
          class="flex gap-2 items-center justify-center w-full"
          target="_blank"
        >
          <UIcon name="i-custom-github2" class="size-3" /> Repo
        </LinkButton>
      </div>
    </div>
  </UCard>
</template>
