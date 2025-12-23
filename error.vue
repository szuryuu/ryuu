<script setup lang="ts">
import Circle from "./components/Circle.vue";
import { Home, User, Code2, Mail, ArrowLeft } from "lucide-vue-next";

const error = useError();

const quickLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/about", label: "About", icon: User },
  { to: "/project", label: "Projects", icon: Code2 },
  { to: "/contact", label: "Contact", icon: Mail },
];

const handleError = () => clearError({ redirect: "/" });
</script>

<template>
  <div
    class="h-screen w-full flex items-center justify-center relative overflow-hidden"
  >
    <Circle class="fixed" />

    <!-- Content -->
    <div class="max-w-2xl w-full px-6 text-center space-y-8">
      <!-- 404 Number -->
      <div class="space-y-2">
        <h1
          class="text-9xl md:text-[12rem] font-display font-bold text-white/10 leading-none"
        >
          404
        </h1>
        <div class="flex items-center justify-center gap-4">
          <div class="h-px flex-1 bg-white/10"></div>
          <p class="text-2xl font-decoration text-white/40">
            ページが見つかりません
          </p>
          <div class="h-px flex-1 bg-white/10"></div>
        </div>
      </div>

      <!-- Message -->
      <div class="space-y-4">
        <h2 class="text-3xl md:text-4xl font-display font-bold text-white">
          Page Not Found
        </h2>
        <p class="text-white/60 font-display max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. Let's get
          you back on track.
        </p>
      </div>

      <!-- Quick Navigation -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
        <NuxtLink
          v-for="link in quickLinks"
          :key="link.to"
          :to="link.to"
          class="flex flex-col items-center gap-2 p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/30 transition-all duration-300 group"
        >
          <component
            :is="link.icon"
            class="w-6 h-6 text-white/60 group-hover:text-white group-hover:scale-110 transition-all"
          />
          <span
            class="text-sm font-display text-white/80 group-hover:text-white transition-colors"
          >
            {{ link.label }}
          </span>
        </NuxtLink>
      </div>

      <!-- Primary CTA -->
      <div class="pt-4">
        <button
          @click="handleError"
          class="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-lg text-sm font-display font-semibold hover:bg-white/90 transition-colors group"
        >
          <LucideArrowLeft
            :size="16"
            class="group-hover:-translate-x-1 transition-transform"
          />
          Back to Home
        </button>
      </div>

      <!-- Error Code (if available) -->
      <div v-if="error?.statusCode" class="pt-8">
        <p class="text-xs text-white/30 font-display uppercase tracking-wider">
          Error Code: {{ error.statusCode }}
          <span v-if="error?.statusMessage"> - {{ error.statusMessage }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
