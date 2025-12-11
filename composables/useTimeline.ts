interface TimelineItem {
  title: string;
  description: string;
  date: string;
}

export const useTimeline = () => {
  const timeline = ref<TimelineItem[]>([
    {
      title: "SIJA",
      description: "Started vocational school in Software Engineering",
      date: "2022",
    },
    {
      title: "DBS Camp",
      description: "Completed advanced web development training",
      date: "Jan 2025 – Apr 2025",
    },
    {
      title: "MTCNA",
      description:
        "Obtained MikroTik Certified Network Associate certification",
      date: "May 2025",
    },
    {
      title: "Internship",
      description: "Full Stack Developer Intern at Botika",
      date: "Jul 2025 – Present",
    },
    {
      title: "Code Reviewer",
      description: "Guiding new developers through code reviews at Dicoding",
      date: "Sep 2025 - Present",
    },
    // {
    //   title: "SIJA",
    //   description: "Graduated from vocational school in Software Engineering",
    //   date: "2026",
    // },
  ]);

  return { timeline };
};
