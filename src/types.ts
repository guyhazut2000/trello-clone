import { Project, List } from "@prisma/client";

// Project
export type ProjectList = Project[] | null;
export type ProjectItem = Project;
export type CreateProjectBody = Pick<ProjectItem, "title" | "description">;

// List
export type ListItem = List;
export type CreateProjectListBody = Pick<ListItem, "title" | "position">;
