"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { getTaskById, updateTask } from "@/data-access/task";

import { createTaskSchema } from "../validation";
import { getListsByProjectId } from "@/data-access/list";
import { getStatusFromListTitle } from "@/lib/utils";
import { updateListOrderAction } from "./update-list-order-action";
import { updateTaskOrderAction } from "./update-task-order-action";

export const editTaskAction = async (
  projectId: string,
  taskId: string,
  values: z.infer<typeof createTaskSchema>
) => {
  try {
    const validatedValues = createTaskSchema.safeParse(values);

    if (!validatedValues.success) {
      throw new Error("Invalid values");
    }

    const task = await getTaskById(taskId, { include: { list: true } });

    if (!task) {
      throw new Error("Task not found");
    }

    let taskListId = task.listId;

    // Update task listId
    const lists = await getListsByProjectId(projectId);

    if (!lists) {
      throw new Error("Failed to get project lists");
    }

    const taskList = lists.filter((l) => {
      return getStatusFromListTitle(l.title) === values.status;
    });

    // add 1 to the list tasks position
    taskList.forEach((task) => {
      task.position += 1;
    });

    taskListId = taskList[0].id;

    console.log("Task position: ", taskList[0].tasks);

    const updatedTask = await updateTask(taskId, {
      ...values,
      listId: taskListId,
      position: 0, // put the task in the top of the list
    });

    // Update source list tasks position
    // Update destination list tasks position
    await updateTaskOrderAction(projectId, taskListId, taskList[0].tasks);

    revalidatePath(`/projects/${projectId}`);

    return {
      success: true,
      data: updatedTask,
    };
  } catch (err) {
    return {
      error: "Failed to update task",
    };
  }
};
