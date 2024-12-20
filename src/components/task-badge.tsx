import { TaskPriority, TaskType } from "@/types";
import { Badge } from "./ui/badge";
import clsx from "clsx"; // Optional utility for combining class names

interface TaskBadgeProps {
  priority?: keyof typeof TaskPriority;
  type?: keyof typeof TaskType;
}

// Tailwind class mapping based on TaskPriority and TaskType
const priorityClasses: Record<
  keyof typeof TaskPriority,
  { bg: string; text: string }
> = {
  LOW: { bg: "bg-green-100", text: "text-green-500" },
  MEDIUM: { bg: "bg-yellow-100", text: "text-yellow-500" },
  HIGH: { bg: "bg-red-100", text: "text-red-500" },
};

const typeClasses: Record<keyof typeof TaskType, { bg: string; text: string }> =
  {
    TASK: { bg: "bg-blue-100", text: "text-blue-500" },
    BUG: { bg: "bg-orange-100", text: "text-orange-500" },
    FEATURE: { bg: "bg-purple-100", text: "text-purple-500" },
  };

export default function TaskBadge({ priority, type }: TaskBadgeProps) {
  if (priority === undefined && type === undefined) {
    throw new Error("TaskBadge must have a priority or type");
  }

  const priorityClass = priority ? priorityClasses[priority] : undefined;
  const typeClass = type ? typeClasses[type] : undefined;

  // Combine background and text color classes based on priority and type
  const bgClass = priorityClass?.bg || typeClass?.bg || "bg-gray-100";
  const textClass = priorityClass?.text || typeClass?.text || "text-gray-500";

  return (
    <Badge
      variant={"secondary"}
      className={clsx(bgClass, textClass, "px-3  rounded-full")}
    >
      {priority && <span>{priority}</span>}
      {priority && type && " | "}
      {type && <span>{type}</span>}
    </Badge>
  );
}
