<script setup lang="ts">
import LinkButton from "~/components/LinkButton.vue";

defineProps<{
  project: {
    name: string;
    type: string;
    year: string;
    slug: string;
    image?: string;
    projectDetailUrl: string;
    liveDemoUrl?: string;
    githubUrl?: string;
  };
}>();
</script>

<template>
  <UCard variant="soft" class="bg-primary border-accent border-2">
    <div class="flex gap-2">
      <div class="flex gap-6">
        <USeparator orientation="vertical" color="secondary" type="solid" />
        <img
          src="https://picsum.photos/200/300"
          alt="Project Image"
          class="w-40 h-45"
        />
      </div>
      <div
        class="flex justify-between items-center h-45 [writing-mode:vertical-lr]"
      >
        <span class="uppercase text-xs">{{ project.type }}</span>
        <span class="text-xs">{{ project.year }}</span>
      </div>
    </div>

    <div class="flex flex-col justify-between items-center mt-8 gap-4">
      <NuxtLink :to="`/project/${project.slug}`">
        {{ project.name }}
      </NuxtLink>
      <div class="flex justify-between w-full gap-1">
        <LinkButton
          v-if="project.liveDemoUrl"
          :to="project.liveDemoUrl"
          aria-label="Open Live Demo"
          class="flex gap-2 items-center justify-center"
          :class="project.githubUrl ? '' : 'w-full'"
        >
          Live Demo
        </LinkButton>
        <LinkButton
          v-if="project.githubUrl"
          :to="project.githubUrl"
          aria-label="Open GitHub"
          class="flex gap-2 items-center justify-center"
          :class="project.liveDemoUrl ? '' : 'w-full'"
        >
          <LucideGithub :size="10" /> Repo
        </LinkButton>
      </div>
    </div>
  </UCard>
</template>
