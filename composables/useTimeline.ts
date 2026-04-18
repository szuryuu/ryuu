import { timelineEvents } from "~/data/timeline";
export type { TimelineRole, TimelineEvent } from "~/data/timeline";

export const useTimeline = () => {
  const events = ref(timelineEvents);

  const linearTimeline = computed(() =>
    events.value
      .flatMap((event) =>
        event.roles.map((role) => ({
          title: role.title,
          description: role.description,
          date: role.date,
        })),
      )
      .slice(0, 3),
  );

  return { events, linearTimeline };
};
