import { Project, List, Task } from "@prisma/client";

// Project
export type ProjectItem = Project & {
  lists: ListItem[];
};
export type CreateProjectBody = Pick<ProjectItem, "title" | "description">;

// List
export type ListItem = List & {
  tasks: TaskItem[];
};
export type CreateListBody = Pick<ListItem, "title" | "position">;
export type UpdateListOrder = ListItem[];

// Tasks
export type TaskItem = Task;
export type CreateTaskBody = Pick<TaskItem, "title" | "position" | "listId">;
