<template>
  <UApp>
    <LoadingScreen
      :visible="isLoading"
      :closing="isClosing"
      @opened="onCurtainOpened"
    />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!--
      Page reveal overlay — sibling to layout, NOT a parent of page content.
      Starts visible and GSAP fades it out so it never creates a stacking
      context that breaks position:fixed children (navbar etc).
    -->
    <div
      ref="pageReveal"
      class="fixed inset-0 pointer-events-none z-[9998]"
      style="opacity: 0; backdrop-filter: blur(0px); -webkit-backdrop-filter: blur(0px);"
    ></div>
  </UApp>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import gsap from "gsap";
import LoadingScreen from "~/components/LoadingScreen.vue";

const isLoading  = ref(true);
const isClosing  = ref(false);
const router     = useRouter();
const pageReveal = ref<HTMLElement | null>(null);

// ── Blur-in reveal ───────────────────────────────────────────────
// Overlay is a sibling — never a parent — so fixed elements are untouched.
// We flash it in instantly then animate it OUT to reveal the page.
function blurIn() {
  if (!pageReveal.value) return;

  // Instantly show the overlay with blur
  gsap.set(pageReveal.value, {
    opacity: 1,
    backdropFilter: "blur(16px)",
    webkitBackdropFilter: "blur(16px)",
    backgroundColor: "rgba(46,46,46,0.4)",
  });

  // Animate it away → page is revealed through a clearing blur
  gsap.to(pageReveal.value, {
    opacity: 0,
    backdropFilter: "blur(0px)",
    webkitBackdropFilter: "blur(0px)",
    backgroundColor: "rgba(46,46,46,0)",
    duration: 0.7,
    ease: "power2.out",
    onComplete: () => {
      // Reset so it's fully invisible and harmless
      if (pageReveal.value) {
        gsap.set(pageReveal.value, { opacity: 0, backdropFilter: "blur(0px)" });
      }
    },
  });
}

// ── Called by LoadingScreen when opening animation finishes ──────
function onCurtainOpened() {
  isLoading.value = false;
  nextTick(() => blurIn());
}

// ── Wait for all <img> on current page ──────────────────────────
function waitForImages(): Promise<void[]> {
  const images = Array.from(document.querySelectorAll("img"));
  if (images.length === 0) return Promise.resolve([]);
  return Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalHeight !== 0) return resolve();
          img.addEventListener("load",  () => resolve(), { once: true });
          img.addEventListener("error", () => resolve(), { once: true });
        })
    )
  );
}

// ── Initial load ─────────────────────────────────────────────────
onMounted(() => {
  const MIN_MS = 1200;
  const start  = Date.now();
  Promise.all([document.fonts.ready, waitForImages()]).then(() => {
    const remaining = Math.max(0, MIN_MS - (Date.now() - start));
    setTimeout(() => {
      isLoading.value = false;
      nextTick(() => blurIn());
    }, remaining);
  });
});

// ── Navigation ───────────────────────────────────────────────────
router.beforeEach(() => {
  isLoading.value = true;
  isClosing.value = true;
});

router.afterEach(() => {
  setTimeout(() => {
    const MIN_MS = 500;
    const start  = Date.now();
    Promise.all([document.fonts.ready, waitForImages()]).then(() => {
      const remaining = Math.max(0, MIN_MS - (Date.now() - start));
      setTimeout(() => {
        isClosing.value = false;
        // onCurtainOpened will fire when LoadingScreen finishes → blurIn
      }, remaining);
    });
  }, 50);
});
</script>
