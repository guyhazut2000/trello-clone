"use server";

import {
  deleteProjectById,
  getProjectById,
  updateProjectById,
} from "@/data-access/projects";
import { revalidatePath } from "next/cache";

export const deleteProjectAction = async (projectId: string) => {
  try {
    const project = await getProjectById(projectId);

    if (!project) throw new Error(`Project ${projectId} not found`);

    await deleteProjectById(projectId);

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
