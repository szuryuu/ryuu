// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  modules: [
    "@nuxt/content",
    "@nuxt/ui",
    "nuxt-lucide-icons",
    "v-gsap-nuxt",
    "@nuxt/image",
  ],

  icon: {
    customCollections: [
      {
        prefix: "custom",
        dir: "./assets/images/icons",
      },
    ],
  },
});
