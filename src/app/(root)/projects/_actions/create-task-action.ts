"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { getListById } from "@/data-access/lists";

import { createTaskSchema } from "../validation";
import { createTask } from "@/data-access/tasks";

export const createTaskAction = async (
  projectId: string,
  listId: string,
  values: z.infer<typeof createTaskSchema>
) => {
  // Validate input values using Zod
  const validatedValues = createTaskSchema.safeParse(values);

  if (!validatedValues.success) {
    throw new Error("Invalid values");
  }

  try {
    const list = await getListById(listId);

    if (!list) {
      throw new Error("List not found");
    }

    // Find the highest order among the tasks in the list
    const lastTaskOrder = list.tasks.reduce(
      (maxOrder, task) => Math.max(maxOrder, task.position),
      0 // Start with 0 if there are no tasks
    );

    // Create the new task with the next order value
    const newTask = await createTask({
      ...validatedValues.data,
      position: lastTaskOrder + 1,
      listId,
    });

    revalidatePath("/");
    revalidatePath(`/projects/${projectId}`);

    return {
      success: true,
      data: newTask,
    };
  } catch (err) {
    return {
      error: "Failed to create task",
    };
  }
};
