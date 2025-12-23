<script setup lang="ts">
import { ref } from "vue";
import Circle from "~/components/Circle.vue";
// import { Github, Mail, Linkedin, FileText } from "~/assets/images/icons";
import { UIcon } from "#components";

const contacts = [
  {
    id: "email",
    label: "Email",
    japanese: "メール",
    value: "ilhamdzaky@gmail.com",
    href: "mailto:ilhamdzaky@gmail.com",
    icon: "i-custom-mail",
    description: "Best for project inquiries and collaboration",
  },
  {
    id: "github",
    label: "GitHub",
    japanese: "ギットハブ",
    value: "@szuryuu",
    href: "https://github.com/szuryuu",
    icon: "i-custom-github2",
    description: "Check out my code and contributions",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    japanese: "リンクトイン",
    value: "Shafwan Ilham Dzaky",
    href: "https://linkedin.com/in/shafwan-ilham-dzaky",
    icon: "i-custom-linkedin",
    description: "Professional network and experience",
  },
  {
    id: "cv",
    label: "Resume/CV",
    japanese: "履歴書",
    value: "Download PDF",
    href: "/cv.pdf",
    icon: "i-custom-file-text",
    description: "Full professional background and credentials",
  },
];

const hoveredContact = ref<string | null>(null);
</script>

