import { ref, onMounted, onUnmounted } from "vue";

export function useScrollSpy(sectionIds: string[], offset = "-80%") {
  const activeId = ref("");
  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeId.value = entry.target.id;
          }
        });
      },
      { rootMargin: `0px 0px ${offset} 0px`, threshold: 0.1 },
    );

    setTimeout(() => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer?.observe(el);
      });
    }, 500);
  });

  onUnmounted(() => {
    observer?.disconnect();
  });

  return { activeId };
}
