import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(2).max(50),
  description: z.string().max(1000),
});

export const createProjectListSchema = z.object({
  title: z.string(),
});
