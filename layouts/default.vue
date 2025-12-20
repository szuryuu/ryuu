<script setup lang="ts">
import { ref, computed } from "vue";
import Menu from "~/components/Menu.vue";

const isOpen = ref(false);
const isHovered = ref(false);

function handleClick() {
  isOpen.value = !isOpen.value;
}

const buttonVariant = computed(() => (isHovered.value ? "solid" : "outline"));
</script>

<template>
  <div class="min-h-screen flex flex-col relative overflow-hidden">
    <!-- Move to Css -->
    <!--
    <div class="absolute inset-0 bg-primary -z-10"></div>

    <div
      class="not-motion-reduce:animate-glitch pointer-events-none fixed -inset-24 z-50 bg-[url('/texture.png')] bg-repeat opacity-[0.08] mix-blend-overlay"
      aria-hidden="true"
    ></div>
    -->

    <nav
      class="fixed top-0 left-0 right-0 flex justify-between px-6 md:px-12 py-8 z-10"
    >
      <h1 class="text-3xl font-display select-none text-white">Sz</h1>
      <UButton
        color="neutral"
        :variant="buttonVariant"
        class="rounded-3xl font-display text-xs px-4 pt-2 md:py-2 flex justify-center items-center uppercase border-1 text-white hover:text-black duration-400 transition-all transform transform-fill bg-primary hover:bg-white cursor-pointer"
        @click="handleClick"
        @mouseover="isHovered = true"
        @mouseleave="isHovered = false"
      >
        {{ isOpen ? "Close" : "Menu" }}
        <p class="hidden md:flex">&#x1F784;</p>
      </UButton>
    </nav>

    <div class="flex flex-col flex-1">
      <Menu v-if="isOpen" class="flex-1 flex" @close="isOpen = false" />
      <main v-if="!isOpen" class="flex-1 flex px-6 md:px-12 overflow-hidden">
        <slot />
      </main>
    </div>
  </div>
</template>
