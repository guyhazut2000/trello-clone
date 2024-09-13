"use server";

import { revalidatePath } from "next/cache";

import { TaskItem } from "@/types";
import { updateTask } from "@/data-access/task";

export const updateTaskAction = async (
  taskId: string,
  task: Partial<TaskItem>
) => {
  try {
    if (!taskId) throw new Error("taskId is required");
    const updatedTask = await updateTask(taskId, task);

    revalidatePath(`/projects`);
    revalidatePath(`/tasks/${taskId}`);
    return {
      success: true,
      data: updatedTask,
    };
  } catch (err) {
    return {
      error: (err as Error).message || "Failed to update task",
    };
  }
};
