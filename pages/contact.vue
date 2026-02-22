<script setup lang="ts">
import { ref, onMounted } from "vue";
import { usePageEnter } from "~/composables/usePageEnter";

// Handles page enter animation effect
const pageRef = usePageEnter({ y: 20, duration: 0.6 });

// Contact information for sidebar and cards
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

// Tracks which contact card is currently hovered
const hoveredContact = ref<string | null>(null);

// Guestbook entry structure including optional avatar_url
interface GuestEntry {
  id: string;
  name: string;
  message: string;
  avatar_url?: string;
  created_at: string;
}

// Stores guestbook entries
const entries = ref<GuestEntry[]>([]);
// Indicates loading state for guestbook entries
const loadingList = ref(true);
// Indicates if guestbook form is submitting
const submitting = ref(false);
// Indicates if guestbook submission was successful
const submitDone = ref(false);
// Stores error message for guestbook submission
const submitError = ref("");

// Guestbook form state
const form = ref({ message: "" });

// Supabase client and user for authentication
const supabase = useSupabaseClient();
const user = useSupabaseUser();

// Formats entry date for display
function formatEntryDate(dt: string) {
  return new Date(dt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Fetches guestbook entries from API
async function fetchEntries() {
  loadingList.value = true;
  try {
    entries.value = await $fetch<GuestEntry[]>("/api/guestbook");
  } catch {
    // Ignore fetch error on initial load
  } finally {
    loadingList.value = false;
  }
}

// Initiates GitHub OAuth login via Supabase
async function loginWithGithub() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${window.location.origin}/contact`,
    },
  });
  if (error) console.error(error);
}

// Logs out current user from Supabase
async function logout() {
  await supabase.auth.signOut();
}

// Handles guestbook form submission and error/success state
async function handleSubmit() {
  submitError.value = "";
  if (!form.value.message.trim()) {
    submitError.value = "Message cannot be empty.";
    return;
  }

  submitting.value = true;
  try {
    const entry = await $fetch<GuestEntry>("/api/guestbook", {
      method: "POST",
      body: {
        message: form.value.message.trim(),
      },
    });
    entries.value.unshift(entry);
    form.value = { message: "" };
    submitDone.value = true;
    setTimeout(() => (submitDone.value = false), 3000);
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } };
    submitError.value =
      err?.data?.message ?? "Something went wrong. Try again.";
  } finally {
    submitting.value = false;
  }
}

// Runs fetchEntries when component is mounted
onMounted(() => fetchEntries());
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
          <a
            href="#guestbook"
            class="text-white/40 hover:text-white transition-colors flex items-center gap-3 group uppercase"
          >
            <span
              class="w-8 h-px bg-white/20 group-hover:w-12 transition-all"
            ></span>
            Guestbook
          </a>
        </nav>
      </div>
    </aside>

    <!-- Main -->
    <main class="w-full lg:min-w-5xl max-w-5xl space-y-12 pb-32 mx-auto">
      <!-- Header -->
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
              collaborations. Response time: usually within 24 hours.
            </p>
          </div>
        </div>
      </section>

      <!-- Contact cards -->
      <section class="space-y-8">
        <div
          v-for="(contact, index) in contacts"
          :key="contact.id"
          :id="contact.id"
          class="relative group"
        >
          <div
            class="absolute -left-4 top-0 bottom-0 w-px bg-white/10 origin-top scale-y-0 transition-transform group-hover:scale-y-100 duration-500"
          ></div>

          <div class="flex items-center gap-4 mb-4">
            <div class="h-px flex-1 bg-white/10"></div>
            <span class="text-4xl font-display text-white/10 font-bold">{{
              String(index + 1).padStart(2, "0")
            }}</span>
          </div>

          <a
            :href="contact.href"
            target="_blank"
            rel="noopener noreferrer"
            class="block bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-white/30 transition-all duration-500 group/card"
            @mouseenter="hoveredContact = contact.id"
            @mouseleave="hoveredContact = null"
          >
            <div class="flex flex-col md:flex-row md:items-center gap-6">
              <div
                class="w-16 h-16 flex items-center justify-center bg-white/5 rounded-lg border border-white/10 group-hover/card:border-white/30 transition-colors"
              >
                <UIcon
                  :name="contact.icon"
                  class="w-8 h-8 text-white group-hover/card:scale-110 transition-transform"
                />
              </div>

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
                <div class="flex items-center gap-2 text-white">
                  <span class="font-display font-medium">{{
                    contact.value
                  }}</span>
                  <LucideExternalLink
                    class="w-4 h-4 opacity-0 group-hover/card:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            </div>

            <div
              class="mt-6 h-px bg-white/10 rounded-full overflow-hidden"
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

      <!-- Quick info -->
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
            <div>
              <div class="flex items-center gap-2 mb-2">
                <LucideMapPin class="w-4 h-4 text-white/40" />
                <p class="text-xs uppercase text-white/40 font-display">
                  Location
                </p>
              </div>
              <p class="text-white font-display">Yogyakarta, Indonesia</p>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-2">
                <LucideClock class="w-4 h-4 text-white/40" />
                <p class="text-xs uppercase text-white/40 font-display">
                  Timezone
                </p>
              </div>
              <p class="text-white font-display">WIB (UTC+7)</p>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-2">
                <LucideMessageSquare class="w-4 h-4 text-white/40" />
                <p class="text-xs uppercase text-white/40 font-display">
                  Response Time
                </p>
              </div>
              <p class="text-white font-display">Within 24 hours</p>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-2">
                <LucideCalendar class="w-4 h-4 text-white/40" />
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

          <div class="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-3">
            <a
              href="mailto:ilhamdzaky@gmail.com"
              class="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg text-sm font-display font-semibold hover:bg-white/90 transition-colors"
            >
              Send Email
              <LucideMail class="w-4 h-4" />
            </a>
            <a
              href="/cv.pdf"
              target="_blank"
              class="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white rounded-lg text-sm font-display hover:bg-white/10 transition-colors"
            >
              <LucideDownload class="w-4 h-4" />
              Download CV
            </a>
          </div>
        </div>
      </section>

      <!-- Guestbook divider -->
      <div id="guestbook" class="flex items-center gap-6 pt-8">
        <div class="flex-1 h-px bg-white/10"></div>
        <span class="font-decoration text-white/25 text-2xl">芳名帳</span>
        <div class="flex-1 h-px bg-white/10"></div>
      </div>

      <!-- Guestbook section -->
      <section class="relative group space-y-8">
        <div
          class="absolute -left-4 top-0 bottom-0 w-px bg-white/10 origin-top scale-y-0 transition-transform group-hover:scale-y-100 duration-500"
        ></div>

        <!-- Section header -->
        <div>
          <h2
            class="text-xs font-display text-white/40 uppercase tracking-widest mb-2 pl-4"
          >
            Guestbook
          </h2>
          <p class="text-xs text-white/30 font-display pl-4">
            You were here. Leave a mark.
          </p>
        </div>

        <!-- Submit form -->
        <div
          class="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <div class="flex items-center justify-between mb-5">
            <h3
              class="text-sm font-display font-semibold text-white uppercase tracking-wider"
            >
              Sign the Guestbook
            </h3>
            <button
              v-if="user"
              @click="logout"
              class="text-xs text-red-400 hover:text-red-300 font-display transition-colors"
            >
              Sign Out
            </button>
          </div>

          <div v-if="!user" class="text-center py-6">
            <p class="text-sm font-display text-white/50 mb-4">
              You must be logged in to sign the guestbook. This keeps the bots
              away.
            </p>
            <button
              @click="loginWithGithub"
              class="inline-flex items-center gap-3 px-6 py-3 bg-white text-black rounded-lg text-xs font-display font-semibold hover:bg-white/90 transition-all"
            >
              <LucideGithub class="w-4 h-4" />
              Sign in with GitHub
            </button>
          </div>

          <div v-else class="space-y-4">
            <div class="flex items-center gap-3 mb-4">
              <img
                :src="user.user_metadata.avatar_url"
                class="w-8 h-8 rounded-full bg-white/10"
                alt="Avatar"
              />
              <span class="text-sm font-display text-white"
                >Signing in as
                <strong>{{
                  user.user_metadata.full_name || user.user_metadata.user_name
                }}</strong></span
              >
            </div>

            <div>
              <textarea
                v-model="form.message"
                maxlength="300"
                rows="3"
                placeholder="Leave a note, thought, or just say hi."
                class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm font-display text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors resize-none"
                :disabled="submitting"
              ></textarea>
              <p class="text-right text-[10px] font-display text-white/20 mt-1">
                {{ form.message.length }} / 300
              </p>
            </div>

            <p v-if="submitError" class="text-xs font-display text-red-400">
              {{ submitError }}
            </p>

            <Transition name="fade-up">
              <p
                v-if="submitDone"
                class="text-xs font-display text-green-400 flex items-center gap-2"
              >
                <LucideCheck class="w-3.5 h-3.5" />
                Your message has been recorded. ありがとう。
              </p>
            </Transition>

            <button
              @click="handleSubmit"
              :disabled="submitting"
              class="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg text-xs font-display font-semibold hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <LucideLoader2
                v-if="submitting"
                class="w-3.5 h-3.5 animate-spin"
              />
              {{ submitting ? "Signing..." : "Sign Guestbook" }}
            </button>
          </div>
        </div>

        <div>
          <div v-if="loadingList" class="space-y-3">
            <div
              v-for="i in 3"
              :key="i"
              class="h-14 rounded-lg bg-white/5 animate-pulse"
            ></div>
          </div>

          <div
            v-else-if="entries.length === 0"
            class="py-12 text-center border border-white/5 rounded-xl"
          >
            <p class="font-decoration text-white/20 text-xl mb-1">
              まだ誰もいない
            </p>
            <p class="text-xs font-display text-white/25">
              Be the first to sign.
            </p>
          </div>

          <div v-else class="flex flex-col">
            <div
              v-for="entry in entries"
              :key="entry.id"
              class="group/entry flex items-start gap-4 py-5 border-b border-white/8 hover:border-white/15 transition-colors"
            >
              <img
                v-if="entry.avatar_url"
                :src="entry.avatar_url"
                :alt="entry.name"
                class="w-8 h-8 rounded-full bg-white/10 border border-white/15 shrink-0 mt-0.5 object-cover"
              />
              <div
                v-else
                class="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-xs font-display text-white/60 shrink-0 mt-0.5 uppercase"
              >
                {{ entry.name.charAt(0) }}
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-baseline gap-3 mb-1">
                  <span class="text-sm font-display font-semibold text-white">
                    {{ entry.name }}
                  </span>
                  <span class="text-[11px] font-display text-white/25">
                    {{ formatEntryDate(entry.created_at) }}
                  </span>
                </div>
                <p class="text-sm text-white/55 font-display leading-relaxed">
                  {{ entry.message }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.fade-up-enter-active,
.fade-up-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
