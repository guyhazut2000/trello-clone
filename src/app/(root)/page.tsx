"use server";

import { User2 } from "lucide-react";

import { ProjectList } from "./_components/project-list";
import { CreateProjectForm } from "./_components/forms/create-project-form";
import { ProjectSearchInput } from "./_components/project-search-input";
import { getProjects } from "@/data-access/projects";

const DashboardPage = async () => {
  const projects = await getProjects({
    sort: "updatedAt",
  });

  return (
    <div className="space-y-8 w-full py-4">
      <div className="flex items-center font-semibold text-lg text-neutral-700">
        <User2 className="h-6 w-6 mr-2" />
        Your Projects
      </div>
      <div className="flex justify-between items-center gap-2">
        <ProjectSearchInput />
        <CreateProjectForm />
      </div>
      <ProjectList projects={projects} />
    </div>
  );
};

export default DashboardPage;
