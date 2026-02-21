<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import Circle from "~/components/Circle.vue";
import gsap from "gsap";

// Props for controlling overlay visibility and animation state
const props = defineProps<{
  visible: boolean;
  closing: boolean;
  isInitialLoad: boolean;
}>();

// Emits for signaling open and close animation completion
const emit = defineEmits<{
  (e: "opened"): void;
  (e: "closeDone"): void;
}>();

// Overlay element refs for GSAP animation targets
const overlay = ref<HTMLElement | null>(null);
const bg = ref<HTMLElement | null>(null);
const lineTop = ref<HTMLElement | null>(null);
const lineBottom = ref<HTMLElement | null>(null);
const content = ref<HTMLElement | null>(null);

// Progress bar value and GSAP tween instance for smooth loading animation
const progress = ref(0);
let progressTween: gsap.core.Tween | null = null;

// Animates the progress bar from 0 to 100% with GSAP and resolves after a brief pause
function startProgress(): Promise<void> {
  return new Promise((resolve) => {
    progress.value = 0;
    if (progressTween) progressTween.kill();

    const proxy = { value: 0 }; // Proxy object for GSAP tween

    progressTween = gsap.to(proxy, {
      value: 100,
      duration: 2.2,
      ease: "power1.inOut",
      onUpdate() {
        progress.value = Math.round(proxy.value);
      },
      onComplete() {
        progress.value = 100;
        setTimeout(resolve, 320); // Pause at 100% for user feedback
      },
    });
  });
}

// Animates the curtain close effect and emits when done
function animateClose() {
  if (!lineTop.value || !lineBottom.value || !bg.value || !content.value)
    return;

  gsap.set(content.value, { opacity: 0, y: 8 });
  gsap.set(bg.value, { opacity: 0 });
  gsap.set(lineTop.value, { top: "0%" });
  gsap.set(lineBottom.value, { top: "100%" });

  const tl = gsap.timeline({ onComplete: () => emit("closeDone") });
  tl.to(lineTop.value, { top: "50%", duration: 0.75, ease: "power3.inOut" }, 0);
  tl.to(
    lineBottom.value,
    { top: "50%", duration: 0.75, ease: "power3.inOut" },
    0,
  );
  tl.to(bg.value, { opacity: 1, duration: 0.55, ease: "power2.inOut" }, 0.18);
}

// Animates the curtain open effect and emits when done
async function animateOpen() {
  if (!lineTop.value || !lineBottom.value || !content.value) return;

  if (props.isInitialLoad) {
    await startProgress(); // Wait for progress bar to finish

    const tl = gsap.timeline({ onComplete: () => emit("opened") });
    tl.to(content.value, {
      opacity: 0,
      y: -8,
      duration: 0.3,
      ease: "power2.in",
    }); // Fade out content
    tl.to(
      lineTop.value,
      { top: "-2px", duration: 0.65, ease: "power3.inOut" },
      "-=0.05",
    ); // Move top line off-screen
    tl.to(
      lineBottom.value,
      { top: "calc(100% + 2px)", duration: 0.65, ease: "power3.inOut" },
      "<",
    ); // Move bottom line off-screen
    tl.to(
      bg.value,
      { opacity: 0, duration: 0.55, ease: "power2.inOut" },
      "<+0.1",
    ); // Fade out background
  } else {
    const tl = gsap.timeline({ onComplete: () => emit("opened") });
    tl.to(lineTop.value, { top: "25%", duration: 0.65, ease: "power3.inOut" }); // Move top line to open position
    tl.to(
      lineBottom.value,
      { top: "75%", duration: 0.65, ease: "power3.inOut" },
      "<",
    ); // Move bottom line to open position
    tl.to(
      content.value,
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
      "-=0.15",
    ); // Show content
  }
}

// Handles initial mount and triggers open or close animation
onMounted(() => {
  if (props.closing) {
    animateClose();
  } else {
    gsap.set(lineTop.value, { top: "25%" });
    gsap.set(lineBottom.value, { top: "75%" });
    gsap.set(bg.value, { opacity: 1 });
    gsap.set(content.value, { opacity: 1, y: 0 });
    animateOpen();
  }
});

