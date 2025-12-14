<script setup lang="ts">
import { ref } from "vue";
import {
  fullStackSkills,
  devOpsSkills,
  cyberSecuritySkills,
  skillUrl,
} from "@/utils/skills";
import CertificateCard from "@/components/CertificateCard.vue";
import { certificateArray } from "@/utils/certificates";

const selectedTab = ref("certificate");

const tabs = [
  { id: "certificate", label: "Certificate" },
  { id: "tech-stack", label: "Tech Stack" },
];

const handleTabChange = (tabId: string) => {
  selectedTab.value = tabId;
};
</script>

<template>
  <div class="flex w-full min-h-screen max-w-7xl mx-auto">
    <section class="w-24 flex-shrink-0 flex justify-center items-center">
      <div class="fixed top-1/2 -translate-y-1/2 flex justify-start gap-4">
        <button
          class="cursor-pointer flex items-start transition-opacity duration-300"
          :class="
            selectedTab === 'certificate'
              ? 'opacity-100'
              : 'opacity-50 hover:opacity-75'
          "
          @click="handleTabChange('certificate')"
        >
          <span
            class="[writing-mode:vertical-lr] text-4xl font-decoration shrink-0 pt-5"
            >証明書</span
          >
          <span
            class="[writing-mode:vertical-lr] text-xs uppercase font-display px-1"
            >Certificate</span
          >
        </button>
        <button
          class="cursor-pointer flex items-start transition-opacity duration-300"
          :class="
            selectedTab === 'tech-stack'
              ? 'opacity-100'
              : 'opacity-50 hover:opacity-75'
          "
          @click="handleTabChange('tech-stack')"
        >
          <span
            class="[writing-mode:vertical-lr] text-4xl font-decoration shrink-0 pt-5"
            >技術スキル</span
          >
          <span
            class="[writing-mode:vertical-lr] text-xs uppercase font-display px-1"
            >Tech Stack</span
          >
        </button>
      </div>
    </section>
    <section
      class="flex flex-col pb-20 pt-32 items-center max-w-5xl w-full mx-auto h-screen overflow-y-auto"
    >
      <!-- <header
        class="sticky top-0 z-10 w-full text-center py-4 mb-8 bg-gray-500/50 backdrop-blur-md transition-transform duration-300 ease-in-out"
      >
        <h1 class="text-2xl font-bold">
          {{ selectedTab === "certificate" ? "My Certificates" : "Tech Stack" }}
        </h1>
      </header> -->

      <div v-if="selectedTab === 'certificate'">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CertificateCard
            v-for="cert in certificateArray"
            :certificate="cert"
          />
        </div>
      </div>
      <div
        v-else-if="selectedTab === 'tech-stack'"
        class="h-full flex flex-col items-start justify-center"
      >
        <!-- Full Stack Development -->
        <div class="space-y-4 mb-6 w-full">
          <div>
            <div class="flex items-center gap-4">
              <h3 class="text-xl font-display font-semibold">
                Full Stack Development
              </h3>
              <div class="flex-1 h-px bg-white/20"></div>
            </div>
            <p class="text-sm text-gray-400">
              Building scalable web applications from frontend UI to backend
              APIs, database design, and deployment.
            </p>
          </div>
          <div class="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-8">
            <div
              v-for="skill in fullStackSkills"
              :key="skill"
              class="group relative"
            >
              <img
                :src="`${skillUrl}?i=${skill}`"
                :alt="skill"
                class="w-full h-auto transition-transform duration-300 group-hover:scale-110"
              />
              <span
                class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
              >
                {{ skill }}
              </span>
            </div>
          </div>
        </div>

        <!-- DevOps & Infrastructure -->
        <div class="space-y-4 mb-6 w-full">
          <div>
            <div class="flex items-center gap-4">
              <h3 class="text-xl font-display font-semibold">
                DevOps & Infrastructure
              </h3>
              <div class="flex-1 h-px bg-white/20"></div>
            </div>
            <p class="text-sm text-gray-400">
              Automating deployments, container orchestration, CI/CD pipelines,
              and infrastructure as code.
            </p>
          </div>
          <div class="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-8">
            <div
              v-for="skill in devOpsSkills"
              :key="skill"
              class="group relative"
            >
              <img
                :src="`${skillUrl}?i=${skill}`"
                :alt="skill"
                class="w-full h-auto transition-transform duration-300 group-hover:scale-110"
              />
              <span
                class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
              >
                {{ skill }}
              </span>
            </div>
          </div>
        </div>

        <!-- Cyber Security -->
        <div class="space-y-4 mb-6 w-full">
          <div>
            <div class="flex items-center gap-4">
              <h3 class="text-xl font-display font-semibold">Cyber Security</h3>
              <div class="flex-1 h-px bg-white/20"></div>
            </div>
            <p class="text-sm text-gray-400">
              Network security, penetration testing, security audits, and
              implementing secure coding practices.
            </p>
          </div>
          <div class="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-8">
            <div
              v-for="skill in cyberSecuritySkills"
              :key="skill"
              class="group relative"
            >
              <img
                :src="`${skillUrl}?i=${skill}`"
                :alt="skill"
                class="w-full h-auto transition-transform duration-300 group-hover:scale-110"
              />
              <span
                class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
              >
                {{ skill }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
