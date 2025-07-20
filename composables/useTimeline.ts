interface TimelineItem {
  title: string;
  description: string;
}

export const useTimeline = () => {
  const timeline = ref<TimelineItem[]>([
    {
      title: "2022",
      description: "Started working as a Full Stack Developer",
    },
    {
      title: "2022",
      description: "Graduated from University of XYZ",
    },
    {
      title: "2021",
      description: "Started learning Cyber Security",
    },
  ]);

  return { timeline };
};
