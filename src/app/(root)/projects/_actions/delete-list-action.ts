"use server";

import { revalidatePath } from "next/cache";

import { deleteListWithTasks } from "@/data-access/list";

export const deleteListAction = async (projectId: string, listId: string) => {
  try {
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
