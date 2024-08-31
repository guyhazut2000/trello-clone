"use server";

import { revalidatePath } from "next/cache";

import { deleteListWithTasks } from "@/data-access/lists";

export const deleteListAction = async (projectId: string, listId: string) => {
  try {
    console.log(projectId);
    await deleteListWithTasks(listId);

    revalidatePath(`/projects/${projectId}`);
    return {
      success: true,
    };
  } catch (error) {
    return {
      error: "Failed to delete list",
    };
  }
};
