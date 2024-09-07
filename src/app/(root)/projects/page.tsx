"use server";

import { User2Icon } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getProjects } from "@/data-access/projects";
import { CreateProjectAnimation } from "@/components/animations/create-project-animation";

import { ProjectSearchInput } from "../_components/project-search-input";
import { CreateProjectSheet } from "../_components/create-project-sheet";
import { ProjectList } from "../_components/project-list";

export default async function ProjectsPage() {
  const { userId } = auth();

  if (!userId) redirect("/");

  const projects = await getProjects({
    sort: "updatedAt",
  });

  if (projects.length === 0) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-full text-center text-neutral-500">
        No projects found. Click the plus icon to create a new project.
        <CreateProjectAnimation />
        <CreateProjectSheet />
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full h-full py-4">
      <div className="flex items-center font-semibold text-lg text-neutral-700">
        <User2Icon className="h-6 w-6 mr-2" />
        Your Projects
      </div>
      <div className="flex justify-between items-center gap-2">
        <ProjectSearchInput />
        <CreateProjectSheet />
      </div>
      <ProjectList projects={projects} />
    </div>
  );
}
