<script setup lang="ts">
const route = useRoute();
const { data: project } = await useAsyncData(
  `project-${route.params.slug}`,
  () =>
    queryCollection("content").path(`/project/${route.params.slug}`).first(),
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
  <ContentRenderer v-if="project" :value="project" />
</template>
