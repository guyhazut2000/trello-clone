import { Project, List, Task } from "@prisma/client";
import {
  TaskPriority as PrismaTaskPriority,
  TaskStatus as PrismaTaskStatus,
  TaskType as PrismaTaskType,
} from "@prisma/client";

// Task Types
export const TaskType = PrismaTaskType;
export const TaskPriority = PrismaTaskPriority;
export const TaskStatus = PrismaTaskStatus;

// Project
export type ProjectItem = Project & {
  lists: ListItem[];
};
export type CreateProjectBody = Pick<
  ProjectItem,
  "title" | "description" | "userId"
>;

// List
export type ListItem = List & {
  tasks: TaskItem[];
};
export type CreateListBody = Pick<ListItem, "title" | "position">;
export type UpdateListOrder = ListItem[];

// Tasks
export type TaskItem = Task;
export type CreateTaskBody = Omit<TaskItem, "id" | "createdAt" | "updatedAt">;