// Cleans up GSAP progress tween on component unmount
onUnmounted(() => {
  if (progressTween) progressTween.kill();
});

// Watches for closing prop changes and triggers corresponding animation
watch(
  () => props.closing,
  (val) => {
    if (val) animateClose();
    else animateOpen();
  },
);
</script>

<template>
  <!-- v-show keeps refs alive for GSAP -->
  <div
    v-show="visible"
    ref="overlay"
    class="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
  >
    <!-- Background -->
    <div ref="bg" class="absolute inset-0 bg-primary" style="opacity: 1"></div>

    <!-- Texture overlay -->
    <div
      class="absolute inset-0 pointer-events-none"
      style="
        background: url(&quot;/texture.png&quot;) repeat;
        opacity: 0.08;
        mix-blend-mode: overlay;
      "
    ></div>

    <!-- Radial glow — responsive via clamp -->
    <Circle class="fixed !z-0" />

    <!-- Line top -->
    <div ref="lineTop" class="curtain-line">
      <div class="line-inner"></div>
    </div>

    <!-- Line bottom -->
    <div ref="lineBottom" class="curtain-line">
      <div class="line-inner"></div>
    </div>

    <!-- Content -->
    <div
      ref="content"
      class="relative z-10 flex flex-col items-center select-none px-4"
      style="opacity: 0; gap: clamp(1.5rem, 4vw, 2.5rem)"
    >
      <!-- Japanese + Latin title -->
      <!-- <div class="flex items-start gap-1">
        <span
          class="font-decoration text-white"
          style="
            writing-mode: vertical-rl;
            text-orientation: upright;
            font-size: clamp(1.4rem, 4vw, 2rem);
            letter-spacing: 0.1em;
          "
        >
          ポルトフォリオ
        </span>
        <span
          class="font-display text-white/40 uppercase"
          style="
            writing-mode: vertical-lr;
            font-size: clamp(0.45rem, 1.2vw, 0.6rem);
            letter-spacing: 0.15em;
            padding: 0 4px;
          "
        >
          portofolio
        </span>
      </div> -->

      <!-- Monogram -->
      <!-- <div class="flex items-baseline gap-1">
        <span
          class="font-decoration bg-white text-black font-semibold px-2 leading-tight"
          style="font-size: clamp(1.75rem, 5vw, 2.25rem)"
        >
          S.
        </span>
        <span
          class="font-display text-white tracking-wider"
          style="font-size: clamp(1.25rem, 4vw, 1.875rem)"
        >
          Ilham Dzaky
        </span>
      </div> -->

      <img src="/logo.webp" alt="logo" class="w-24 h-24" />

      <!-- Progress bar — only meaningful during initial load -->
      <div
        class="flex flex-col items-center gap-3"
        style="width: clamp(10rem, 40vw, 12rem)"
      >
        <div
          class="w-full h-px bg-white/10 relative overflow-hidden rounded-full"
        >
          <div
            class="absolute left-0 top-0 h-full bg-white rounded-full"
            :style="{ width: progress + '%', transition: 'width 0.08s linear' }"
          ></div>
        </div>
        <div class="flex justify-between w-full">
          <span
            class="font-display text-white/30 uppercase tracking-widest text-xs"
          >
            Loading
          </span>
          <span class="font-display text-white/30 text-xs tabular-nums">
            {{ progress }}%
          </span>
        </div>
      </div>

      <!-- Decorative separator -->
      <div
        class="flex items-center gap-4"
        style="width: clamp(10rem, 40vw, 12rem)"
      >
        <div class="flex-1 h-px bg-white/10"></div>
        <span class="font-decoration text-white/20 text-xs">読み込み中</span>
        <div class="flex-1 h-px bg-white/10"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.curtain-line {
  position: absolute;
  left: 0;
  width: 100%;
  z-index: 20;
  /* top driven entirely by GSAP */
}

.line-inner {
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.18);
}
</style>
