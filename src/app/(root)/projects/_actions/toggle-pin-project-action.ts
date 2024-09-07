"use server";

import { revalidatePath } from "next/cache";

import { getProjectById, updateProjectById } from "@/data-access/projects";

export const TogglePinProjectAction = async (projectId: string) => {
  try {
    const project = await getProjectById(projectId);

    if (!project) throw new Error(`Project ${projectId} not found`);

    await updateProjectById(projectId, {
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
