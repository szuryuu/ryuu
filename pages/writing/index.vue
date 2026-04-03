<script setup lang="ts">
import { ref, computed } from "vue";
import { usePageEnter } from "~/composables/usePageEnter";
import { useScrollSpy } from "~/composables/useScrollSpy";

const pageRef = usePageEnter({ y: 20, duration: 0.6 });

const { activeId } = useScrollSpy(["overview", "articles"]);

const { data: articles } = await useAsyncData("writing", () =>
  queryCollection("writing").order("order", "ASC").all(),
);

const allTags = computed(() => {
  if (!articles.value) return [];
  const set = new Set<string>();
  articles.value.forEach((a) => a.tags?.forEach((t: string) => set.add(t)));
  return ["All", ...Array.from(set).sort()];
});

const selectedTag = ref("All");

const filtered = computed(() => {
  if (!articles.value) return [];
  let result = articles.value;

  if (selectedTag.value !== "All") {
    result = result.filter((a) => a.tags?.includes(selectedTag.value));
  }

  return result.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });
});

function readingTime(body: unknown): string {
  const text = JSON.stringify(body ?? "");
  const words = text.split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
</script>

<template>
  <div
    class="w-full min-h-[100svh] flex flex-col lg:flex-row pt-24 gap-8 max-w-7xl mx-auto"
    ref="pageRef"
  >
    <Circle
      class="!fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-25 -z-10"
    />

    <aside class="w-full hidden lg:block">
      <div class="flex items-start flex-col justify-between fixed">
        <div class="flex items-start text-white">
          <span class="[writing-mode:vertical-lr] text-2xl font-decoration"
            >書く</span
          >
          <span class="[writing-mode:vertical-lr] text-lg font-display"
            >Writing</span
          >
        </div>

        <nav class="hidden lg:flex flex-col gap-4 mt-12 text-sm font-display">
          <a
            href="#overview"
            class="transition-colors flex items-center gap-3 group uppercase tracking-widest"
            :class="
              activeId === 'overview'
                ? 'text-white'
                : 'text-white/40 hover:text-white'
            "
          >
            <span
              class="h-px transition-all duration-300"
              :class="
                activeId === 'overview'
                  ? 'w-12 bg-white'
                  : 'w-8 bg-white/20 group-hover:w-12'
              "
            ></span>
            Overview
          </a>
          <a
            href="#articles"
            class="transition-colors flex items-center gap-3 group uppercase tracking-widest"
            :class="
              activeId === 'articles'
                ? 'text-white'
                : 'text-white/40 hover:text-white'
            "
          >
            <span
              class="h-px transition-all duration-300"
              :class="
                activeId === 'articles'
                  ? 'w-12 bg-white'
                  : 'w-8 bg-white/20 group-hover:w-12'
              "
            ></span>
            Articles
          </a>
        </nav>
      </div>
    </aside>

    <main class="w-full lg:min-w-5xl max-w-5xl space-y-12 pb-32 mx-auto">
      <section id="overview" class="relative group">
        <div
          class="absolute -left-4 top-0 bottom-0 w-px bg-white/10 origin-top scale-y-0 transition-transform group-hover:scale-y-100 duration-500"
        ></div>
        <h2
          class="text-xs font-display text-white/40 uppercase tracking-widest mb-12 pl-4"
        >
          01 / Overview
        </h2>

        <div class="space-y-8">
          <div class="flex items-center gap-4">
            <div class="h-px flex-1 bg-white/10"></div>
            <span class="text-6xl font-display text-white/10 font-bold"
              >01</span
            >
          </div>

          <h1 class="text-reveal font-display uppercase group cursor-pointer">
            <span class="text-gradient-base">Article<br />Archive</span>
            <span class="text-reveal-overlay">Article<br />Archive</span>
          </h1>

          <div class="space-y-2 pl-1">
            <p class="font-decoration text-white/30">技術記事</p>
            <p
              class="text-xs text-white/40 max-w-xs font-display leading-relaxed"
            >
              Notes on systems, DevOps, security, and the craft of building
              things that actually work in production.
            </p>
          </div>

          <div class="grid grid-cols-2 gap-6 pt-4 max-w-xs">
            <div
              class="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
            >
              <div class="text-3xl font-display font-bold text-white mb-1">
                {{ articles?.length ?? 0 }}
              </div>
              <div class="text-xs font-display text-white/50">Articles</div>
            </div>
            <div
              class="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
            >
              <div class="text-3xl font-display font-bold text-white mb-1">
                {{ allTags.length - 1 }}
              </div>
              <div class="text-xs font-display text-white/50">Topics</div>
            </div>
          </div>
        </div>
      </section>

      <section id="articles" class="relative group">
        <div
          class="absolute -left-4 top-0 bottom-0 w-px bg-white/10 origin-top scale-y-0 transition-transform group-hover:scale-y-100 duration-500"
        ></div>
        <h2
          class="text-xs font-display text-white/40 uppercase tracking-widest mb-8 pl-4"
        >
          02 / Articles
        </h2>

        <div class="flex flex-wrap gap-2 mb-10">
          <button
            v-for="tag in allTags"
            :key="tag"
            @click="selectedTag = tag"
            class="px-4 py-1.5 rounded-lg text-xs font-display transition-all duration-300"
            :class="
              selectedTag === tag
                ? 'bg-white text-black'
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white'
            "
          >
            {{ tag }}
          </button>
        </div>

        <div v-if="!filtered.length" class="py-16 text-center">
          <p class="font-display text-white/30 text-sm">No articles yet.</p>
        </div>

        <div v-else class="flex flex-col">
          <NuxtLink
            v-for="(article, index) in filtered"
            :key="article.path"
            :to="article.path"
            class="group/row relative flex items-start gap-6 py-7 border-b border-white/8 hover:border-white/20 transition-all duration-300"
          >
            <span
              class="font-display text-white/15 text-xs tabular-nums pt-1 shrink-0 w-6 text-right"
            >
              {{ String(index + 1).padStart(2, "0") }}
            </span>

            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2 mb-2">
                <span
                  v-if="article.featured"
                  class="text-[10px] uppercase tracking-wider font-display text-green-400 border border-green-500/30 bg-green-500/10 px-2 py-0.5 rounded flex items-center gap-1"
                >
                  <LucideStar class="w-3 h-3 fill-green-400/50" />
                  Featured
                </span>
                <span
                  v-for="tag in article.tags"
                  :key="tag"
                  class="text-[10px] uppercase tracking-wider font-display text-white/30 border border-white/10 px-2 py-0.5 rounded"
                >
                  {{ tag }}
                </span>
              </div>

              <h3
                class="font-display text-white text-lg md:text-xl font-semibold leading-snug mb-2 relative inline-block"
              >
                {{ article.title }}
                <span
                  class="absolute left-0 -bottom-0.5 h-px bg-white w-0 group-hover/row:w-full transition-all duration-500 ease-out"
                ></span>
              </h3>

              <p class="text-xs text-white/40 font-display line-clamp-2 mt-1">
                {{ article.description }}
              </p>
            </div>

            <div class="shrink-0 flex flex-col items-end gap-1 pt-1 text-right">
              <span class="text-[11px] font-display text-white/30">{{
                formatDate(article.date)
              }}</span>
              <span class="text-[11px] font-display text-white/20">{{
                readingTime(article.body)
              }}</span>
            </div>

            <LucideChevronRight
              class="w-4 h-4 text-white/20 shrink-0 self-center opacity-0 group-hover/row:opacity-100 group-hover/row:translate-x-1 transition-all duration-300"
            />
          </NuxtLink>
        </div>
      </section>
    </main>
  </div>
</template>
