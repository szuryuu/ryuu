<script setup lang="ts">
const emit = defineEmits(["close"]);
import { navigationItems } from "~/utils/navigations";
import { useMediaQuery } from "@vueuse/core";

const isDesktop = useMediaQuery("(min-width: 768px)");

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
        class="w-full hover:pl-8 duration-300 group"
      >
        <NuxtLink
          :to="item.to"
          class="flex items-center gap-8 p-4 rounded-lg transition-colors duration-200 hover:text-gray-400 w-full"
          @click="closeMenu"
        >
          <span
            class="text-2xl transition-opacity duration-300 flex"
            :class="
              isDesktop ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
            "
          >
            <LucideMoveRight class="w-6 h-6" />
          </span>
          <div class="flex-1 flex justify-between items-center space-x-4">
            <span class="text-2xl font-decoration break-keep">{{
              item.japanese
            }}</span>
            <USeparator color="secondary" />
            <span class="uppercase text-xs font-display">{{ item.label }}</span>
          </div>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
