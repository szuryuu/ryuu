<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import LinkButton from "~/components/LinkButton.vue";
import { usePageEnter } from "~/composables/usePageEnter";

const pageRef = usePageEnter({ y: 20, duration: 0.6 });

const route = useRoute();
const { data: article } = await useAsyncData(
  `writing-${route.params.slug}`,
  () =>
    queryCollection("writing").path(`/writing/${route.params.slug}`).first(),
);

if (!article.value) {
  throw createError({ statusCode: 404, message: "Article not found" });
}

useSeoMeta({
  title: article.value.title,
  description: article.value.description,
  ogImage: article.value.cover,
});

// Scroll progress bar
const scrollProgress = ref(0);

function onScroll() {
  const el = document.documentElement;
  const scrolled = el.scrollTop;
  const total = el.scrollHeight - el.clientHeight;
  scrollProgress.value = total > 0 ? (scrolled / total) * 100 : 0;
}

// Reading time
function readingTime(body: unknown): string {
  const text = JSON.stringify(body ?? "");
  const words = text.split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

onMounted(() => window.addEventListener("scroll", onScroll, { passive: true }));
onUnmounted(() => window.removeEventListener("scroll", onScroll));
</script>

<template>
  <article v-if="article" class="w-full min-h-screen relative" ref="pageRef">
    <!-- Sticky progress + title bar -->
    <div class="fixed top-0 left-0 right-0 z-20">
      <!-- 1px scroll progress line -->
      <div class="h-px w-full bg-white/5">
        <div
          class="h-full bg-white/60 transition-none"
          :style="{ width: scrollProgress + '%' }"
        ></div>
      </div>
    </div>

    <!-- Hero header -->
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
        <!-- Label -->
        <div class="flex items-center gap-4 mb-8">
          <span class="font-decoration text-2xl text-white/60">技術記事</span>
          <div
            class="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"
          ></div>
        </div>

        <!-- Tags -->
        <div class="flex flex-wrap gap-2 mb-6">
          <span
            v-for="tag in article.tags"
            :key="tag"
            class="px-3 py-1 bg-white/10 border border-white/15 rounded-md text-xs font-display text-white/70"
          >
            {{ tag }}
          </span>
        </div>

        <!-- Title -->
        <h1
          class="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight"
        >
          {{ article.title }}
        </h1>

        <!-- Description -->
        <p class="text-lg text-white/70 max-w-2xl font-display mb-10">
          {{ article.description }}
        </p>

        <!-- Meta row -->
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
        </div>
      </div>
    </header>

    <!-- Article body -->
    <section class="max-w-7xl mx-auto px-6 md:px-12 pb-16 pt-4">
      <div class="prose prose-lg prose-invert max-w-none text-white">
        <ContentRenderer :value="article" />
      </div>
    </section>

    <!-- Bottom nav -->
    <section class="max-w-7xl mx-auto px-6 md:px-12 pb-24">
      <div
        class="pt-12 border-t border-white/10 flex flex-col md:flex-row md:justify-between md:items-center gap-4"
      >
        <LinkButton
          to="/writing"
          aria-label="Back to Writing"
          class="flex items-center gap-2 group"
        >
          <LucideArrowLeft
            class="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform"
          />
          <span class="font-display">All Articles</span>
        </LinkButton>

        <p class="text-xs font-display text-white/25 uppercase tracking-widest">
          Thanks for reading
        </p>
      </div>
    </section>
  </article>
</template>
