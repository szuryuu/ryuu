<script setup lang="ts">
import type { GuestEntry } from "~/types/guestbook";

defineProps<{
  entries: GuestEntry[];
  isLoading: boolean;
  fetchError: string | null;
}>();

function formatEntryDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
</script>

<template>
  <div>
    <div v-if="isLoading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="h-14 rounded-lg bg-white/5 animate-pulse"></div>
    </div>

    <div
      v-else-if="fetchError"
      class="py-12 text-center border border-white/5 rounded-xl"
    >
      <p class="text-xs font-display text-red-400/70">{{ fetchError }}</p>
    </div>

    <div
      v-else-if="entries.length === 0"
      class="py-12 text-center border border-white/5 rounded-xl"
    >
      <p class="font-decoration text-white/20 text-xl mb-1">まだ誰もいない</p>
      <p class="text-xs font-display text-white/25">Be the first to sign.</p>
    </div>

    <div v-else class="flex flex-col">
      <div
        v-for="entry in entries"
        :key="entry.id"
        class="group/entry flex items-start gap-4 py-5 border-b border-white/8 hover:border-white/15 transition-colors"
      >
        <NuxtImg
          v-if="entry.avatar_url"
          :src="entry.avatar_url"
          :alt="entry.name"
          class="w-8 h-8 rounded-full bg-white/10 border border-white/15 shrink-0 mt-0.5 object-cover"
          width="32"
          height="32"
          format="webp"
          loading="lazy"
        />
        <div
          v-else
          class="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-xs font-display text-white/60 shrink-0 mt-0.5 uppercase"
          aria-hidden="true"
        >
          {{ entry.name.charAt(0) }}
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-baseline gap-3 mb-1">
            <span class="text-sm font-display font-semibold text-white">{{ entry.name }}</span>
            <time
              :datetime="entry.created_at"
              class="text-[11px] font-display text-white/25"
            >
              {{ formatEntryDate(entry.created_at) }}
            </time>
          </div>
          <p class="text-sm text-white/55 font-display leading-relaxed">{{ entry.message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
