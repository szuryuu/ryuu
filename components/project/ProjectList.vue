<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";
import ProjectCard from "./ProjectCard.vue";

const { data: projects } = await useAsyncData("projects", () =>
  queryCollection("projects").order("title", "ASC").all(),
);

if (!projects.value || projects.value.length === 0) {
  console.warn("No projects found. Add content to /content/project/");
}

const projectContainer = ref(null);
let observer: IntersectionObserver | null = null;

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
    <div v-if="!projects || projects.length === 0" class="text-center p-12">
      <p class="text-gray-400">No projects yet. Time to build something.</p>
    </div>

    <ProjectCard
      v-for="project in projects"
      :key="project.id"
      :project="{
        name: project.title,
        type: project.type,
        year: project.year,
        slug: project.slug,
        image: project.image,
        projectDetailUrl: `/project/${project.slug}`,
        liveDemoUrl: project.live || '#',
        githubUrl: project.github || '#',
      }"
      class="project-card"
    />
  </div>
</template>
