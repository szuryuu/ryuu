import { ref, computed } from "vue";

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  isMain: boolean;
  status: "ongoing" | "merged" | "standalone";
  color: string;
}

export const useTimeline = () => {
  const events = ref<TimelineEvent[]>([
    {
      id: "reviewer",
      title: "Code Reviewer",
      description:
        "Mentored developers through rigorous code reviews, enforcing scalable architecture and secure coding standards.",
      date: "Sep 2025 - Present",
      isMain: false,
      status: "ongoing",
      color: "bg-emerald-500",
    },
    {
      id: "intern",
      title: "Full Stack Developer Intern",
      description:
        "Engineered and deployed production-ready features. Optimized database queries and improved system latency.",
      date: "Jul 2025 – Present",
      isMain: false,
      status: "ongoing",
      color: "bg-emerald-500",
    },
    {
      id: "mtcna",
      title: "MTCNA Certification",
      description:
        "Achieved certification in network routing, firewall configurations, and secure system administration.",
      date: "May 2025",
      isMain: true,
      status: "standalone",
      color: "bg-white",
    },
    {
      id: "dbs",
      title: "DBS Camp",
      description:
        "Developed comprehensive full-stack applications, focusing on performance optimization and modern web standards.",
      date: "Jan 2025 – Apr 2025",
      isMain: false,
      status: "merged",
      color: "bg-sky-500",
    },
    {
      id: "sija",
      title: "SIJA",
      description:
        "Established foundational knowledge in software engineering, system integration, and network architectures.",
      date: "2022 - Present",
      isMain: true,
      status: "standalone",
      color: "bg-white",
    },
  ]);

  const linearTimeline = computed(() => {
    return [...events.value].slice(0, 3);
  });

  return { events, linearTimeline };
};
