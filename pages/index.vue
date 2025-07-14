<script setup lang="ts">
const { data: home } = await useAsyncData(() =>
  queryCollection("content").path("/").first(),
);

useSeoMeta({
  title: home.value?.title,
  description: home.value?.description,
});
</script>

<template>
  <header class="bg-gray-800 text-white p-4">
    <h1 class="text-3xl font-bold">My Website</h1>
  </header>

  <main class="container mx-auto p-6">
    <ContentRenderer v-if="home" :value="home" class="prose prose-lg" />
    <div v-else class="text-red-500">Home not found</div>
  </main>
</template>
