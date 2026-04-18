<script setup lang="ts">
import type { GuestEntry } from "~/types/guestbook";

const emit = defineEmits<{
  submitted: [entry: GuestEntry];
}>();

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const messageText = ref("");
const isSubmitting = ref(false);
const showSuccessMessage = ref(false);
const submissionError = ref("");

async function initiateGithubLogin() {
  await supabase.auth.signInWithOAuth({
    provider: "github",
    options: { redirectTo: `${window.location.origin}/contact` },
  });
}

async function signOut() {
  await supabase.auth.signOut();
}

async function submitEntry() {
  submissionError.value = "";

  if (!messageText.value.trim()) {
    submissionError.value = "Message cannot be empty.";
    return;
  }

  isSubmitting.value = true;

  try {
    const entry = await $fetch<GuestEntry>("/api/guestbook", {
      method: "POST",
      body: { message: messageText.value.trim() },
    });
    emit("submitted", entry);
    messageText.value = "";
    showSuccessMessage.value = true;
    setTimeout(() => (showSuccessMessage.value = false), SUBMIT_SUCCESS_DISPLAY_MS);
  } catch (error: unknown) {
    const err = error as { data?: { message?: string } };
    submissionError.value = err?.data?.message ?? "Something went wrong. Try again.";
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-sm font-display font-semibold text-white uppercase tracking-wider">
        Sign the Guestbook
      </h3>
      <button
        v-if="user"
        @click="signOut"
        class="text-xs text-red-400 hover:text-red-300 font-display transition-colors"
      >
        Sign Out
      </button>
    </div>

    <div v-if="!user" class="text-center py-6">
      <p class="text-sm font-display text-white/50 mb-4">
        You must be logged in to sign the guestbook. This keeps the bots away.
      </p>
      <button
        @click="initiateGithubLogin"
        class="inline-flex items-center gap-3 px-6 py-3 bg-white text-black rounded-lg text-xs font-display font-semibold hover:bg-white/90 transition-all"
      >
        <LucideGithub class="w-4 h-4" />
        Sign in with GitHub
      </button>
    </div>

    <div v-else class="space-y-4">
      <div class="flex items-center gap-3 mb-4">
        <NuxtImg
          :src="user.user_metadata.avatar_url"
          :alt="user.user_metadata.full_name || user.user_metadata.user_name"
          class="w-8 h-8 rounded-full bg-white/10"
          width="32"
          height="32"
          format="webp"
        />
        <span class="text-sm font-display text-white">
          Signing in as
          <strong>{{ user.user_metadata.full_name || user.user_metadata.user_name }}</strong>
        </span>
      </div>

      <div>
        <textarea
          v-model="messageText"
          :maxlength="GUESTBOOK_MAX_MESSAGE_LENGTH"
          rows="3"
          placeholder="Leave a note, thought, or just say hi."
          class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm font-display text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors resize-none"
          :disabled="isSubmitting"
        ></textarea>
        <p class="text-right text-[10px] font-display text-white/20 mt-1">
          {{ messageText.length }} / {{ GUESTBOOK_MAX_MESSAGE_LENGTH }}
        </p>
      </div>

      <p v-if="submissionError" class="text-xs font-display text-red-400">
        {{ submissionError }}
      </p>

      <Transition name="fade-up">
        <p
          v-if="showSuccessMessage"
          class="text-xs font-display text-green-400 flex items-center gap-2"
        >
          <LucideCheck class="w-3.5 h-3.5" />
          Your message has been recorded. ありがとう。
        </p>
      </Transition>

      <button
        @click="submitEntry"
        :disabled="isSubmitting"
        class="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg text-xs font-display font-semibold hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <LucideLoader2 v-if="isSubmitting" class="w-3.5 h-3.5 animate-spin" />
        {{ isSubmitting ? "Signing..." : "Sign Guestbook" }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
