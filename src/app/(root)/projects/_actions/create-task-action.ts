"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { getListById } from "@/data-access/lists";

import { createTaskSchema } from "../validation";
import { createTask } from "@/data-access/tasks";
import { getProjectById } from "@/data-access/projects";
import { TaskStatus } from "@/types";
import { statusToListMap } from "@/lib/utils";

export const createTaskAction = async (
  projectId: string,
  values: z.infer<typeof createTaskSchema>
) => {
  const validatedValues = createTaskSchema.safeParse(values);

  if (!validatedValues.success) {
    throw new Error("Invalid values");
  }

  try {
    const project = await getProjectById(projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    const list = project.lists.find(
      (l) => l.title === statusToListMap[values.status]
    );

    console.log("List:", list);

    if (!list) {
      throw new Error("Matching list not found");
    }

    // Find the highest order among the tasks in the list
    const lastTaskOrder = list.tasks.reduce(
      (maxOrder, task) => Math.max(maxOrder, task.position),
      0 // Start with 0 if there are no tasks
    );

    console.log({
      ...validatedValues.data,
      position: lastTaskOrder + 1,
      listId: list.id,
    });
    // Create the new task with the next order value
    const newTask = await createTask({
      ...validatedValues.data,
      position: lastTaskOrder + 1,
      listId: list.id,
    });

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
