<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";
import ProjectCard from "./ProjectCard.vue";

const projectContainer = ref(null);
let observer: IntersectionObserver | null = null;

const projectList = {
  projects: [
    {
      id: 1,
      name: "Project 1",
      type: "Team Project",
      year: "2025",
      projectDetailUrl: "#",
      liveDemoUrl: "#",
      githubUrl: "#",
    },
    {
      id: 2,
      name: "Project 2",
      type: "Solo Project",
      year: "2025",
      projectDetailUrl: "#",
      liveDemoUrl: "#",
      githubUrl: "#",
    },
    {
      id: 3,
      name: "Project 3",
      type: "Solo Project",
      year: "2025",
      projectDetailUrl: "#",
      liveDemoUrl: "#",
      githubUrl: "#",
    },
    {
      id: 4,
      name: "Project 4",
      type: "Solo Project",
      year: "2025",
      projectDetailUrl: "#",
      liveDemoUrl: "#",
      githubUrl: "#",
    },
    {
      id: 5,
      name: "Project 5",
      type: "Team Project",
      year: "2025",
      projectDetailUrl: "#",
      liveDemoUrl: "#",
      githubUrl: "#",
    },
    {
      id: 6,
      name: "Project 6",
      type: "Team Project",
      year: "2025",
      projectDetailUrl: "#",
      liveDemoUrl: "#",
      githubUrl: "#",
    },
  ],
};

onMounted(() => {
  const cards = document.querySelectorAll(".project-card");

  gsap.set(cards, {
    autoAlpha: 0,
    x: 100,
    y: 100,
  });

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const index = Array.from(cards).indexOf(entry.target as Element);

        if (entry.isIntersecting) {
          // Animate in
          gsap.to(entry.target, {
            autoAlpha: 1,
            x: 0,
            y: 0,
            duration: 0.6,
            delay: index * 0.1,
            ease: "power2.out",
          });
        }
      });
    },
    {
      threshold: 0.2, // Trigger area
      rootMargin: "0px", // Margin trigger area
    },
  );

  // Observe all cards
  cards.forEach((card) => {
    observer?.observe(card);
  });
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>

<template>
  <div ref="projectContainer" class="flex space-x-12 min-w-max">
    <ProjectCard
      v-for="project in projectList.projects"
      :key="project.id"
      :project="project"
      class="project-card"
    />
  </div>
</template>
