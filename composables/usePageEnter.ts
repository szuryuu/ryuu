import { ref, watch, onUnmounted, onMounted } from "vue";
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
  const curtainOpen = useState<boolean>("curtainOpen");
  const hasNavigated = useState<boolean>("hasNavigated", () => false);

  let tween: gsap.core.Tween | null = null;

  function runAnimation() {
    if (!pageRef.value) return;
    if (tween) tween.kill();

    if (!hasNavigated.value) {
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

  const stopCurtain = watch(curtainOpen, (isOpen) => {
    if (isOpen && pageRef.value) runAnimation();
  });

  onMounted(() => {
    if (curtainOpen.value) {
      runAnimation();
    }
  });

  onUnmounted(() => {
    stopCurtain();
    if (tween) tween.kill();
  });

  return pageRef;
}
