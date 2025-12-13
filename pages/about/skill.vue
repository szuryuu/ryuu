<script setup lang="ts">
import { ref } from "vue";
import CertificateCard from "@/components/CertificateCard.vue";

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
      <div
        class="fixed top-1/2 -translate-y-1/2 flex justify-center items-center gap-4"
      >
        <button
          class="cursor-pointer flex items-start"
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
          class="cursor-pointer flex items-start"
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
      class="flex flex-col pb-20 pt-32 items-center max-w-5xl w-full mx-auto min-h-screen"
    >
      <header
        class="sticky top-0 z-10 w-full text-center py-4 mb-8 bg-gray-500/50 backdrop-blur-md"
      >
        <h1 class="text-2xl font-bold">Title</h1>
      </header>
      <div v-if="selectedTab === 'certificate'">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CertificateCard />
        </div>
      </div>
      <div v-else-if="selectedTab === 'tech-stack'">
        <p>Tech Stack content</p>
      </div>
    </section>
  </div>
</template>
