import { object, z } from "zod";

import { TaskStatus, TaskPriority, TaskType } from "@/types";

export const createProjectSchema = z.object({
  title: z.string().min(2).max(50),
  description: z.string().max(1000),
});

export const createProjectListSchema = z.object({
  title: z.string(),
});

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"), // Adding a basic validation rule
  status: z
    .enum([
      TaskStatus.BACKLOG,
      TaskStatus.TODO,
      TaskStatus.IN_PROGRESS,
      TaskStatus.COMPLETED,
    ])
    .default(TaskStatus.TODO), // Convert enum to array
  priority: z
    .enum([TaskPriority.HIGH, TaskPriority.LOW, TaskPriority.MEDIUM])
    .default(TaskPriority.MEDIUM),
  type: z
    .enum([TaskType.BUG, TaskType.FEATURE, TaskType.TASK])
    .default(TaskType.FEATURE),
  description: z
    .string()
    .max(1024, "Description must be 1024 characters or less"),
  deadline: z.date(),
});

export const updateListOrderSchema = z.object({
  lists: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      position: z.number(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
  ),
  projectId: z.string(),
});
