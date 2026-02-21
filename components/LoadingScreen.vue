<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import gsap from "gsap";

const props = defineProps<{
  visible: boolean;
  closing: boolean;
}>();

const emit = defineEmits<{
  (e: "opened"): void;
  (e: "closeDone"): void;
}>();

// Template
const overlay    = ref<HTMLElement | null>(null);
const bg         = ref<HTMLElement | null>(null);
const lineTop    = ref<HTMLElement | null>(null);
const lineBottom = ref<HTMLElement | null>(null);
const content    = ref<HTMLElement | null>(null);

// Progress bar 
const progress = ref(0);
let tickTimer: ReturnType<typeof setTimeout> | null = null;

function startProgress(): Promise<void> {
  return new Promise((resolve) => {
    progress.value = 0;
    if (tickTimer) clearTimeout(tickTimer);
    const increments = [15, 30, 85, 95, 100];
    let i = 0;
    const tick = () => {
      if (i < increments.length) {
        progress.value = increments[i];
        i++;
        if (progress.value === 100) {
          // Brief pause so user sees 100% before opening
          tickTimer = setTimeout(resolve, 280);
        } else {
          tickTimer = setTimeout(tick, i < 4 ? 120 : i < 6 ? 200 : 300);
        }
      }
    };
    tickTimer = setTimeout(tick, 80);
  });
}

function animateClose() {
  if (!lineTop.value || !lineBottom.value || !bg.value || !content.value) return;

  gsap.set(content.value, { opacity: 0, y: 8 });
  gsap.set(bg.value,      { opacity: 0 });
  gsap.set(lineTop.value,    { top: "0%" });
  gsap.set(lineBottom.value, { top: "100%" });

  const tl = gsap.timeline({ onComplete: () => emit("closeDone") });

  tl.to(lineTop.value,
    { top: "50%", duration: 0.75, ease: "power3.inOut" }, 0);
  tl.to(lineBottom.value,
    { top: "50%", duration: 0.75, ease: "power3.inOut" }, 0);
  tl.to(bg.value,
    { opacity: 1, duration: 0.55, ease: "power2.inOut" }, 0.18);
}

async function animateOpen() {
  if (!lineTop.value || !lineBottom.value || !content.value) return;

  // Wait until progress bar reaches 100% (and brief pause at 100)
  await startProgress();

  const tl = gsap.timeline({ onComplete: () => emit("opened") });

  tl.to(lineTop.value,
    { top: "25%", duration: 0.65, ease: "power3.inOut" });
  tl.to(lineBottom.value,
    { top: "75%", duration: 0.65, ease: "power3.inOut" }, "<");
  tl.to(content.value,
    { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.15");
}


onMounted(() => {
  if (props.closing) {
    animateClose();
  } else {
    // Initial page load 
    gsap.set(lineTop.value,    { top: "25%" });
    gsap.set(lineBottom.value, { top: "75%" });
    gsap.set(bg.value,         { opacity: 1 });
    gsap.set(content.value,    { opacity: 1, y: 0 });
    startProgress(); 
  }
});

watch(
  () => props.closing,
  (val) => {
    if (val) animateClose();
    else     animateOpen();
  }
);
</script>

<template>
  <!-- v-show so refs are always available when GSAP runs -->
  <div
    v-show="visible"
    ref="overlay"
    class="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
  >
    <!-- Background (opacity animated by GSAP on close) -->
    <div ref="bg" class="absolute inset-0 bg-primary" style="opacity: 1"></div>

    <!-- Texture overlay -->
    <div
      class="absolute inset-0 pointer-events-none"
      style="
        background: url('/texture.png') repeat;
        opacity: 0.08;
        mix-blend-mode: overlay;
      "
    ></div>

    <!-- Radial glow -->
    <div
      class="absolute rounded-full opacity-40 pointer-events-none"
      style="
        width: 600px;
        height: 600px;
        background: radial-gradient(circle, #242424, transparent);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      "
    ></div>

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
      class="relative z-10 flex flex-col items-center gap-10 select-none"
      style="opacity: 0"
    >
      <!-- Japanese + Latin title -->
      <div class="flex items-start gap-1">
        <span
          class="font-decoration text-white"
          style="
            writing-mode: vertical-rl;
            text-orientation: upright;
            font-size: 2rem;
            letter-spacing: 0.1em;
          "
        >
          ポルトフォリオ
        </span>
        <span
          class="font-display text-white/40 uppercase"
          style="
            writing-mode: vertical-lr;
            font-size: 0.6rem;
            letter-spacing: 0.15em;
            padding: 0 4px;
          "
        >
          portofolio
        </span>
      </div>

      <!-- Monogram -->
      <div class="flex items-baseline gap-1">
        <span
          class="font-decoration bg-white text-black font-semibold px-2 leading-tight text-4xl"
        >
          S.
        </span>
        <span class="font-display text-white text-3xl tracking-wider">
          Ilham Dzaky
        </span>
      </div>

      <!-- Progress bar -->
      <div class="flex flex-col items-center gap-3 w-48">
        <div class="w-full h-px bg-white/10 relative overflow-hidden rounded-full">
          <div
            class="absolute left-0 top-0 h-full bg-white transition-all duration-300 ease-out rounded-full"
            :style="{ width: progress + '%' }"
          ></div>
        </div>
        <div class="flex justify-between w-full">
          <span class="font-display text-white/30 uppercase tracking-widest text-xs">
            Loading
          </span>
          <span class="font-display text-white/30 text-xs tabular-nums">
            {{ progress }}%
          </span>
        </div>
      </div>

      <!-- Decorative separator -->
      <div class="flex items-center gap-4 w-48">
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

