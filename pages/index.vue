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
  <main class="container mx-auto p-6">
    <ContentRenderer
      v-if="home"
      :value="home"
      class="prose prose-lg text-white"
    />
    <div v-else class="text-red-500">Home not found</div>
  </main>
</template>
