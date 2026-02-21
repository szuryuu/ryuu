<script setup lang="ts">
import { ref, computed } from "vue";
import ProjectCard from "~/components/project/ProjectCard.vue";
import { usePageEnter } from "~/composables/usePageEnter";

const pageRef = usePageEnter({ y: 20, duration: 0.6 });

const { data: projects } = await useAsyncData("projects", () =>
  queryCollection("projects").order("order", "ASC").all(),
);

if (!projects.value || projects.value.length === 0) {
  console.warn("No projects found. Add content to /content/project/");
}

// Filters
const filters = [
  "All",
  "Team Project",
  "Solo Project",
  "Intern Project",
  "Exam Project",
];
const selectedFilter = ref("All");
const selectedTech = ref<string | null>(null);

// Get unique tech stack
const allTech = computed(() => {
  if (!projects.value) return [];
  const techSet = new Set<string>();
  projects.value.forEach((project) => {
    project.tech?.forEach((t: string) => techSet.add(t));
  });
  return Array.from(techSet).sort();
});

// Filtered projects
const filteredProjects = computed(() => {
  if (!projects.value) return [];

  let filtered = projects.value;

  // Filter by type
  if (selectedFilter.value !== "All") {
    filtered = filtered.filter((p) => p.type === selectedFilter.value);
  }

  // Filter by tech
  if (selectedTech.value) {
    filtered = filtered.filter((p) => p.tech?.includes(selectedTech.value!));
  }

  return filtered;
});

// Stats
const stats = computed(() => {
  if (!projects.value) return { total: 0, featured: 0, completed: 0 };

  return {
    total: projects.value.length,
    featured: projects.value.filter((p) => p.featured).length,
    completed: projects.value.filter((p) => p.status === "Completed").length,
  };
});
</script>

