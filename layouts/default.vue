<script setup lang="ts">
import { ref, computed } from "vue";
import Menu from "~/components/menu.vue";

const isOpen = ref(false);
const isHovered = ref(false);

function handleClick() {
  isOpen.value = !isOpen.value;
}

const buttonVariant = computed(() => (isHovered.value ? "solid" : "outline"));
</script>

<template>
  <div class="container mx-auto min-h-screen flex flex-col py-8">
    <nav class="flex justify-between px-6">
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

    <Menu v-if="isOpen" class="flex flex-1" @close="isOpen = false" />

    <main v-if="!isOpen" class="flex-1 flex">
      <slot />
    </main>
  </div>
</template>
