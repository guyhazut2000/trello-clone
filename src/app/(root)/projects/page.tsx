"use server";

import { User2Icon } from "lucide-react";

import { getProjects } from "@/data-access/projects";

import { ProjectSearchInput } from "../_components/project-search-input";
import { CreateProjectForm } from "../_components/forms/create-project-form";
import { ProjectList } from "../_components/project-list";

export default async function ProjectsPage() {
  const projects = await getProjects({
    sort: "updatedAt",
  });

  return (
    <div className="space-y-8 w-full py-4">
      <div className="flex items-center font-semibold text-lg text-neutral-700">
        <User2Icon className="h-6 w-6 mr-2" />
        Your Projects
      </div>
      <div className="flex justify-between items-center gap-2">
        <ProjectSearchInput />
        <CreateProjectForm />
      </div>
      <ProjectList projects={projects} />
    </div>
  );
}
