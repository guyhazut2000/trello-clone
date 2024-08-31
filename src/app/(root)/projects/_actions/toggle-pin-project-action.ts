"use server";

import { getProjectById, updateProjectById } from "@/data-access/projects";
import { revalidatePath } from "next/cache";

export const TogglePinProjectAction = async (projectId: string) => {
  try {
    const project = await getProjectById(projectId);

    if (!project) throw new Error(`Project ${projectId} not found`);

    await updateProjectById(projectId, {
      ...project,
      isPinned: !project.isPinned,
    });

    revalidatePath(`/projects`);
    return {
      success: true,
    };
  } catch (error) {
    return {
      error: "Failed to toggle pin project",
    };
  }
};
