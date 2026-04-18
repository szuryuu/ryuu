<script setup lang="ts">
const emit = defineEmits(["close"]);

function closeMenu() {
  emit("close");
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") closeMenu();
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <nav
    role="navigation"
    aria-label="Site navigation"
    class="px-6 max-w-7xl w-full mx-auto"
  >
    <ul class="w-full flex-1 flex flex-col justify-center items-center p-8" role="list">
      <li
        v-for="item in navigationItems"
        :key="item.to"
        class="w-full hover:pl-8 duration-300 group"
        role="listitem"
      >
        <NuxtLink
          :to="item.to"
          class="flex items-center gap-8 p-4 rounded-lg transition-colors duration-200 text-white hover:text-gray-400 w-full"
          @click="closeMenu"
        >
          <span
            class="text-2xl transition-opacity duration-300 flex opacity-100 md:opacity-0 md:group-hover:opacity-100"
            aria-hidden="true"
          >
            <LucideMoveRight class="w-6 h-6" />
          </span>

          <div class="flex-1 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <span class="text-2xl font-decoration break-keep">{{ item.japanese }}</span>

            <div class="flex w-full gap-4">
              <USeparator color="secondary" />
              <span class="uppercase text-xs font-display">{{ item.label }}</span>
            </div>
          </div>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
