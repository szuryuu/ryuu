<script setup lang="ts">
import LinkButton from "~/components/LinkButton.vue";

const route = useRoute();
const { data: project } = await useAsyncData(
  `project-${route.params.slug}`,
  () =>
    queryCollection("projects").path(`/project/${route.params.slug}`).first(),
);

if (!project.value) {
  throw createError({ statusCode: 404, message: "Project not found" });
}

useSeoMeta({
  title: project.value.title,
  description: project.value.description,
  ogImage: project.value.image,
});
</script>

<template>
  <article v-if="project" class="w-full min-h-screen relative">
    <header class="relative flex mb-10 gap-8">
      <div class="absolute inset-0 -z-10">
        <img
          v-if="project.image"
          :src="project.image"
          :alt="project.title"
          class="hero-image w-full h-full object-cover opacity-30"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-primary via-primary/90 to-transparent"
        ></div>
      </div>
      <div class="w-full max-w-7xl mx-auto px-6 md:px-12 pb-20 pt-32">
        <div class="flex items-center gap-4 mb-8">
          <span class="font-decoration text-2xl md:text-3xl text-white/60">
            プロジェクト
          </span>
          <div
            class="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"
          ></div>
        </div>

        <!-- Title -->
        <h1
          class="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-tight"
        >
          {{ project.title }}
        </h1>

        <!-- Description -->
        <p
          class="text-xl md:text-2xl text-white/80 max-w-3xl mb-12 font-display"
        >
          {{ project.description }}
        </p>

        <!-- Info -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-if="project.type" class="hero-meta">
            <p class="text-xs uppercase font-display text-white/50 mb-1">
              Type
            </p>
            <p class="text-lg font-display text-white">{{ project.type }}</p>
          </div>
          <div v-if="project.year" class="hero-meta">
            <p class="text-xs uppercase font-display text-white/50 mb-1">
              Year
            </p>
            <p class="text-lg font-display text-white">{{ project.year }}</p>
          </div>
          <div v-if="project.role" class="hero-meta">
            <p class="text-xs uppercase font-display text-white/50 mb-1">
              Role
            </p>
            <p class="text-lg font-display text-white">{{ project.role }}</p>
          </div>
          <div v-if="project.status" class="hero-meta">
            <p class="text-xs uppercase font-display text-white/50 mb-1">
              Status
            </p>
            <span
              class="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-full text-sm font-display text-white backdrop-blur-sm"
            >
              {{ project.status }}
            </span>
          </div>
        </div>
      </div>
    </header>

    <!-- Tech Stack & Links Section -->
    <section
      class="content-section sticky top-0 z-10 bg-primary/95 backdrop-blur-md border-b border-white/10"
    >
      <div class="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <!-- Tech Stack -->
          <div class="flex-1">
            <p class="text-xs uppercase font-display text-white/50 mb-3">
              Tech Stack
            </p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tech in project.tech"
                :key="tech"
                class="px-3 py-1.5 bg-accent/50 border border-white/10 text-white text-sm font-display rounded-md hover:bg-accent transition-colors duration-300"
              >
                {{ tech }}
              </span>
            </div>
          </div>

          <!-- Action Links -->
          <div class="flex gap-3">
            <LinkButton
              v-if="project.github"
              :to="project.github"
              aria-label="View GitHub Repository"
              class="flex items-center gap-2"
            >
              <LucideGithub :size="14" />
              <span class="font-display">Repository</span>
            </LinkButton>
            <LinkButton
              v-if="project.live"
              :to="project.live"
              aria-label="View Live Demo"
              target="_blank"
              class="flex items-center gap-2"
            >
              <LucideExternalLink :size="14" />
              <span class="font-display">Live Demo</span>
            </LinkButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Another Info -->
    <section
      v-if="project.duration || project.team_size"
      class="content-section max-w-7xl mx-auto px-6 md:px-12 py-16"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-if="project.duration"
          class="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/5"
        >
          <div class="flex items-center gap-3 mb-2">
            <LucideClock :size="20" class="text-white/50" />
            <p class="text-xs uppercase font-display text-white/50">Duration</p>
          </div>
          <p class="text-2xl font-display text-white">{{ project.duration }}</p>
        </div>

        <div
          v-if="project.team_size"
          class="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/5"
        >
          <div class="flex items-center gap-3 mb-2">
            <LucideUsers :size="20" class="text-white/50" />
            <p class="text-xs uppercase font-display text-white/50">
              Team Size
            </p>
          </div>
          <p class="text-2xl font-display text-white">
            {{ project.team_size }} members
          </p>
        </div>

        <div
          class="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/5"
        >
          <div class="flex items-center gap-3 mb-2">
            <LucideCalendar :size="20" class="text-white/50" />
            <p class="text-xs uppercase font-display text-white/50">
              Published
            </p>
          </div>
          <p class="text-2xl font-display text-white">{{ project.year }}</p>
        </div>
      </div>
    </section>

    <!-- Content -->
    <section class="max-w-7xl mx-auto px-6 md:px-12 pb-16 pt-8">
      <div class="max-w-none text-white prose prose-lg prose-invert">
        <ContentRenderer class="text-white" :value="project" />
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-6 md:px-12 pb-16">
      <LinkButton
        to="/project"
        aria-label="Back to Projects"
        class="flex items-center gap-2 group"
      >
        <LucideArrowLeft
          :size="14"
          class="group-hover:-translate-x-1 transition-transform"
        />
        <span class="font-display">Back to Projects</span>
      </LinkButton>
    </section>
  </article>
</template>
