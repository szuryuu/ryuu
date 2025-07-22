<script setup lang="ts">
import Hero from "~/components/Hero.vue";

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
  <div class="items-end flex">
    <div
      class="py-2 justify-between items-end grid grid-cols-1 md:grid-cols-3 select-none"
    >
      <div class="md:col-span-2">
        <h5 class="pl-2 py-4 uppercase font-display text-xs">
          full stack developer / cyber security
        </h5>
        <h1 class="text-8xl font-display">Szuryu Ryujin</h1>
      </div>
      <div
        class="text-xs overflow-hidden font-display md:col-span-1 md:block hidden text-right py-4"
      >
        Full Stack Developer and Cyber Security Engineer dedicated to building
        secure, high-performing software solutions with a strong emphasis on
        functionality and reliability.
      </div>
    </div>
  </div>
</template>
