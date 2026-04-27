export type TaskStatus = "todo" | "in_progress" | "done";
export type PlanVisibility = "private" | "link_view" | "link_edit";

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  priority: "low" | "normal" | "urgent";
};

export type Note = {
  id: string;
  title: string;
  body: string;
  dueDate: string;
  reminderAt?: string;
  tasks: Task[];
};

export type Folder = {
  id: string;
  name: string;
  type: "day" | "week" | "custom";
  notes: Note[];
};

export type Plan = {
  id: string;
  title: string;
  visibility: PlanVisibility;
  shareToken: string;
  folders: Folder[];
};
