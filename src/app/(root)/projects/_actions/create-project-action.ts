"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { createProject } from "@/data-access/project";

import { createProjectSchema } from "../validation";
import { createProjectListAction } from "./create-list-action";
import { auth } from "@clerk/nextjs/server";

export const createProjectAction = async (
  values: z.infer<typeof createProjectSchema>
) => {
  try {
    // Authentication check (no throw, just return structured error response)
    const { userId, sessionClaims } = auth();
    /* It looks like there is a typo in the code. The line `console.log("Role: ", sessionClaimsrole);`
    should be corrected to `console.log("Role: ", sessionClaims.role);`. */
    console.log("Claims: ", sessionClaims);
    console.log("Role: ", sessionClaims?.role);
    console.log("App User ID: ", sessionClaims?.appUserId);

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
