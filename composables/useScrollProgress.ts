export function useScrollProgress() {
  const scrollPercent = ref(0);

  function updateScrollPercent() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const totalScrollable = scrollHeight - clientHeight;
    scrollPercent.value =
      totalScrollable > 0 ? (scrollTop / totalScrollable) * 100 : 0;
  }

  onMounted(() => {
    window.addEventListener("scroll", updateScrollPercent, { passive: true });
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", updateScrollPercent);
  });

  return { scrollPercent };
}
