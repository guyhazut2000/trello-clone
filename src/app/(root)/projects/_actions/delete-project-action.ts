"use server";

import { deleteProject } from "@/data-access/projects";
import { revalidatePath } from "next/cache";

export const deleteProjectAction = async (projectId: string) => {
  try {
    await deleteProject(projectId);

    revalidatePath(`/projects`);
    return {
      success: true,
    };
  } catch (error) {
    return {
      error: "Failed to delete project",
    };
  }
};
