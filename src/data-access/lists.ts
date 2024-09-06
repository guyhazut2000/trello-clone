import prisma from "@/lib/db";
import { CreateListBody, ListItem } from "@/types";

export const getListsByProjectId = async (projectId: string) => {
  return await prisma.list.findMany({
    where: {
      projectId,
    },
    include: {
      tasks: true,
    },
  });
};

export const getListById = async (id: string) => {
  return await prisma.list.findUnique({
    where: { id },
    include: {
      tasks: true,
    },
  });
};

export const createList = async (projectId: string, list: CreateListBody) => {
  return await prisma.list.create({
    data: {
      projectId,
      ...list,
    },
  });
};

export const deleteListWithTasks = async (id: string) => {
  return await prisma.$transaction([
    prisma.task.deleteMany({
      where: { listId: id },
    }),
    prisma.list.delete({
      where: { id },
    }),
  ]);
};

export const updateListsOrder = async (
  projectId: string,
  lists: ListItem[]
) => {
  const updatePromises = lists.map((list) =>
    prisma.list.update({
      where: { id: list.id, projectId },
      data: { position: list.position },
    })
  );

  return await Promise.all(updatePromises);
};
