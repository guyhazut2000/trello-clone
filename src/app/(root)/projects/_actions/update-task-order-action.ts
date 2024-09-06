"use server";

import { revalidatePath } from "next/cache";

import { TaskItem } from "@/types";
import { updateTasksOrder } from "@/data-access/tasks";

export const updateTaskOrderAction = async (
  projectId: string,
  listId: string,
  tasks: TaskItem[]
) => {
  try {
    await updateTasksOrder(listId, tasks);

    revalidatePath(`/projects/${projectId}`);

    return {
      success: true,
    };
  } catch (err) {
    return {
      error: (err as Error).message || "Failed to update tasks list order",
    };
  }
};
