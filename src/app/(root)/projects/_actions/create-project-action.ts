"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { createProject } from "@/data-access/project";

import { createProjectSchema } from "../validation";
import { createProjectListAction } from "./create-list-action";

export const createProjectAction = async (
  values: z.infer<typeof createProjectSchema>
) => {
  try {
    // Authentication check (no throw, just return structured error response)
    const { userId } = auth();
    if (!userId) {
      return { success: false, error: "Unauthorized: No user ID provided" };
    }

    // Validation check (safeParse with structured error response)
    const validatedValues = createProjectSchema.safeParse(values);
    if (!validatedValues.success) {
      return { success: false, error: "Invalid input values" };
    }

    const createProjectReturn = await createProject({
      title: validatedValues.data.title,
      description: validatedValues.data.description,
      userId,
    });

    const defaultProjectListsTitles = [
      "Backlog",
      "To Do",
      "In Progress",
      "Completed",
    ];

    await Promise.all(
      defaultProjectListsTitles.map((title) =>
        createProjectListAction(createProjectReturn.id, { title })
      )
    );

    revalidatePath("/");

    return {
      success: true,
      data: createProjectReturn,
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};
