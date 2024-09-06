"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { createProject } from "@/data-access/projects";

import { createProjectSchema } from "../validation";

export const createProjectAction = async (
  values: z.infer<typeof createProjectSchema>
) => {
  const { userId } = auth();

  if (!userId) throw new Error("Unauthorized");

  try {
    const validatedValues = createProjectSchema.safeParse(values);

    if (!validatedValues.success) {
      throw new Error("Invalid values");
    }

    const createProjectReturn = await createProject({
      title: validatedValues.data.title,
      description: validatedValues.data.description,
      userId,
    });

    revalidatePath("/");

    return {
      success: true,
      data: createProjectReturn,
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};
