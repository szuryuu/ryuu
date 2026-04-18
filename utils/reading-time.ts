export function getReadingTimeLabel(body: unknown): string {
  const wordCount = JSON.stringify(body ?? "").split(/\s+/).length;
  const minutes = Math.max(1, Math.round(wordCount / READING_SPEED_WPM));
  return `${minutes} min read`;
}
