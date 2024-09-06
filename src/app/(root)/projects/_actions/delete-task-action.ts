"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

import { deleteTask } from "@/data-access/tasks";

export const deleteTaskAction = async (
  projectId: string,
  listId: string,
  taskId: string
) => {
  try {
    const { userId } = auth();

    if (!userId) throw new Error("unauthorized");

    await deleteTask(listId, taskId);

    revalidatePath(`/projects/${projectId}`);
    return {
      success: true,
    };
  } catch (error) {
    return {
      error: "Failed to delete task",
    };
  }
};
