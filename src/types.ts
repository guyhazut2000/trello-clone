import { Project } from "@prisma/client";

// Project
export type ProjectList = Project[] | null;
export type ProjectItem = Project;
export type CreateProjectBody = Pick<ProjectItem, "title" | "description">;
