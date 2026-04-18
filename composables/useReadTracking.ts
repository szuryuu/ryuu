import type { Ref } from "vue";

export function useReadTracking(
  slug: string,
  body: unknown,
  scrollPercent: Ref<number>,
) {
  const supabase = useSupabaseClient();
  const readCount = ref(0);

  let sessionStartTime = 0;
  let hasTrackedRead = false;

  function calculateMinReadTimeMs(): number {
    const wordCount = JSON.stringify(body ?? "").split(/\s+/).length;
    const minutes = Math.max(1, Math.round(wordCount / READING_SPEED_WPM));
    return minutes * 60000 * READ_THRESHOLD_TIME_RATIO;
  }

  async function fetchReadCount() {
    const { data } = await supabase
      .from("article_reads")
      .select("read_count")
      .eq("slug", slug)
      .single();
    if (data) readCount.value = data.read_count;
  }

  watch(scrollPercent, async (currentPercent) => {
    if (hasTrackedRead || !import.meta.client) return;

    const storageKey = `read_${slug}`;
    if (localStorage.getItem(storageKey)) {
      hasTrackedRead = true;
      return;
    }

    const timeElapsed = Date.now() - sessionStartTime;

    if (
      currentPercent >= READ_THRESHOLD_SCROLL_PERCENT &&
      timeElapsed >= calculateMinReadTimeMs()
    ) {
      hasTrackedRead = true;
      localStorage.setItem(storageKey, "true");
      await supabase.rpc("increment_read_count", { article_slug: slug });
      readCount.value++;
    }
  });

  onMounted(() => {
    sessionStartTime = Date.now();
    fetchReadCount();
  });

  return { readCount };
}
