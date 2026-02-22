// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],

  app: {
    head: {
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico?v=2" }],
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  modules: [
    "@nuxt/content",
    "@nuxt/ui",
    "nuxt-lucide-icons",
    "v-gsap-nuxt",
    "@nuxt/image",
    "@nuxtjs/supabase",
  ],

  supabase: {
    redirect: false,
  },

  icon: {
    customCollections: [
      {
        prefix: "custom",
        dir: "./assets/images/icons",
      },
    ],
  },
});
