import { ref, watch, onUnmounted } from "vue";
import gsap from "gsap";

interface PageEnterOptions {
  delay?: number;
  duration?: number;
  y?: number;
  fromOpacity?: number;
  ease?: string;
}

// usePageEnter animates a page element's entrance when the curtain opens.
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

  let tween: gsap.core.Tween | null = null;

  function runAnimation() {
    if (!pageRef.value) return;
    if (tween) tween.kill();

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

  const stop = watch(
    curtainOpen,
    (isOpen) => {
      if (isOpen) runAnimation();
    },
    { immediate: true },
  );

  onUnmounted(() => {
    stop();
    if (tween) tween.kill();
  });

  return pageRef;
}
