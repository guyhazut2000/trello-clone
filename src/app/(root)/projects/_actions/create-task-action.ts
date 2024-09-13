"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { createTask } from "@/data-access/task";
import { getProjectById } from "@/data-access/project";
import { statusToListMap } from "@/lib/utils";

import { createTaskSchema } from "../validation";

export const createTaskAction = async (
  projectId: string,
  values: z.infer<typeof createTaskSchema>
) => {
  try {
    const validatedValues = createTaskSchema.safeParse(values);

    if (!validatedValues.success) {
      throw new Error("Invalid values");
    }

    const project = await getProjectById(projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    const list = project.lists.find(
      (l) => l.title === statusToListMap[values.status]
    );

    if (!list) {
      throw new Error("Matching list not found");
    }

    // Find the highest order among the tasks in the list
    const lastTaskOrder = list.tasks.reduce(
      (maxOrder, task) => Math.max(maxOrder, task.position),
      0 // Start with 0 if there are no tasks
    );

    // Create the new task with the next order value
    const newTask = await createTask({
      ...validatedValues.data,
      position: list.tasks.length === 0 ? 0 : lastTaskOrder + 1,
      listId: list.id,
    });

    revalidatePath(`/projects/${projectId}`);

    return {
      success: true,
      data: newTask,
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};
