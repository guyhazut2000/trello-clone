import { Project, List, Task } from "@prisma/client";

// Project
export type ProjectList = Project[] | null;
export type ProjectItem = Project;
export type CreateProjectBody = Pick<ProjectItem, "title" | "description">;

// List
export type ListItem = List;
export type CreateListBody = Pick<ListItem, "title" | "position">;

// Tasks
export type TaskItem = Task;
export type CreateTaskBody = Pick<TaskItem, "title" | "position" | "listId">;
