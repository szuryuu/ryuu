<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import LinkButton from "~/components/LinkButton.vue";
import { usePageEnter } from "~/composables/usePageEnter";

const pageRef = usePageEnter({ y: 20, duration: 0.6 });
const route = useRoute();
const supabase = useSupabaseClient();

const { data: project } = await useAsyncData(
  `project-${route.params.slug}`,
  () => queryCollection("projects").path(route.path).first(),
);

if (!project.value) {
  throw createError({ statusCode: 404, message: "Project not found" });
}

useSeoMeta({
  title: project.value.title,
  description: project.value.description,
  ogImage: project.value.image,
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

  const storageKey = `read_project_${route.params.slug}`;
  if (localStorage.getItem(storageKey)) {
    hasCountedRead = true;
    return;
  }

  const timeSpent = Date.now() - startTime;
  const minTimeRequired =
    getReadingTimeMins(project.value?.body) * 60000 * 0.25;

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
  <article v-if="project" class="w-full min-h-screen relative" ref="pageRef">
    <div class="fixed top-0 left-0 right-0 z-20 pointer-events-none">
      <div class="h-px w-full bg-white/5">
        <div
          class="h-full bg-white/60 transition-none"
          :style="{ width: scrollProgress + '%' }"
        ></div>
      </div>
    </div>

    <header class="relative flex mb-0 gap-8">
      <div class="absolute inset-0 -z-10">
        <NuxtImg
          v-if="project.image"
          :src="project.image"
          :alt="project.title"
          class="hero-image w-full h-full object-cover opacity-30"
          width="1920"
          height="1080"
          size="100vw"
          format="webp"
          preload
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-primary via-primary/90 to-transparent"
        ></div>
      </div>
      <div class="w-full max-w-7xl mx-auto px-6 md:px-12 pb-20 pt-32">
        <div class="flex items-center gap-4 mb-8">
          <span class="font-decoration text-2xl md:text-3xl text-white/60">
            プロジェクト
          </span>
          <div
            class="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"
          ></div>
        </div>

        <h1
          class="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-tight"
        >
          {{ project.title }}
        </h1>

        <p
          class="text-xl md:text-2xl text-white/80 max-w-3xl mb-12 font-display"
        >
          {{ project.description }}
        </p>

        <div class="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div v-if="project.type" class="hero-meta">
            <p class="text-xs uppercase font-display text-white/50 mb-1">
              Type
            </p>
            <p class="text-lg font-display text-white">{{ project.type }}</p>
          </div>
          <div v-if="project.year" class="hero-meta">
            <p class="text-xs uppercase font-display text-white/50 mb-1">
              Year
            </p>
            <p class="text-lg font-display text-white">{{ project.year }}</p>
          </div>
          <div v-if="project.role" class="hero-meta">
            <p class="text-xs uppercase font-display text-white/50 mb-1">
              Role
            </p>
            <p class="text-lg font-display text-white">{{ project.role }}</p>
          </div>
          <div v-if="project.status" class="hero-meta">
            <p class="text-xs uppercase font-display text-white/50 mb-1">
              Status
            </p>
            <span
              class="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-full text-sm font-display text-white backdrop-blur-sm"
            >
              {{ project.status }}
            </span>
          </div>
          <div class="hero-meta">
            <p class="text-xs uppercase font-display text-white/50 mb-1">
              Reads
            </p>
            <p class="text-lg font-display text-white">{{ readCount }}</p>
          </div>
        </div>
      </div>
    </header>

    <section
      class="content-section sticky top-0 z-10 bg-primary/95 backdrop-blur-md border-b border-white/10"
    >
      <div class="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div class="flex-1">
            <p class="text-xs uppercase font-display text-white/50 mb-3">
              Tech Stack
            </p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tech in project.tech"
                :key="tech"
                class="px-3 py-1.5 bg-accent/50 border border-white/10 text-white text-sm font-display rounded-md hover:bg-accent transition-colors duration-300"
              >
                {{ tech }}
              </span>
            </div>
          </div>

          <div class="flex gap-3">
            <LinkButton
              v-if="project.github"
              :to="project.github"
              aria-label="View GitHub Repository"
              class="flex items-center gap-2"
            >
              <LucideGithub :size="14" />
              <span class="font-display">Repository</span>
            </LinkButton>
            <LinkButton
              v-if="project.live"
              :to="project.live"
              aria-label="View Live Demo"
              target="_blank"
              class="flex items-center gap-2"
            >
              <LucideExternalLink :size="14" />
              <span class="font-display">Live Demo</span>
            </LinkButton>
          </div>
        </div>
      </div>
    </section>

    <section
      v-if="project.duration || project.team_size"
      class="content-section max-w-7xl mx-auto px-6 md:px-12 py-16"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-if="project.duration"
          class="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/5"
        >
          <div class="flex items-center gap-3 mb-2">
            <LucideClock :size="20" class="text-white/50" />
            <p class="text-xs uppercase font-display text-white/50">Duration</p>
          </div>
          <p class="text-2xl font-display text-white">{{ project.duration }}</p>
        </div>

        <div
          v-if="project.team_size"
          class="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/5"
        >
          <div class="flex items-center gap-3 mb-2">
            <LucideUsers :size="20" class="text-white/50" />
            <p class="text-xs uppercase font-display text-white/50">
              Team Size
            </p>
          </div>
          <p class="text-2xl font-display text-white">
            {{ project.team_size }} members
          </p>
        </div>

        <div
          class="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/5"
        >
          <div class="flex items-center gap-3 mb-2">
            <LucideCalendar :size="20" class="text-white/50" />
            <p class="text-xs uppercase font-display text-white/50">
              Published
            </p>
          </div>
          <p class="text-2xl font-display text-white">{{ project.year }}</p>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-6 md:px-12 pb-16 pt-8 relative">
      <div class="flex flex-col lg:flex-row items-start gap-12 lg:gap-24">
        <main
          class="flex-1 min-w-0 w-full prose prose-lg prose-invert max-w-none text-white"
        >
          <ContentRenderer class="text-white" :value="project" />
        </main>

        <aside
          class="hidden lg:block w-56 shrink-0 sticky top-48 pt-4 self-start"
        >
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
              v-if="project?.body?.toc?.links?.length"
              class="flex flex-col gap-5 text-[11px] font-display"
            >
              <a
                v-for="link in project.body.toc.links"
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

    <section class="max-w-7xl mx-auto px-6 md:px-12 pb-16">
      <LinkButton
        to="/project"
        aria-label="Back to Projects"
        class="flex items-center gap-2 group w-max"
      >
        <LucideArrowLeft
          :size="14"
          class="group-hover:-translate-x-1 transition-transform"
        />
        <span class="font-display">Back to Projects</span>
      </LinkButton>
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
