import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";

import { ListItem, ProjectItem, TaskItem, TaskStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(date: Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function sortListByPosition(a: ListItem, b: ListItem) {
  return a.position - b.position;
}

export function sortTasksByPosition(a: TaskItem, b: TaskItem) {
  return a.position - b.position;
}

export function shortenString(
  str: string | undefined,
  maxLength: number
): string | undefined {
  if (!str) return undefined;

  if (str.length <= maxLength) {
    return str;
  }

  return str.slice(0, maxLength - 3) + "...";
}

export function calculateProjectProgress(project: ProjectItem) {
  const totalTasks = project.lists.reduce(
    (acc, list) => acc + list.tasks.length,
    0
  );
  const completedTasks = project.lists.reduce(
    (acc, list) =>
      acc +
      list.tasks.filter((task) => task.status === TaskStatus.COMPLETED).length,
    0
  );

  return { totalTasks, completedTasks };
}

export const statusToListMap = {
  [TaskStatus.TODO]: "To Do",
  [TaskStatus.IN_PROGRESS]: "In Progress",
  [TaskStatus.BACKLOG]: "Backlog",
  [TaskStatus.COMPLETED]: "Completed",
};

export const listToStatusMap = {
  "To Do": TaskStatus.TODO,
  "In Progress": TaskStatus.IN_PROGRESS,
  ["Backlog"]: TaskStatus.BACKLOG,
  ["Completed"]: TaskStatus.COMPLETED,
};
