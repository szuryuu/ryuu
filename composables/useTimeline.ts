interface TimelineItem {
  title: string;
  description: string;
  date: string;
}

export const useTimeline = () => {
  const timeline = ref<TimelineItem[]>([
    {
      title: "SIJA",
      description: "Studied Software Engineering",
      date: "2022",
    },
    {
      title: "DBS Camp",
      description: "Completed advanced web training",
      date: "Jan 2025 – Apr 2025",
    },
    {
      title: "MTCNA",
      description: "Earned MikroTik network certification",
      date: "May 2025",
    },
    {
      title: "Internship",
      description: "Full Stack Developer Intern",
      date: "Jul 2025 – Present",
    },
    {
      title: "Code Reviewer",
      description: "Mentoring developers via reviews",
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