<template>
  <div
    class="w-full min-h-screen flex flex-col lg:flex-row pt-24 gap-8 max-w-7xl mx-auto"
    ref="pageRef"
  >
    <!-- Sidebar -->
    <aside class="w-full hidden lg:block">
      <div class="flex items-start flex-col justify-between fixed">
        <div class="flex items-start text-white">
          <span class="[writing-mode:vertical-lr] text-2xl font-decoration">
            プロジェクト
          </span>
          <span class="[writing-mode:vertical-lr] text-lg font-display"
            >Projects</span
          >
        </div>

        <nav class="hidden lg:flex flex-col gap-4 mt-12 text-sm font-display">
          <a
            href="#overview"
            class="text-white/40 hover:text-white transition-colors flex items-center gap-3 group uppercase"
          >
            <span
              class="w-8 h-px bg-white/20 group-hover:w-12 transition-all"
            ></span>
            Overview
          </a>
          <a
            href="#showcase"
            class="text-white/40 hover:text-white transition-colors flex items-center gap-3 group uppercase"
          >
            <span
              class="w-8 h-px bg-white/20 group-hover:w-12 transition-all"
            ></span>
            Showcase
          </a>
          <a
            href="#filter"
            class="text-white/40 hover:text-white transition-colors flex items-center gap-3 group uppercase"
          >
            <span
              class="w-8 h-px bg-white/20 group-hover:w-12 transition-all"
            ></span>
            Filter
          </a>
        </nav>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="w-full lg:min-w-5xl max-w-5xl space-y-12 pb-32 mx-auto">
      <!-- Overview Section -->
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
          <!-- Title -->
          <div class="flex items-center gap-4 mb-8">
            <div class="h-px flex-1 bg-white/10"></div>
            <span class="text-6xl font-display text-white/10 font-bold"
              >00</span
            >
          </div>

          <h1 class="text-reveal font-display uppercase group cursor-pointer">
            <span class="text-gradient-base">Selected<br />Work</span>
            <span class="text-reveal-overlay">Selected<br />Work</span>
          </h1>

          <div class="space-y-2 pl-1">
            <p class="font-decoration text-white/30">作品集</p>
            <p
              class="text-xs text-white/40 max-w-xs font-display leading-relaxed"
            >
              Production systems, internal tools, and open-source contributions.
              Each project solved real problems with measurable impact.
            </p>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-6 pt-8">
            <div
              class="bg-white/5 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/10 flex flex-col justify-between"
            >
              <div class="text-4xl font-display font-bold text-white mb-2">
                {{ stats.total }}
              </div>
              <div class="text-xs md:text-sm font-display text-white/60">
                Total Projects
              </div>
            </div>

            <div
              class="bg-white/5 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/10 flex flex-col justify-between"
            >
              <div class="text-4xl font-display font-bold text-white mb-2">
                {{ stats.featured }}
              </div>
              <div class="text-xs md:text-sm font-display text-white/60">
                Featured
              </div>
            </div>

            <div
              class="bg-white/5 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/10 flex flex-col justify-between"
            >
              <div class="text-4xl font-display font-bold text-white mb-2">
                {{ stats.completed }}
              </div>
              <div class="text-xs md:text-sm font-display text-white/60">
                Completed
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Filter Section -->
      <section id="filter" class="relative group">
        <div
          class="absolute -left-4 top-0 bottom-0 w-px bg-white/10 origin-top scale-y-0 transition-transform group-hover:scale-y-100 duration-500"
        ></div>
        <h2
          class="text-xs font-display text-white/40 uppercase tracking-widest mb-8 pl-4"
        >
          02 / Filter
        </h2>

        <div class="space-y-6">
          <!-- Type Filter -->
          <div>
            <p
              class="text-sm font-display text-white/60 mb-3 uppercase tracking-wider"
            >
              Project Type
            </p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="filter in filters"
                :key="filter"
                @click="selectedFilter = filter"
                class="px-4 py-2 rounded-lg text-sm font-display transition-all duration-300"
                :class="
                  selectedFilter === filter
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                "
              >
                {{ filter }}
              </button>
            </div>
          </div>

          <!-- Tech Filter -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <p
                class="text-sm font-display text-white/60 uppercase tracking-wider"
              >
                Technology Stack
              </p>
              <button
                v-if="selectedTech"
                @click="selectedTech = null"
                class="text-xs font-display text-white/40 hover:text-white uppercase"
              >
                Clear Filter
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tech in allTech"
                :key="tech"
                @click="selectedTech = selectedTech === tech ? null : tech"
                class="px-3 py-1.5 rounded-md text-xs font-display transition-all duration-300"
                :class="
                  selectedTech === tech
                    ? 'bg-accent text-white border border-white/30'
                    : 'bg-accent/30 text-white/80 border border-white/5 hover:bg-accent/50'
                "
              >
                {{ tech }}
              </button>
            </div>
          </div>

          <!-- Active Filters Display -->
          <div
            v-if="selectedFilter !== 'All' || selectedTech"
            class="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <LucideFilter :size="16" class="text-white/60" />
                <span class="text-sm font-display text-white/60"
                  >Active Filters:</span
                >
                <span class="text-sm font-display text-white">
                  {{ selectedFilter !== "All" ? selectedFilter : "" }}
                  {{ selectedFilter !== "All" && selectedTech ? "+" : "" }}
                  {{ selectedTech || "" }}
                </span>
              </div>
              <span class="text-sm font-display text-white/40"
                >{{ filteredProjects.length }} results</span
              >
            </div>
          </div>
        </div>
      </section>

      <!-- Projects Showcase -->
      <section id="showcase" class="relative group">
        <div
          class="absolute -left-4 top-0 bottom-0 w-px bg-white/10 origin-top scale-y-0 transition-transform group-hover:scale-y-100 duration-500"
        ></div>
        <h2
          class="text-xs font-display text-white/40 uppercase tracking-widest mb-8 pl-4"
        >
          03 / Showcase
        </h2>

        <!-- No Results State -->
        <div
          v-if="filteredProjects.length === 0"
          class="bg-white/5 backdrop-blur-sm rounded-xl p-12 border border-white/10 text-center"
        >
          <LucideSearchX :size="48" class="mx-auto mb-4 text-white/40" />
          <p class="text-lg font-display text-white mb-2">No projects found</p>
          <p class="text-sm font-display text-white/60">
            Try adjusting your filters or
            <button
              @click="
                () => {
                  selectedFilter = 'All';
                  selectedTech = null;
                }
              "
              class="text-white underline hover:text-white/80"
            >
              clear all filters
            </button>
          </p>
        </div>

        <!-- Project Grid -->
        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="project in filteredProjects"
            :key="project.id"
            class="group/card"
          >
            <ProjectCard
              :project="{
                name: project.title,
                type: project.type,
                year: project.year,
                slug: project.slug,
                image: project.image,
                projectDetailUrl: `/project/${project.slug}`,
                liveDemoUrl: project.live || '',
                githubUrl: project.github || '',
              }"
            />
          </div>
        </div>

        <!-- Show All CTA -->
        <div
          v-if="selectedFilter !== 'All' || selectedTech"
          class="mt-12 text-center"
        >
          <button
            @click="
              () => {
                selectedFilter = 'All';
                selectedTech = null;
              }
            "
            class="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg text-sm font-display hover:bg-white/10 transition-colors"
          >
            View All Projects
            <LucideArrowRight :size="16" />
          </button>
        </div>
      </section>

      <!-- Call to Action -->
      <section class="relative group">
        <div
          class="absolute -left-4 top-0 bottom-0 w-px bg-white/10 origin-top scale-y-0 transition-transform group-hover:scale-y-100 duration-500"
        ></div>

        <div
          class="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
        >
          <h3 class="text-2xl font-display font-bold text-white mb-4">
            Want to Build Something?
          </h3>
          <p class="text-sm text-white/60 font-display mb-6">
            These projects represent my approach: understand the problem, build
            the right solution, ship it to production. If you have a project in
            mind, let's talk.
          </p>

          <div class="flex flex-wrap gap-3">
            <NuxtLink
              to="/contact"
              class="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg text-sm font-display font-semibold hover:bg-white/90 transition-colors"
            >
              Get in Touch
              <LucideArrowRight :size="16" />
            </NuxtLink>
            <NuxtLink
              to="/about"
              class="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white rounded-lg text-sm font-display hover:bg-white/10 transition-colors"
            >
              View Experience
              <LucideUser :size="16" />
            </NuxtLink>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
