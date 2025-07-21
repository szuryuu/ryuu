import { gsap } from "gsap";
import { nextTick } from "vue";

export const useGSAP = () => {
  const initScrollTrigger = async (callback: () => void) => {
    if (import.meta.client) {
      await nextTick();
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      callback();
    }
  };

  return { initScrollTrigger };
};
