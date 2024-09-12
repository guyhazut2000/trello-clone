"use server";

import { revalidatePath } from "next/cache";

import { TaskItem } from "@/types";
import { updateTasksOrder } from "@/data-access/tasks";
import { getListById } from "@/data-access/lists";
import { listToStatusMap } from "@/lib/utils";

export const updateTaskOrderAction = async (
  projectId: string,
  listId: string,
  tasks: TaskItem[]
) => {
  try {
    const list = await getListById(listId);

    const newTaskStatus =
      listToStatusMap[list?.title as keyof typeof listToStatusMap];

    if (!newTaskStatus) {
      throw new Error("Unable to determine task status based on list title.");
    }

    tasks.forEach((task) => {
      task.status = newTaskStatus;
    });
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
