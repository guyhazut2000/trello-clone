import prisma from "@/lib/db";
import { CreateTaskBody } from "@/types";

export const createTask = async (task: CreateTaskBody) => {
  return await prisma.task.create({
    data: task,
  });
};
