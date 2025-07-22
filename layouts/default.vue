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
  <div class="min-h-screen flex flex-col">
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

    <div class="container mx-auto flex flex-col pt-24">
      <Menu v-if="isOpen" class="flex flex-1" @close="isOpen = false" />
      <main v-if="!isOpen" class="flex-1 flex px-6">
        <slot />
      </main>
    </div>
  </div>
</template>
