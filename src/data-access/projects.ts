"use server";

import prisma from "@/lib/db";
import { CreateProjectBody } from "@/types";

type GetProjectOptions = {
  order?: "asc" | "desc";
  sort?: "updatedAt";
  isPinned?: boolean;
};

export const getProjects = async (options?: GetProjectOptions) => {
  const { order = "desc", sort = "updatedAt", isPinned } = options || {};

  return await prisma.project.findMany({
    where: isPinned !== undefined ? { isPinned } : undefined,
    orderBy: {
      [sort]: order,
    },
  });
};

export const getProjectById = async (projectId: string) => {
  return await prisma.project.findUnique({
    where: { id: projectId },
  });
};

export const createProject = async (project: CreateProjectBody) => {
  return await prisma.project.create({
    data: project,
  });
};
