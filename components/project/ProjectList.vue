<script setup lang="ts">
import gsap from "gsap";

const { data: projects } = await useAsyncData("projects", () =>
  queryCollection("projects").order("order", "ASC").all(),
);

const projectContainer = ref(null);
let cardObserver: IntersectionObserver | null = null;

onMounted(() => {
  const cards = document.querySelectorAll(".project-card");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion) {
    gsap.set(cards, { autoAlpha: 1, x: 0, y: 0 });
    return;
  }

  cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = Array.from(cards).indexOf(entry.target as Element);
        gsap.to(entry.target, {
          autoAlpha: 1,
          x: 0,
          y: 0,
          duration: 0.6,
          delay: index * 0.1,
          ease: "power2.out",
        });
        cardObserver?.unobserve(entry.target);
      });
    },
    { threshold: 0.2, rootMargin: "0px" },
  );

  cards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const isAlreadyVisible = rect.top < window.innerHeight;
    if (isAlreadyVisible) {
      gsap.set(card, { autoAlpha: 1, x: 0, y: 0 });
    } else {
      gsap.set(card, { autoAlpha: 0, x: 100, y: 100 });
      cardObserver?.observe(card);
    }
  });
});

onUnmounted(() => {
  cardObserver?.disconnect();
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
        path: `/project/${project.slug}`,
        image: project.image,
        liveDemoUrl: project.live || '',
        githubUrl: project.github || '',
      }"
      class="project-card"
    />
  </div>
</template>
