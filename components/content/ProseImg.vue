<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  src: { type: String, default: "" },
  alt: { type: String, default: "" },
  width: { type: [String, Number], default: undefined },
  height: { type: [String, Number], default: undefined },
});

const isOpen = ref(false);
</script>

<template>
  <div class="my-8">
    <img
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      class="cursor-zoom-in transition-opacity hover:opacity-80 rounded-lg w-full"
      @click="isOpen = true"
    />

    <Teleport to="body">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md cursor-zoom-out p-4 md:p-12"
        @click="isOpen = false"
      >
        <img
          :src="src"
          :alt="alt"
          class="max-w-full max-h-full object-contain rounded-md shadow-2xl"
        />
        <div
          class="absolute bottom-6 text-white/50 text-xs font-display tracking-widest uppercase pointer-events-none"
        >
          Click anywhere to close
        </div>
      </div>
    </Teleport>
  </div>
</template>
