<script setup lang="ts">
import ProjectCard from "./ProjectCard.vue";

const projectList = {
  projects: [
    {
      id: 1,
      name: "Project 1",
      type: "Team Project",
      year: "2025",
      liveDemoUrl: "#",
      githubUrl: "#",
    },
    {
      id: 2,
      name: "Project 2",
      type: "Solo Project",
      year: "2025",
      liveDemoUrl: "#",
      githubUrl: "#",
    },
    {
      id: 3,
      name: "Project 3",
      type: "Solo Project",
      year: "2025",
      liveDemoUrl: "#",
      githubUrl: "#",
    },
    {
      id: 4,
      name: "Project 4",
      type: "Solo Project",
      year: "2025",
      liveDemoUrl: "#",
      githubUrl: "#",
    },
    {
      id: 5,
      name: "Project 5",
      type: "Team Project",
      year: "2025",
      liveDemoUrl: "#",
      githubUrl: "#",
    },
    {
      id: 6,
      name: "Project 6",
      type: "Team Project",
      year: "2025",
      liveDemoUrl: "#",
      githubUrl: "#",
    },
  ],
};
</script>

<template>
  <div class="flex space-x-12 min-w-max">
    <ProjectCard
      v-for="project in projectList.projects"
      :key="project.id"
      :project="project"
    />
  </div>
</template>
