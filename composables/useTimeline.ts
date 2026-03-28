import { ref, computed } from "vue";

export interface TimelineRole {
  title: string;
  date: string;
  description: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  logo: string;
  roles: TimelineRole[];
  isMain: boolean;
  status: "ongoing" | "merged" | "standalone";
  color: string;
}

export const useTimeline = () => {
  const events = ref<TimelineEvent[]>([
    {
      id: "reviewer",
      title: "External Code Reviewer",
      logo: "/images/icons/dicoding.png",
      roles: [
        {
          title: "Front End Code Reviewer",
          date: "Sep 2025 - Present",
          description:
            "Mentored developers through rigorous code reviews, enforcing scalable architecture and secure coding standards.",
        },
      ],
      isMain: false,
      status: "ongoing",
      color: "bg-emerald-500",
    },
    {
      id: "intern",
      title: "Botika",
      logo: "/images/icons/botika.png",
      roles: [
        {
          title: "DevOps Engineer Intern",
          date: "Nov 2025 - Present",
          description:
            "Transitioned to DevOps. Managed CI/CD pipelines, automated server provisioning, and implemented infrastructure monitoring.",
        },
        {
          title: "Full Stack Developer Intern",
          date: "Jul 2025 – Augst 2025",
          description:
            "Engineered and deployed production-ready features. Optimized database queries and improved system latency.",
        },
      ],
      isMain: false,
      status: "ongoing",
      color: "bg-emerald-500",
    },
    {
      id: "mtcna",
      title: "MikroTik",
      logo: "/images/projects/mikrotik.png",
      roles: [
        {
          title: "MTCNA Certification",
          date: "May 2025",
          description:
            "Achieved certification in network routing, firewall configurations, and secure system administration.",
        },
      ],
      isMain: true,
      status: "standalone",
      color: "bg-white",
    },
    {
      id: "dbs",
      title: "DBS Foundation Coding Camp",
      logo: "/images/icons/dbs.png",
      roles: [
        {
          title: "Full Stack Web Developer",
          date: "Jan 2025 – Apr 2025",
          description:
            "Developed comprehensive full-stack applications, focusing on performance optimization and modern web standards.",
        },
      ],
      isMain: false,
      status: "merged",
      color: "bg-sky-500",
    },
    {
      id: "sija",
      title: "SMKN 2 DEPOK SLEMAN (SIJA)",
      logo: "/images/icons/stembayo.png",
      roles: [
        {
          title: "System Information, Network and Application",
          date: "2022 - Present",
          description:
            "Established foundational knowledge in software engineering, system integration, and network architectures.",
        },
      ],
      isMain: true,
      status: "standalone",
      color: "bg-white",
    },
  ]);

  const linearTimeline = computed(() => {
    return events.value
      .flatMap((event) =>
        event.roles.map((role) => ({
          title: role.title,
          description: role.description,
          date: role.date,
        })),
      )
      .slice(0, 3);
  });

  return { events, linearTimeline };
};
