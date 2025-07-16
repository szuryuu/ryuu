<script setup lang="ts">
import Hero from "~/components/hero.vue";

const { data: home } = await useAsyncData(() =>
  queryCollection("content").path("/").first(),
);

useSeoMeta({
  title: home.value?.title,
  description: home.value?.description,
});
</script>

<template>
  <Hero />
  <main class="px-6 flex-1 items-end flex">
    <!-- <ContentRenderer
      v-if="home"
      :value="home"
      class="prose prose-lg text-white"
    />
    <div v-else class="text-red-500">Home not found</div> -->

    <div
      class="py-2 justify-between w-full items-end grid grid-cols-1 md:grid-cols-3"
    >
      <div class="md:col-span-2">
        <h5 class="pl-2 py-4 uppercase font-display text-xs">
          full stack developer / cyber security / devops
        </h5>
        <h1 class="text-9xl font-display">Szuryu Ryujin</h1>
      </div>
      <div
        class="text-xs overflow-hidden font-display md:col-span-1 md:block hidden text-right py-4"
      >
        Full Stack Developer, Cyber Security Engineer, and DevOps Practitioner
        focused on creating optimal software solutions that balance
        functionality with user experience.
      </div>
    </div>
  </main>
</template>
