"use server";

import prisma from "@/lib/db";
import { CreateTaskBody, TaskItem } from "@/types";

export const createTask = async (task: CreateTaskBody) => {
  return await prisma.task.create({
    data: task,
  });
};

export const deleteTask = async (listId: string, taskId: string) => {
  return await prisma.task.delete({
    where: { id: taskId, listId },
  });
};

export const updateTasksOrder = async (listId: string, tasks: TaskItem[]) => {
  const updatePromises = tasks.map((task) =>
    prisma.task.update({
      where: { id: task.id },
      data: { position: task.position, listId },
    })
  );

  return await Promise.all(updatePromises);
};

export const updateTask = async (taskId: string, task: Partial<TaskItem>) => {
  return await prisma.task.update({
    where: { id: taskId },
    data: task,
  });
};

export const getTaskById = async (
  taskId: string,
  options?: { include: { list: boolean } }
) => {
  return await prisma.task.findUnique({
    where: { id: taskId },
    include: options?.include,
  });
};
