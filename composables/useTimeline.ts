interface TimelineItem {
  title: string;
  description: string;
  date: string;
  concurrent?: boolean;
}

export const useTimeline = () => {
  const timeline = ref<TimelineItem[]>([
    {
      title: "Code Reviewer",
      description:
        "Mentored developers through rigorous code reviews, enforcing scalable architecture and secure coding standards.",
      date: "Sep 2025 - Present",
      concurrent: true,
    },
    {
      title: "Full Stack Developer Intern",
      description:
        "Engineered and deployed production-ready features. Optimized database queries and improved system latency.",
      date: "Jul 2025 – Present",
      concurrent: true,
    },
    {
      title: "MTCNA Certification",
      description:
        "Achieved certification in network routing, firewall configurations, and secure system administration.",
      date: "May 2025",
    },
    {
      title: "DBS Camp",
      description:
        "Developed comprehensive full-stack applications, focusing on performance optimization and modern web standards.",
      date: "Jan 2025 – Apr 2025",
    },
    {
      title: "SIJA",
      description:
        "Established foundational knowledge in software engineering, system integration, and network architectures.",
      date: "2022 - Present",
    },
  ]);

  return { timeline };
};
