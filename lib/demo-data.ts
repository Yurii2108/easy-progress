import type { Plan } from "./types";

export const demoPlan: Plan = {
  id: "demo-plan",
  title: "Today focus",
  visibility: "private",
  shareToken: "demo",
  folders: [
    {
      id: "today",
      name: "Today",
      type: "day",
      notes: [
        {
          id: "n1",
          title: "English writing",
          body: "Novel analysis essay. Start with thesis, then evidence.",
          dueDate: "2026-04-27",
          tasks: [
            { id: "t1", title: "Write thesis", status: "done", priority: "normal" },
            { id: "t2", title: "Collect 3 quotes", status: "in_progress", priority: "urgent" },
            { id: "t3", title: "Draft conclusion", status: "todo", priority: "normal" }
          ]
        }
      ]
    },
    {
      id: "week",
      name: "This week",
      type: "week",
      notes: [
        {
          id: "n2",
          title: "Research project",
          body: "Part 1 + Part 2.",
          dueDate: "2026-04-28",
          tasks: [
            { id: "t4", title: "Research Part 1", status: "todo", priority: "normal" },
            { id: "t5", title: "Research Part 2", status: "todo", priority: "normal" }
          ]
        }
      ]
    }
  ]
};
