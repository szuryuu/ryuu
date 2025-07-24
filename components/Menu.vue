<script setup lang="ts">
const emit = defineEmits(["close"]);

const navigationItems = [
  {
    to: "/",
    label: "Home",
    japanese: "ホーム",
  },
  {
    to: "/about",
    label: "About",
    japanese: "について",
  },
  {
    to: "/project",
    label: "Project",
    japanese: "プロジェクト",
  },
  {
    to: "/contact",
    label: "Contact",
    japanese: "コンタクト",
  },
];

function closeMenu() {
  emit("close");
}
</script>

<template>
  <nav role="navigation" class="px-6">
    <ul class="w-full flex-1 flex flex-col justify-center items-center p-8">
      <li
        v-for="item in navigationItems"
        :key="item.to"
        class="w-full hover:pl-8 duration-300"
      >
        <NuxtLink
          :to="item.to"
          class="flex items-center gap-8 p-4 rounded-lg transition-colors duration-200 hover:text-gray-400 w-full"
          @click="closeMenu"
        >
          <span class="text-2xl">🞄</span>
          <div class="flex-1 flex justify-between items-center space-x-4">
            <span class="text-2xl font-decoration break-keep">{{
              item.japanese
            }}</span>
            <USeparator :ui="{ border: 'border-white' }" />
            <span class="uppercase text-xs font-display">{{ item.label }}</span>
          </div>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
