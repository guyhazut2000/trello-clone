import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";

import { ListItem, TaskItem } from "@/types";

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
