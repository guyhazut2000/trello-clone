"use server";

import prisma from "@/lib/db";
import { CreateProjectBody, ProjectItem } from "@/types";
import { Prisma } from "@prisma/client";

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
    include: { lists: { include: { tasks: true } } }, // Include related lists and tasks
  });
};

export const getProjectById = async (projectId: string) => {
  return await prisma.project.findUnique({
    where: { id: projectId },
    include: { lists: { include: { tasks: true } } },
  });
};

export const createProject = async (project: CreateProjectBody) => {
  return await prisma.project.create({
    data: project,
    include: { lists: true },
  });
};

export const deleteProject = async (projectId: string) => {
  return await prisma.project.delete({
    where: { id: projectId },
  });
};

export const updateProjectById = async (
  projectId: string,
  projectData: Partial<Omit<ProjectItem, "lists">>
) => {
  return await prisma.project.update({
    where: { id: projectId },
    data: projectData,
  });
};
