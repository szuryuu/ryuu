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
    <div class="absolute inset-0 bg-[#2E2E2E] -z-10"></div>

    <div
      class="not-motion-reduce:animate-glitch pointer-events-none fixed -inset-24 z-50 bg-[url('/texture.png')] bg-repeat opacity-[0.08] mix-blend-overlay"
      aria-hidden="true"
    ></div>

    <nav
      class="fixed top-0 left-0 right-0 flex justify-between px-12 py-8 z-10"
    >
      <h1 class="text-3xl font-display select-none">Szuryuu</h1>
      <UButton
        color="neutral"
        :variant="buttonVariant"
        class="rounded-3xl font-display text-xs px-4 uppercase border-1 hover:text-black duration-400 transition-all transform transform-fill"
        @click="handleClick"
        @mouseover="isHovered = true"
        @mouseleave="isHovered = false"
      >
        {{ isOpen ? "Close" : "Menu" }} 🞄
      </UButton>
    </nav>

    <div class="flex flex-col flex-1">
      <div class="container mx-auto flex flex-col flex-1">
        <Menu v-if="isOpen" class="flex-1 flex" @close="isOpen = false" />
        <main v-if="!isOpen" class="flex-1 flex px-6 overflow-hidden">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>