<template>
  <div
    class="w-full min-h-screen flex flex-col lg:flex-row pt-24 gap-8 max-w-7xl mx-auto"
  >
    <!-- Sidebar -->
    <aside class="w-full hidden lg:block">
      <div class="flex items-start flex-col justify-between fixed">
        <div class="flex items-start">
          <span class="[writing-mode:vertical-lr] text-2xl font-decoration">
            コンタクト
          </span>
          <span class="[writing-mode:vertical-lr] text-lg font-display"
            >Contact</span
          >
        </div>

        <nav class="hidden lg:flex flex-col gap-4 mt-12 text-sm font-display">
          <a
            v-for="contact in contacts"
            :key="contact.id"
            :href="`#${contact.id}`"
            class="text-white/40 hover:text-white transition-colors flex items-center gap-3 group uppercase"
          >
            <span
              class="w-8 h-px bg-white/20 group-hover:w-12 transition-all"
            ></span>
            {{ contact.label }}
          </a>
        </nav>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="w-full lg:min-w-5xl max-w-5xl space-y-12 pb-32 mx-auto">
      <Circle class="fixed" />

      <!-- Header Section -->
      <section class="relative group">
        <div
          class="absolute -left-4 top-0 bottom-0 w-px bg-white/10 origin-top scale-y-0 transition-transform group-hover:scale-y-100 duration-500"
        ></div>
        <h2
          class="text-xs font-display text-white/40 uppercase tracking-widest mb-12 pl-4"
        >
          00 / Get in Touch
        </h2>

        <div class="space-y-6">
          <!-- Text Reveal Title -->
          <h1 class="text-reveal font-display uppercase group cursor-pointer">
            <span class="text-gradient-base"
              >Let's<br />Work<br />Together</span
            >
            <span class="text-reveal-overlay"
              >Let's<br />Work<br />Together</span
            >
          </h1>

          <div class="space-y-2 pl-1">
            <p class="font-decoration text-white/30">連絡先</p>
            <p
              class="text-xs text-white/40 max-w-xs font-display leading-relaxed"
            >
              Open to freelance projects, full-time opportunities, and
              collaborations. Response time: Usually within 24 hours.
            </p>
          </div>
        </div>
      </section>

      <!-- Contact Methods -->
      <section class="space-y-8">
        <div
          v-for="(contact, index) in contacts"
          :key="contact.id"
          :id="contact.id"
          class="relative group"
        >
          <!-- Side indicator -->
          <div
            class="absolute -left-4 top-0 bottom-0 w-px bg-white/10 origin-top scale-y-0 transition-transform group-hover:scale-y-100 duration-500"
          ></div>

          <!-- Number indicator -->
          <div class="flex items-center gap-4 mb-4">
            <div class="h-px flex-1 bg-white/10"></div>
            <span class="text-4xl font-display text-white/10 font-bold">{{
              String(index + 1).padStart(2, "0")
            }}</span>
          </div>

          <!-- Contact Card -->
          <a
            :href="contact.href"
            target="_blank"
            rel="noopener noreferrer"
            class="block bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-white/30 transition-all duration-500 group/card"
            @mouseenter="hoveredContact = contact.id"
            @mouseleave="hoveredContact = null"
          >
            <div class="flex flex-col md:flex-row md:items-center gap-6">
              <!-- Icon -->
              <div
                class="w-16 h-16 flex items-center justify-center bg-white/5 rounded-lg border border-white/10 group-hover/card:border-white/30 transition-colors"
              >
                <UIcon
                  :name="contact.icon"
                  class="w-8 h-8 text-white group-hover/card:scale-110 transition-transform"
                />
              </div>

              <!-- Content -->
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-xl font-display font-semibold text-white">
                    {{ contact.label }}
                  </h3>
                  <span class="text-sm font-decoration text-white/40">{{
                    contact.japanese
                  }}</span>
                </div>
                <p class="text-sm text-white/60 font-display mb-2">
                  {{ contact.description }}
                </p>
                <div
                  class="flex items-center gap-2 text-white group-hover/card:text-white/80"
                >
                  <span class="font-display font-medium">{{
                    contact.value
                  }}</span>
                  <LucideExternalLink
                    :size="16"
                    class="opacity-0 group-hover/card:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            </div>

            <!-- Hover indicator -->
            <div
              class="mt-6 h-1 bg-white/10 rounded-full overflow-hidden"
              :class="
                hoveredContact === contact.id ? 'opacity-100' : 'opacity-0'
              "
            >
              <div
                class="h-full bg-white transition-all duration-500"
                :style="{
                  width: hoveredContact === contact.id ? '100%' : '0%',
                }"
              ></div>
            </div>
          </a>
        </div>
      </section>

      <!-- Quick Info Section -->
      <section class="relative group">
        <div
          class="absolute -left-4 top-0 bottom-0 w-px bg-white/10 origin-top scale-y-0 transition-transform group-hover:scale-y-100 duration-500"
        ></div>

        <div
          class="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
        >
          <h3 class="text-2xl font-display font-bold text-white mb-6">
            Quick Info
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Location -->
            <div>
              <div class="flex items-center gap-2 mb-2">
                <LucideMapPin :size="16" class="text-white/40" />
                <p class="text-xs uppercase text-white/40 font-display">
                  Location
                </p>
              </div>
              <p class="text-white font-display">Yogyakarta, Indonesia</p>
            </div>

            <!-- Timezone -->
            <div>
              <div class="flex items-center gap-2 mb-2">
                <LucideClock :size="16" class="text-white/40" />
                <p class="text-xs uppercase text-white/40 font-display">
                  Timezone
                </p>
              </div>
              <p class="text-white font-display">WIB (UTC+7)</p>
            </div>

            <!-- Response Time -->
            <div>
              <div class="flex items-center gap-2 mb-2">
                <LucideMessageSquare :size="16" class="text-white/40" />
                <p class="text-xs uppercase text-white/40 font-display">
                  Response Time
                </p>
              </div>
              <p class="text-white font-display">Within 24 hours</p>
            </div>

            <!-- Availability -->
            <div>
              <div class="flex items-center gap-2 mb-2">
                <LucideCalendar :size="16" class="text-white/40" />
                <p class="text-xs uppercase text-white/40 font-display">
                  Availability
                </p>
              </div>
              <div class="flex items-center gap-2">
                <span
                  class="w-2 h-2 bg-green-400 rounded-full animate-pulse"
                ></span>
                <p class="text-white font-display">Open for opportunities</p>
              </div>
            </div>
          </div>

          <!-- Call to Action -->
          <div class="mt-8 pt-6 border-t border-white/10">
            <p class="text-sm text-white/60 font-display mb-4">
              Prefer a quick chat? Pick the method that works best for you
              above. I typically respond faster to email for detailed
              discussions.
            </p>
            <div class="flex flex-wrap gap-3">
              <a
                href="mailto:shafwan@yourdomain.com"
                class="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg text-sm font-display font-semibold hover:bg-white/90 transition-colors"
              >
                Send Email
                <LucideMail :size="16" />
              </a>
              <a
                href="/cv.pdf"
                target="_blank"
                class="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white rounded-lg text-sm font-display hover:bg-white/10 transition-colors"
              >
                <LucideDownload :size="16" />
                Download CV
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
