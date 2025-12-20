<script setup lang="ts">
import { ref } from "vue";
import LinkButton from "~/components/LinkButton.vue";
// import GitHubCalendar from "@/components/GithubCalendar.vue";

// Real contact info - UPDATE THESE
const contact = {
  email: "shafwan@yourdomain.com", // CHANGE THIS
  github: "https://github.com/yourhandle", // CHANGE THIS
  linkedin: "https://linkedin.com/in/yourprofile", // CHANGE THIS
  cv: "/cv.pdf", // Make sure this file exists in public folder
};
</script>

<template>
  <div class="flex w-full justify-center items-center max-w-7xl px-4">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 w-full">
      <!-- Content Column -->
      <div class="flex flex-col justify-center gap-6 order-2 lg:order-1">
        <!-- Name + Status -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-3 flex-wrap">
            <h1 class="text-4xl md:text-5xl font-light text-white font-display">
              Shafwan Ilham Dzaky
            </h1>
            <span
              class="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30"
            >
              <span
                class="w-2 h-2 bg-green-400 rounded-full animate-pulse"
              ></span>
              Open to work
            </span>
          </div>
          <div class="w-16 h-1 bg-white rounded-full"></div>
        </div>

        <!-- Value Proposition - SPECIFIC, not generic -->
        <div class="space-y-4">
          <p class="text-lg md:text-xl font-display text-white">
            I build
            <span class="bg-white text-black font-semibold px-1.5"
              >production-ready web apps</span
            >
            that handle real traffic, real data, and real security threats.
          </p>
          <p class="text-base text-gray-300 font-display">
            Fullstack developer with a cybersecurity mindset. I don't just make
            it work — I make it
            <span class="text-white font-semibold"
              >secure, scalable, and maintainable</span
            >.
          </p>
        </div>

        <!-- Stats - Visual proof without animation -->
        <div class="w-full bg-primary">
          <!-- <img
            src="https://ghchart.rshah.org/szuryuu"
            alt="GitHub contributions"
            class="bg-primary"
          /> -->

          <div
            class="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            <div class="mb-6">
              <h3 class="text-2xl font-display font-bold text-white">
                GitHub Activity
              </h3>
              <p class="text-sm text-gray-400 font-display mt-1">
                Consistency matters. Here's my commit history.
              </p>
            </div>
            <img
              src="https://ghchart.rshah.org/29903b/szuryuu"
              alt="GitHub contributions"
            />
          </div>
        </div>

        <!-- Primary CTAs -->
        <div class="flex flex-wrap gap-3">
          <NuxtLink
            to="/project"
            class="px-6 py-3 bg-white text-black rounded-lg font-display text-sm font-semibold hover:bg-gray-200 transition-all duration-300 inline-flex items-center gap-2"
          >
            View Projects
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </NuxtLink>

          <NuxtLink
            :to="`mailto:${contact.email}`"
            class="px-6 py-3 border border-white/30 text-white rounded-lg font-display text-sm hover:bg-white/10 transition-all duration-300"
          >
            Get in Touch
          </NuxtLink>

          <NuxtLink
            :to="contact.cv"
            target="_blank"
            class="px-6 py-3 border border-white/30 text-white rounded-lg font-display text-sm hover:bg-white/10 transition-all duration-300 inline-flex items-center gap-2"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download CV
          </NuxtLink>
        </div>

        <!-- Quick Links -->
        <div class="flex gap-4 text-gray-400">
          <NuxtLink
            :to="contact.github"
            target="_blank"
            class="hover:text-white transition-colors"
            aria-label="GitHub Profile"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
              />
            </svg>
          </NuxtLink>
          <NuxtLink
            :to="contact.linkedin"
            target="_blank"
            class="hover:text-white transition-colors"
            aria-label="LinkedIn Profile"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
              />
            </svg>
          </NuxtLink>
        </div>
      </div>

      <!-- Image Column -->
      <div
        class="flex justify-center lg:justify-end items-center order-1 lg:order-2"
      >
        <div class="relative group w-full max-w-sm lg:max-w-none">
          <!-- Mobile: smaller, centered -->
          <NuxtImg
            src="/images/profile.jpeg"
            alt="Shafwan Ilham Dzaky - Fullstack Developer"
            class="w-64 h-64 lg:w-96 lg:h-96 rounded-lg shadow-2xl object-cover mx-auto"
            width="400"
            height="400"
            format="webp"
            preload
          />
        </div>
      </div>
    </div>
  </div>
</template>
