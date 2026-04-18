import gsap from "gsap";

interface PageEnterOptions {
  delay?: number;
  duration?: number;
  y?: number;
  fromOpacity?: number;
  ease?: string;
}

export function usePageEnter(options: PageEnterOptions = {}) {
  const {
    delay = 0,
    duration = 0.55,
    y = 18,
    fromOpacity = 0,
    ease = "power2.out",
  } = options;

  const pageRef = ref<HTMLElement | null>(null);
  const curtainOpen = useState<boolean>("curtainOpen", () => true);
  const hasNavigated = useState<boolean>("hasNavigated", () => false);

  let tween: gsap.core.Tween | null = null;

  function runAnimation() {
    if (!pageRef.value) return;
    tween?.kill();

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!hasNavigated.value || reducedMotion) {
      gsap.set(pageRef.value, { clearProps: "all" });
      return;
    }

    tween = gsap.fromTo(
      pageRef.value,
      { opacity: fromOpacity, y },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease,
        clearProps: "opacity,transform",
      },
    );
  }

  const stopCurtainWatch = watch(curtainOpen, (isOpen) => {
    if (isOpen && pageRef.value) runAnimation();
  });

  onMounted(() => {
    if (curtainOpen.value) runAnimation();
  });

  onUnmounted(() => {
    stopCurtainWatch();
    tween?.kill();
  });

  return pageRef;
}
