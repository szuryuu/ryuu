<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  code: { type: String, default: "" },
  language: { type: String, default: "" },
  filename: { type: String, default: null },
  highlights: { type: Array as () => number[], default: () => [] },
  meta: { type: String, default: null },
  class: { type: String, default: null },
});

const copied = ref(false);

const copy = async () => {
  await navigator.clipboard.writeText(props.code);
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
};
</script>

<template>
  <div class="relative group my-5">
    <div
      v-if="filename"
      class="bg-black/40 px-4 py-2 text-xs font-display text-white/50 border-b border-white/5 rounded-t-lg"
    >
      {{ filename }}
    </div>
    <pre
      :class="[$props.class, filename ? 'mt-0 rounded-t-none' : '']"
    ><slot /></pre>
    <button
      @click="copy"
      class="absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 text-xs font-display text-white backdrop-blur-sm"
    >
      {{ copied ? "Copied" : "Copy" }}
    </button>
  </div>
</template>
