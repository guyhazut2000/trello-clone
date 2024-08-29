"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { CreateProjectListBody } from "@/types";
import { createProject } from "@/data-access/projects";

import { createProjectListSchema } from "../validation";
import { createList, getListsByProjectId } from "@/data-access/lists";

export const createProjectListAction = async (
  projectId: string,
  values: z.infer<typeof createProjectListSchema>
) => {
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
};
