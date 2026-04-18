import type { GuestEntry } from "~/types/guestbook";

export function useGuestbookEntries() {
  const entries = ref<GuestEntry[]>([]);
  const isLoading = ref(true);
  const fetchError = ref<string | null>(null);

  function prependEntry(entry: GuestEntry) {
    entries.value.unshift(entry);
  }

  async function fetchEntries() {
    isLoading.value = true;
    fetchError.value = null;

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      GUESTBOOK_FETCH_TIMEOUT_MS,
    );

    try {
      entries.value = await $fetch<GuestEntry[]>("/api/guestbook", {
        signal: controller.signal,
      });
    } catch (error: unknown) {
      const isAbortError =
        error instanceof DOMException && error.name === "AbortError";
      fetchError.value = isAbortError
        ? "Request timed out. Please refresh."
        : "Failed to load entries. Try refreshing.";
    } finally {
      clearTimeout(timeoutId);
      isLoading.value = false;
    }
  }

  onMounted(() => fetchEntries());

  return { entries, isLoading, fetchError, prependEntry };
}
