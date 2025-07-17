<script setup lang="ts">
import ProjectCard from "~/components/project/projectCard.vue";
</script>

<template>
  <div class="items-center justify-center w-full grid md:grid-cols-3 gap-4">
    <div
      class="flex justify-center items-center h-full md:col-span-1 col-span-full select-none"
    >
      <div class="w-full md:px-12">
        <span>プロジェクト</span>
        <div class="flex gap-4">
          <USeparator />
          <span>Project</span>
        </div>
      </div>
    </div>
    <div
      class="flex justify-center items-center h-full md:col-span-2 col-span-full"
    >
      <ProjectCard />
    </div>
  </div>
</template>
