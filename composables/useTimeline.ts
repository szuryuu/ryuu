interface TimelineItem {
  title: string;
  description: string;
  date: string;
}

export const useTimeline = () => {
  const timeline = ref<TimelineItem[]>([
    {
      title: "SIJA",
      description: "Vocational school in software engineering",
      date: "2022",
    },
    {
      title: "DBS Camp",
      description: "Advanced web dev training",
      date: "Jan 2025 – Apr 2025",
    },
    {
      title: "Internship",
      description: "Full Stack at Botika",
      date: "Jul 2025 – Present",
    },
  ]);

  return { timeline };
};
