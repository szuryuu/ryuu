<script setup lang="ts">
import LinkButton from "~/components/LinkButton.vue";

defineProps<{
  project: {
    name: string;
    type: string;
    year: string;
    liveDemoUrl: string;
    githubUrl: string;
  };
}>();
</script>

<template>
  <UCard variant="soft" class="bg-primary border-[#383838] border-2">
    <div class="flex gap-2">
      <div class="flex gap-6">
        <USeparator orientation="vertical" color="secondary" type="solid" />
        <img
          src="https://picsum.photos/200/300"
          alt="Project Image"
          class="w-40 h-45"
        />
      </div>
      <div class="flex justify-between items-center [writing-mode:vertical-lr]">
        <span class="uppercase text-xs">{{ project.type }}</span>
        <span class="text-xs">{{ project.year }}</span>
      </div>
    </div>

    <div class="flex justify-between items-center mt-8">
      <div class="">{{ project.name }}</div>
      <div class="flex gap-1">
        <LinkButton :to="project.liveDemoUrl" aria-label="Open Live Demo">
          Live Demo
        </LinkButton>
        <LinkButton :to="project.githubUrl" aria-label="Open GitHub">
          <LucideGithub :size="10" />
        </LinkButton>
      </div>
    </div>
  </UCard>
</template>
