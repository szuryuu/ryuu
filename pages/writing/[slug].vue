<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import LinkButton from "~/components/LinkButton.vue";
import { usePageEnter } from "~/composables/usePageEnter";

const pageRef = usePageEnter({ y: 20, duration: 0.6 });
const route = useRoute();
const supabase = useSupabaseClient();

const { data: article } = await useAsyncData(
  `writing-${route.params.slug}`,
  () => queryCollection("writing").path(route.path).first(),
);

if (!article.value) {
  throw createError({ statusCode: 404, message: "Article not found" });
}

const { data: allArticles } = await useAsyncData("all-writing", () =>
  queryCollection("writing").order("date", "DESC").all(),
);

const currentIndex = computed(
  () => allArticles.value?.findIndex((a) => a.path === route.path) ?? -1,
);
const prevArticle = computed(() =>
  currentIndex.value > 0 ? allArticles.value?.[currentIndex.value - 1] : null,
);
const nextArticle = computed(() =>
  currentIndex.value < (allArticles.value?.length ?? 0) - 1
    ? allArticles.value?.[currentIndex.value + 1]
    : null,
);

useSeoMeta({
  title: article.value.title,
  description: article.value.description,
  ogImage: article.value.cover,
});

const scrollProgress = ref(0);
const activeId = ref("");
let observer: IntersectionObserver | null = null;

let startTime = 0;
let hasCountedRead = false;
const readCount = ref(0);

const fetchReadCount = async () => {
  const { data } = await supabase
    .from("article_reads")
    .select("read_count")
    .eq("slug", route.params.slug)
    .single();
  if (data) readCount.value = data.read_count;
};

watch(scrollProgress, async (newVal) => {
  if (hasCountedRead) return;

  const storageKey = `read_${route.params.slug}`;
  if (localStorage.getItem(storageKey)) {
    hasCountedRead = true;
    return;
  }

  const timeSpent = Date.now() - startTime;
  const minTimeRequired =
    getReadingTimeMins(article.value?.body) * 60000 * 0.25;

  if (newVal >= 80 && timeSpent >= minTimeRequired) {
    hasCountedRead = true;
    localStorage.setItem(storageKey, "true");

    await supabase.rpc("increment_read_count", {
      article_slug: route.params.slug as string,
    });
    readCount.value++;
  }
});

function onScroll() {
  const el = document.documentElement;
  const scrolled = el.scrollTop;
  const total = el.scrollHeight - el.clientHeight;
  scrollProgress.value = total > 0 ? (scrolled / total) * 100 : 0;
}

function getReadingTimeMins(body: unknown): number {
  const text = JSON.stringify(body ?? "");
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function readingTime(body: unknown): string {
  return `${getReadingTimeMins(body)} min read`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

onMounted(() => {
  startTime = Date.now();
  fetchReadCount();

  window.addEventListener("scroll", onScroll, { passive: true });

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id;
        }
      });
    },
    { rootMargin: "0px 0px -80% 0px", threshold: 0.1 },
  );

  setTimeout(() => {
    document.querySelectorAll(".prose h2, .prose h3").forEach((heading) => {
      if (heading.id) observer?.observe(heading);
    });
  }, 500);
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
  observer?.disconnect();
});
</script>

