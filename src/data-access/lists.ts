import prisma from "@/lib/db";
import { CreateProjectListBody } from "@/types";

export const getListsByProjectId = async (projectId: string) => {
  return await prisma.list.findMany({
    where: {
      projectId,
    },
  });
};

export const createList = async (
  projectId: string,
  list: CreateProjectListBody
) => {
  return await prisma.list.create({
    data: {
      projectId,
      ...list,
    },
  });
};
