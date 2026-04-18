<script setup lang="ts">
const route = useRoute();

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
  ogTitle: project.value.title,
  ogDescription: project.value.description,
});

const pageRef = usePageEnter({ y: 20, duration: 0.6 });
const { scrollPercent } = useScrollProgress();
const { readCount } = useReadTracking(
  String(route.params.slug),
  project.value?.body,
  scrollPercent,
);

const activeHeadingId = ref("");
let tocObserver: IntersectionObserver | null = null;

onMounted(() => {
  tocObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activeHeadingId.value = entry.target.id;
      });
    },
    { rootMargin: "0px 0px -80% 0px", threshold: 0.1 },
  );

  setTimeout(() => {
    document.querySelectorAll(".prose h2, .prose h3").forEach((heading) => {
      if (heading.id) tocObserver?.observe(heading);
    });
  }, 500);
});

onUnmounted(() => {
  tocObserver?.disconnect();
});
</script>

<template>
  <article v-if="project" class="w-full min-h-screen relative" ref="pageRef">
    <div class="fixed top-0 left-0 right-0 z-20 pointer-events-none">
      <div class="h-px w-full bg-white/5">
        <div
          class="h-full bg-white/60 transition-none"
          :style="{ width: scrollPercent + '%' }"
        ></div>
      </div>
    </div>

    <header class="relative flex mb-0 gap-8">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-full -z-10">
        <NuxtImg
          v-if="project.image"
          :src="project.image"
          :alt="project.title"
          class="hero-image w-full h-full object-cover opacity-30"
          width="1920"
          height="1080"
          size="100vw"
          format="webp"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-primary via-primary/90 to-transparent"></div>
      </div>

      <div class="w-full max-w-7xl mx-auto px-6 md:px-12 pb-20 pt-32">
        <div class="flex items-center gap-4 mb-8">
          <span class="font-decoration text-2xl md:text-3xl text-white/60">プロジェクト</span>
          <div class="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
        </div>

        <h1 class="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-tight">
          {{ project.title }}
        </h1>

        <p class="text-xl md:text-2xl text-white/80 max-w-3xl mb-12 font-display">
          {{ project.description }}
        </p>

        <div class="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div v-if="project.type" class="hero-meta">
            <p class="text-xs uppercase font-display text-white/50 mb-1">Type</p>
            <p class="text-lg font-display text-white">{{ project.type }}</p>
          </div>
          <div v-if="project.year" class="hero-meta">
            <p class="text-xs uppercase font-display text-white/50 mb-1">Year</p>
            <p class="text-lg font-display text-white">{{ project.year }}</p>
          </div>
          <div v-if="project.role" class="hero-meta">
            <p class="text-xs uppercase font-display text-white/50 mb-1">Role</p>
            <p class="text-lg font-display text-white">{{ project.role }}</p>
          </div>
          <div v-if="project.status" class="hero-meta">
            <p class="text-xs uppercase font-display text-white/50 mb-1">Status</p>
            <span class="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-full text-sm font-display text-white backdrop-blur-sm">
              {{ project.status }}
            </span>
          </div>
          <div class="hero-meta">
            <p class="text-xs uppercase font-display text-white/50 mb-1">Reads</p>
            <p class="text-lg font-display text-white">{{ readCount }}</p>
          </div>
        </div>
      </div>
    </header>

    <section class="sticky top-0 z-10 bg-primary/95 backdrop-blur-md border-b border-white/10">
      <div class="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div class="flex-1">
            <p class="text-xs uppercase font-display text-white/50 mb-3">Tech Stack</p>
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
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View GitHub Repository"
              class="flex items-center gap-2"
            >
              <LucideGithub :size="14" />
              <span class="font-display">Repository</span>
            </LinkButton>
            <LinkButton
              v-if="project.live"
              :to="project.live"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Live Demo"
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
      class="max-w-7xl mx-auto px-6 md:px-12 py-16"
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
            <p class="text-xs uppercase font-display text-white/50">Team Size</p>
          </div>
          <p class="text-2xl font-display text-white">{{ project.team_size }} members</p>
        </div>

        <div class="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/5">
          <div class="flex items-center gap-3 mb-2">
            <LucideCalendar :size="20" class="text-white/50" />
            <p class="text-xs uppercase font-display text-white/50">Published</p>
          </div>
          <p class="text-2xl font-display text-white">{{ project.year }}</p>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-6 md:px-12 pb-16 pt-8 relative">
      <div class="flex flex-col lg:flex-row items-start gap-12 lg:gap-24">
        <div class="flex-1 min-w-0 w-full">
          <details
            v-if="project?.body?.toc?.links?.length"
            class="block lg:hidden mb-10 p-5 border border-white/10 bg-white/5 rounded-xl text-white"
          >
            <summary class="font-display font-bold cursor-pointer outline-none uppercase tracking-widest text-xs opacity-60">
              Table of Contents
            </summary>
            <nav class="mt-5 flex flex-col gap-4 text-xs font-display">
              <a
                v-for="link in project.body.toc.links"
                :key="link.id"
                :href="`#${link.id}`"
                class="transition-colors text-white/60 hover:text-white uppercase tracking-widest"
                :class="[
                  link.depth === 3 ? 'ml-4' : '',
                  link.depth > 3 ? 'ml-8' : '',
                ]"
              >
                {{ link.text }}
              </a>
            </nav>
          </details>

          <main class="prose prose-lg prose-invert max-w-none text-white">
            <ContentRenderer class="text-white" :value="project" />
          </main>
        </div>

        <aside class="hidden lg:block w-56 shrink-0 sticky top-48 pt-4 self-start">
          <div class="flex flex-col">
            <div class="flex items-start text-white mb-10 opacity-60">
              <span class="[writing-mode:vertical-lr] text-2xl font-decoration">目次</span>
              <span class="[writing-mode:vertical-lr] text-lg font-display uppercase tracking-widest">Contents</span>
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
                :class="activeHeadingId === link.id ? 'text-white' : 'text-white/40 hover:text-white'"
              >
                <span
                  class="h-px transition-all duration-300"
                  :class="[
                    activeHeadingId === link.id ? 'bg-white' : 'bg-white/20',
                    link.depth === 2 ? (activeHeadingId === link.id ? 'w-12' : 'w-8 group-hover:w-12') : '',
                    link.depth === 3 ? (activeHeadingId === link.id ? 'w-8 ml-4' : 'w-4 group-hover:w-8 ml-4') : '',
                    link.depth > 3 ? (activeHeadingId === link.id ? 'w-6 ml-8' : 'w-2 group-hover:w-6 ml-8') : '',
                  ]"
                ></span>
                <span class="line-clamp-2 leading-relaxed flex-1">{{ link.text }}</span>
              </a>
            </nav>

            <p v-else class="text-xs font-display text-white/30 uppercase tracking-widest">
              No contents available
            </p>
          </div>
        </aside>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-6 md:px-12 pb-16">
      <LinkButton to="/project" aria-label="Back to Projects" class="flex items-center gap-2 group w-max">
        <LucideArrowLeft :size="14" class="group-hover:-translate-x-1 transition-transform" />
        <span class="font-display">Back to Projects</span>
      </LinkButton>
    </section>
  </article>
</template>