<template>
  <article v-if="article" class="w-full min-h-screen relative" ref="pageRef">
    <div class="fixed top-0 left-0 right-0 z-20">
      <div class="h-px w-full bg-white/5">
        <div
          class="h-full bg-white/60 transition-none"
          :style="{ width: scrollProgress + '%' }"
        ></div>
      </div>
    </div>

    <header class="relative flex mb-10 gap-8">
      <div class="absolute inset-0 -z-10">
        <NuxtImg
          v-if="article.cover"
          :src="article.cover"
          :alt="article.title"
          class="w-full h-full object-cover opacity-20"
          width="1920"
          height="1080"
          format="webp"
          preload
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-primary via-primary/90 to-transparent"
        ></div>
      </div>

      <div class="w-full max-w-7xl mx-auto px-6 md:px-12 pb-16 pt-32">
        <div class="flex items-center gap-4 mb-8">
          <span class="font-decoration text-2xl text-white/60">技術記事</span>
          <div
            class="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"
          ></div>
        </div>

        <div class="flex flex-wrap gap-2 mb-6">
          <span
            v-for="tag in article.tags"
            :key="tag"
            class="px-3 py-1 bg-white/10 border border-white/15 rounded-md text-xs font-display text-white/70"
          >
            {{ tag }}
          </span>
        </div>

        <h1
          class="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight"
        >
          {{ article.title }}
        </h1>

        <p class="text-lg text-white/70 max-w-2xl font-display mb-10">
          {{ article.description }}
        </p>

        <div
          class="flex flex-wrap items-center gap-6 text-xs font-display text-white/40 uppercase tracking-wider"
        >
          <span class="flex items-center gap-2">
            <LucideCalendar class="w-3.5 h-3.5" />
            {{ formatDate(article.date) }}
          </span>
          <span class="flex items-center gap-2">
            <LucideClock class="w-3.5 h-3.5" />
            {{ readingTime(article.body) }}
          </span>
          <span class="flex items-center gap-2">
            <LucideEye class="w-3.5 h-3.5" />
            {{ readCount }} Reads
          </span>
        </div>
      </div>
    </header>

    <section class="max-w-7xl mx-auto px-6 md:px-12 pb-16 pt-4 relative">
      <div class="flex flex-col lg:flex-row items-start gap-12 lg:gap-24">
        <main
          class="flex-1 min-w-0 w-full prose prose-lg prose-invert max-w-none text-white"
        >
          <ContentRenderer :value="article" />
        </main>

        <aside class="hidden lg:block w-56 shrink-0 sticky top-32 self-start">
          <div class="flex flex-col">
            <div class="flex items-start text-white mb-10 opacity-60">
              <span class="[writing-mode:vertical-lr] text-2xl font-decoration"
                >目次</span
              >
              <span
                class="[writing-mode:vertical-lr] text-lg font-display uppercase tracking-widest"
                >Contents</span
              >
            </div>

            <nav
              v-if="article?.body?.toc?.links?.length"
              class="flex flex-col gap-5 text-[11px] font-display"
            >
              <a
                v-for="link in article.body.toc.links"
                :key="link.id"
                :href="`#${link.id}`"
                class="transition-colors flex items-center gap-3 group uppercase tracking-widest"
                :class="
                  activeId === link.id
                    ? 'text-white'
                    : 'text-white/40 hover:text-white'
                "
              >
                <span
                  class="h-px transition-all duration-300"
                  :class="[
                    activeId === link.id ? 'bg-white' : 'bg-white/20',
                    link.depth === 2
                      ? activeId === link.id
                        ? 'w-12'
                        : 'w-8 group-hover:w-12'
                      : '',
                    link.depth === 3
                      ? activeId === link.id
                        ? 'w-8 ml-4'
                        : 'w-4 group-hover:w-8 ml-4'
                      : '',
                    link.depth > 3
                      ? activeId === link.id
                        ? 'w-6 ml-8'
                        : 'w-2 group-hover:w-6 ml-8'
                      : '',
                  ]"
                ></span>
                <span class="line-clamp-2 leading-relaxed flex-1">{{
                  link.text
                }}</span>
              </a>
            </nav>

            <p
              v-else
              class="text-xs font-display text-white/30 uppercase tracking-widest"
            >
              No contents available
            </p>
          </div>
        </aside>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-6 md:px-12 pb-24">
      <div
        class="pt-12 border-t border-white/10 flex flex-col md:flex-row md:justify-between md:items-center gap-8"
      >
        <NuxtLink
          v-if="prevArticle"
          :to="prevArticle.path"
          class="flex flex-col items-start gap-2 group w-full md:w-1/3"
        >
          <span
            class="text-[10px] font-display text-white/40 uppercase tracking-widest flex items-center gap-2"
          >
            <LucideArrowLeft
              class="w-3 h-3 group-hover:-translate-x-1 transition-transform"
            />
            Previous
          </span>
          <span
            class="text-sm font-display text-white/80 group-hover:text-white line-clamp-2"
            >{{ prevArticle.title }}</span
          >
        </NuxtLink>
        <div v-else class="w-full md:w-1/3"></div>

        <LinkButton
          to="/writing"
          aria-label="Back to Writing"
          class="shrink-0 flex items-center justify-center gap-2 group"
        >
          <LucideGrid class="w-4 h-4" />
          <span class="font-display">All Articles</span>
        </LinkButton>

        <NuxtLink
          v-if="nextArticle"
          :to="nextArticle.path"
          class="flex flex-col items-end gap-2 group w-full md:w-1/3 text-right"
        >
          <span
            class="text-[10px] font-display text-white/40 uppercase tracking-widest flex items-center gap-2"
          >
            Next
            <LucideArrowRight
              class="w-3 h-3 group-hover:translate-x-1 transition-transform"
            />
          </span>
          <span
            class="text-sm font-display text-white/80 group-hover:text-white line-clamp-2"
            >{{ nextArticle.title }}</span
          >
        </NuxtLink>
        <div v-else class="w-full md:w-1/3"></div>
      </div>
    </section>
  </article>
</template>

<style scoped>
:deep(.prose h1),
:deep(.prose h2),
:deep(.prose h3),
:deep(.prose h4) {
  scroll-margin-top: 160px;
}
</style>
