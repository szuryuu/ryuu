import { ref, onMounted, onUnmounted, nextTick } from "vue";

export function useScrollSpy(sectionIds: string[]) {
  const activeId = ref("");
  let observer: IntersectionObserver | null = null;

  const handleBottom = () => {
    const scrollPosition = window.innerHeight + window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight;
    if (scrollPosition >= scrollHeight - 100) {
      activeId.value = sectionIds[sectionIds.length - 1];
    }
  };

  onMounted(async () => {
    await nextTick();

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeId.value = entry.target.id;
          }
        });
        handleBottom();
      },
      {
        rootMargin: "-25% 0px -40% 0px",
        threshold: 0,
      },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer?.observe(el);
    });

    window.addEventListener("scroll", handleBottom, { passive: true });
    handleBottom();
  });

  onUnmounted(() => {
    observer?.disconnect();
    window.removeEventListener("scroll", handleBottom);
  });

  return { activeId };
}
