"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

import { createList, getListsByProjectId } from "@/data-access/list";

import { createProjectListSchema } from "../validation";

export const createProjectListAction = async (
  projectId: string,
  values: z.infer<typeof createProjectListSchema>
) => {
  try {
    const { userId } = auth();

    if (!userId) throw new Error("Unauthorized");

    const validatedValues = createProjectListSchema.safeParse(values);

    if (!validatedValues.success) {
      throw new Error("Invalid values");
    }

    const projectLists = await getListsByProjectId(projectId);
    const projectListLastPosition =
      projectLists.length > 0
        ? projectLists.sort((a, b) => a.position - b.position)[
            projectLists.length - 1
          ].position
        : 0;

    const createListReturn = await createList(projectId, {
      ...validatedValues.data,
      position: projectListLastPosition + 1,
    });

    revalidatePath(`/projects/${projectId}`);
    return {
      success: true,
      data: createListReturn,
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};
