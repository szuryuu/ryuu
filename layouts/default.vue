<script setup lang="ts">
const isMenuOpen = ref(false);
const isHovered = ref(false);

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

const buttonVariant = computed(() => (isHovered.value ? "solid" : "outline"));
</script>

<template>
  <div class="min-h-[100svh] flex flex-col relative overflow-x-clip">
    <nav
      class="fixed top-0 left-0 right-0 flex justify-between px-6 md:px-12 py-8 z-10"
      aria-label="Site header"
    >
      <h1 class="text-3xl font-display select-none text-white">Sz</h1>
      <UButton
        color="neutral"
        :variant="buttonVariant"
        class="rounded-3xl font-display text-xs px-4 pt-2 md:py-2 flex justify-center items-center uppercase border-1 text-white hover:text-black duration-400 transition-all transform transform-fill bg-primary hover:bg-white cursor-pointer"
        :aria-expanded="isMenuOpen"
        aria-controls="site-navigation"
        :aria-label="isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'"
        @click="toggleMenu"
        @mouseover="isHovered = true"
        @mouseleave="isHovered = false"
      >
        {{ isMenuOpen ? "Close" : "Menu" }}
        <p class="hidden md:flex" aria-hidden="true">&#x1F784;</p>
      </UButton>
    </nav>

    <div class="flex flex-col flex-1">
      <Menu
        v-if="isMenuOpen"
        id="site-navigation"
        class="flex-1 flex"
        @close="isMenuOpen = false"
      />
      <main v-if="!isMenuOpen" class="flex-1 flex px-6 md:px-12">
        <slot />
      </main>
    </div>
  </div>
</template>
