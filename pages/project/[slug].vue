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
  <article v-if="project" class="max-w-5xl mx-auto pb-20 pt-28 px-4">
    <header class="flex mb-10 gap-8">
      <img
        v-if="project.image"
        :src="project.image"
        :alt="project.title"
        class="rounded-xl shadow-lg w-full object-cover max-h-[400px]"
      />
      <div class="flex flex-col justify-center">
        <h1 class="text-4xl font-bold mb-4">{{ project.title }}</h1>
        <p class="text-xl text-gray-600 mb-6">{{ project.description }}</p>
      </div>
    </header>

    <section
      class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 p-6 bg-white rounded-lg border"
    >
      <div v-if="project.role">
        <h3 class="font-semibold text-xs text-gray-500 uppercase">Role</h3>
        <p class="text-gray-900 font-medium">{{ project.role }}</p>
      </div>
      <div v-if="project.year">
        <h3 class="font-semibold text-xs text-gray-500 uppercase">Year</h3>
        <p class="text-gray-900 font-medium">{{ project.year }}</p>
      </div>
      <div v-if="project.team_size">
        <h3 class="font-semibold text-xs text-gray-500 uppercase">Team Size</h3>
        <p class="text-gray-900 font-medium">{{ project.team_size }} people</p>
      </div>
      <div v-if="project.status">
        <h3 class="font-semibold text-xs text-gray-500 uppercase">Status</h3>
        <span
          class="px-2 py-1 bg-green-100 text-gray-800 text-xs font-medium rounded-full"
        >
          {{ project.status }}
        </span>
      </div>
    </section>

    <section
      class="flex flex-col md:flex-row justify-between items-center mb-12 gap-6"
    >
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tech in project.tech"
          :key="tech"
          class="px-3 py-1 bg-gray-800 text-white text-sm rounded-md"
        >
          {{ tech }}
        </span>
      </div>

      <div class="flex gap-4">
        <LinkButton
          v-if="project.github"
          :href="project.github"
          target="_blank"
          class="flex items-center gap-2 font-medium hover:underline"
        >
          <LucideGithub :size="10" /> Repo
        </LinkButton>
        <LinkButton
          v-if="project.live"
          :href="project.live"
          target="_blank"
          class="flex items-center gap-2 font-medium hover:underline"
        >
          Live Demo
        </LinkButton>
      </div>
    </section>

    <div class="max-w-none text-white prose prose-lg prose-invert">
      <ContentRenderer class="text-white" :value="project" />
    </div>
  </article>
</template>
