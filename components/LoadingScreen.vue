<script setup lang="ts">
import gsap from "gsap";

const props = defineProps<{
  visible: boolean;
  closing: boolean;
  isInitialLoad: boolean;
}>();

const emit = defineEmits<{
  (e: "opened"): void;
  (e: "closeDone"): void;
}>();

const bg = ref<HTMLElement | null>(null);
const lineTop = ref<HTMLElement | null>(null);
const lineBottom = ref<HTMLElement | null>(null);
const content = ref<HTMLElement | null>(null);

const progress = ref(0);

let progressTween: gsap.core.Tween | null = null;
let activeTimeline: gsap.core.Timeline | null = null;
let isMounted = false;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function killActive() {
  activeTimeline?.kill();
  activeTimeline = null;
}

function startProgress(): Promise<void> {
  return new Promise((resolve) => {
    progress.value = 0;
    progressTween?.kill();

    if (prefersReducedMotion()) {
      progress.value = 100;
      resolve();
      return;
    }

    const proxy = { value: 0 };
    progressTween = gsap.to(proxy, {
      value: 100,
      duration: LOADING_PROGRESS_DURATION_S,
      ease: "power1.inOut",
      onUpdate() {
        progress.value = Math.round(proxy.value);
      },
      onComplete() {
        progress.value = 100;
        setTimeout(resolve, LOADING_PROGRESS_SETTLE_DELAY_MS);
      },
    });
  });
}

function animateClose() {
  if (!lineTop.value || !lineBottom.value || !bg.value || !content.value) return;

  killActive();

  const reduced = prefersReducedMotion();

  gsap.set(content.value, { opacity: 0, y: 8 });
  gsap.set(bg.value, { opacity: 0 });
  gsap.set(lineTop.value, { top: "0%" });
  gsap.set(lineBottom.value, { top: "100%" });

  activeTimeline = gsap.timeline({ onComplete: () => emit("closeDone") });
  activeTimeline.to(lineTop.value, { top: "50%", duration: reduced ? 0 : 0.75, ease: "power3.inOut" }, 0);
  activeTimeline.to(lineBottom.value, { top: "50%", duration: reduced ? 0 : 0.75, ease: "power3.inOut" }, 0);
  activeTimeline.to(bg.value, { opacity: 1, duration: reduced ? 0 : 0.55, ease: "power2.inOut" }, reduced ? 0 : 0.18);
}

async function animateOpen() {
  if (!lineTop.value || !lineBottom.value || !content.value) return;

  killActive();

  const reduced = prefersReducedMotion();

  if (props.isInitialLoad) {
    await startProgress();

    if (!isMounted) return;

    activeTimeline = gsap.timeline({ onComplete: () => emit("opened") });
    activeTimeline.to(content.value, { opacity: 0, y: -8, duration: reduced ? 0 : 0.3, ease: "power2.in" });
    activeTimeline.to(lineTop.value, { top: "-2px", duration: reduced ? 0 : 0.65, ease: "power3.inOut" }, "-=0.05");
    activeTimeline.to(lineBottom.value, { top: "calc(100% + 2px)", duration: reduced ? 0 : 0.65, ease: "power3.inOut" }, "<");
    activeTimeline.to(bg.value, { opacity: 0, duration: reduced ? 0 : 0.55, ease: "power2.inOut" }, "<+0.1");
  } else {
    activeTimeline = gsap.timeline({ onComplete: () => emit("opened") });
    activeTimeline.to(lineTop.value, { top: "25%", duration: reduced ? 0 : 0.65, ease: "power3.inOut" });
    activeTimeline.to(lineBottom.value, { top: "75%", duration: reduced ? 0 : 0.65, ease: "power3.inOut" }, "<");
    activeTimeline.to(content.value, { opacity: 1, y: 0, duration: reduced ? 0 : 0.4, ease: "power2.out" }, "-=0.15");
  }
}

onMounted(() => {
  isMounted = true;
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

onUnmounted(() => {
  isMounted = false;
  progressTween?.kill();
  killActive();
});

watch(
  () => props.closing,
  (val) => {
    if (val) animateClose();
    else animateOpen();
  },
);
</script>

<template>
  <div
    v-show="visible"
    class="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
  >
    <div ref="bg" class="absolute inset-0 bg-primary" style="opacity: 1"></div>

    <div
      class="absolute inset-0 pointer-events-none"
      style="background: url('/texture.png') repeat; opacity: 0.08; mix-blend-mode: overlay;"
    ></div>

    <div class="absolute inset-0 z-0 pointer-events-none">
      <Circle />
    </div>

    <div ref="lineTop" class="curtain-line">
      <div class="line-inner"></div>
    </div>

    <div ref="lineBottom" class="curtain-line">
      <div class="line-inner"></div>
    </div>

    <div
      ref="content"
      class="relative z-10 flex flex-col items-center select-none px-4"
      style="opacity: 0; gap: clamp(1.5rem, 4vw, 2.5rem)"
    >
      <NuxtImg src="/logo.webp" alt="logo" width="96" height="96" class="w-24 h-24" format="webp" />

      <div class="flex flex-col items-center gap-3" style="width: clamp(10rem, 40vw, 12rem)">
        <div class="w-full h-px bg-white/10 relative overflow-hidden rounded-full">
          <div
            class="absolute left-0 top-0 h-full bg-white rounded-full"
            :style="{ width: progress + '%', transition: 'width 0.08s linear' }"
          ></div>
        </div>
        <div class="flex justify-between w-full">
          <span class="font-display text-white/30 uppercase tracking-widest text-xs">Loading</span>
          <span class="font-display text-white/30 text-xs tabular-nums">{{ progress }}%</span>
        </div>
      </div>

      <div class="flex items-center gap-4" style="width: clamp(10rem, 40vw, 12rem)">
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
}

.line-inner {
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.18);
}
</style>
