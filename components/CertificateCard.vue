<script setup lang="ts">
defineProps<{
  certificate: {
    id: number;
    Image: string;
    title: string;
    description: string;
    skill: string;
    pinned?: boolean;
    url?: string;
  };
}>();
</script>

<template>
  <div
    class="flex flex-col bg-white/5 border backdrop-blur-sm transition-all duration-500 rounded-xl overflow-hidden group/card"
    :class="
      certificate.pinned
        ? 'border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.05)]'
        : 'border-white/10 hover:border-white/20'
    "
  >
    <div class="relative overflow-hidden">
      <NuxtImg
        :src="certificate.Image"
        class="w-full h-48 object-cover transition-transform duration-700 group-hover/card:scale-105"
        width="400"
        height="300"
        format="webp"
        loading="lazy"
      />
      <div
        v-if="certificate.pinned"
        class="absolute top-3 right-3 bg-black/80 backdrop-blur-md border border-white/20 text-white text-[10px] uppercase px-2 py-1 rounded font-display tracking-widest flex items-center gap-1.5 shadow-lg"
      >
        <LucidePin class="w-3 h-3 text-white fill-white/20" />
        Pinned
      </div>
    </div>

    <div class="p-5 flex flex-col flex-1">
      <h3
        class="text-lg font-display font-semibold text-white leading-tight mb-2"
      >
        {{ certificate.title }}
      </h3>
      <p class="text-xs text-white/50 font-display line-clamp-3 mb-6 flex-1">
        {{ certificate.description }}
      </p>

      <div
        class="flex items-center justify-between mt-auto pt-4 border-t border-white/10"
      >
        <a
          :href="certificate.url || '#'"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs font-display text-white/70 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors"
        >
          Verify
          <LucideExternalLink class="w-3 h-3" />
        </a>
        <span
          class="text-[10px] font-display text-white/40 uppercase tracking-widest border border-white/10 px-2 py-1 rounded bg-white/5"
        >
          {{ certificate.skill }}
        </span>
      </div>
    </div>
  </div>
</template>
