<script setup lang="ts">
import { useTimeline } from "~/composables/useTimeline";
const { timeline } = useTimeline();

const items = computed(() => {
  return timeline.value.map((item) => ({
    ...item,
    title: item.title.toUpperCase(),
  }));
});
</script>

<template>
  <div
    class="w-full min-h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth"
  >
    <section
      class="h-full snap-start snap-always flex items-center justify-center"
    >
      <div class="grid grid-cols-2 w-full items-center">
        <div class="justify-center flex items-center">
          <img
            src="https://picsum.photos/200"
            alt="Profile Picture"
            class="w-48 h-52"
          />
        </div>
        <div class="flex flex-col px-12">
          <h1 class="py-2 text-lg">
            I'm
            <NuxtLink to="/about" class="text-xl">Shafwan Ilham Dzaky</NuxtLink>
          </h1>
          <p class="text-justify text-sm">
            a Full Stack Developer with a strong interest in Cyber Security. I
            build secure, scalable, and user-friendly software — from frontend
            interfaces to backend systems. Currently, I’m deepening my knowledge
            in cybersecurity to complement my development skills, aiming to
            create solutions that are not just functional, but also resilient
            and secure.
          </p>
        </div>
      </div>
    </section>

    <section
      class="h-full snap-start snap-always flex items-center justify-center"
    >
      <div class="text-center max-w-2xl p-8">
        <UTimeline
          orientation="horizontal"
          :default-value="2"
          :items="items"
          class="w-full"
        />
      </div>
    </section>
  </div>
</template>
