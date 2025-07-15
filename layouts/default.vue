<script setup lang="ts">
import { ref } from "vue";

const isOpen = ref(false);

function handleClick() {
  isOpen.value = !isOpen.value;
}
</script>

<template>
  <div class="container mx-auto min-h-screen flex flex-col py-8">
    <nav class="flex justify-between px-6">
      <h1 class="text-4xl font-display">Szuryuu</h1>
      <UButton
        color="neutral"
        variant="outline"
        class="rounded-3xl font-display text-xs px-4 uppercase border-1 hover:bg-gray-400 hover:text-white duration-300 transform transform-fill"
        @click="handleClick"
      >
        {{ isOpen ? "Close" : "Menu" }} 🞄
      </UButton>
    </nav>
    <slot />
  </div>
</template>
