import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(2).max(50),
  description: z.string().max(1000),
});

export const createProjectListSchema = z.object({
  title: z.string(),
});

export const createTaskSchema = z.object({
  title: z.string(),
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
