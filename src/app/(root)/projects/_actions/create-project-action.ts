"use server";

import { z } from "zod";

import { CreateProjectBody } from "@/types";
import { createProject } from "@/data-access/projects";

import { createProjectSchema } from "../projects/validation";
import { revalidatePath } from "next/cache";

export const createProjectAction = async (
  values: z.infer<typeof createProjectSchema>
) => {
  const validatedValues = createProjectSchema.safeParse(values);

  if (!validatedValues.success) {
    throw new Error("Invalid values");
  }

  const data: CreateProjectBody = validatedValues.data;
  const createProjectReturn = await createProject(data);

  revalidatePath("/");
  return {
    success: true,
    data: createProjectReturn,
  };
};
