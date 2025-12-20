<script setup lang="ts">
import { Experience, Intro, Skill } from "@/components/about";
</script>

<template>
  <div class="w-full flex-1">
    <section class="min-h-screen flex items-center justify-center py-20">
      <Intro />
    </section>
    <section class="min-h-screen flex items-center justify-center py-20">
      <Experience />
    </section>
    <section class="min-h-screen flex items-center justify-center py-20">
      <Skill />
    </section>
  </div>
</template>
