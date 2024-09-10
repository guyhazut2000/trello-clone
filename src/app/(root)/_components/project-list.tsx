"use server";

import { partition } from "lodash";
import { Layers, Pin } from "lucide-react";

import { ProjectItem } from "@/types";
import { calculateProjectProgress } from "@/lib/utils";

import { ProjectCard } from "./project-card";

interface ProjectListProps {
  projects: ProjectItem[];
}

const isPinnedPredicate = (project: ProjectItem): boolean => project.isPinned;

export const ProjectList = ({ projects }: ProjectListProps) => {
  const [pinnedProjects, otherProjects] = partition(
    projects,
    isPinnedPredicate
  );

  console.log(projects[0].lists);
  return (
    <div className="flex-1 mx-auto space-y-4">
      {pinnedProjects.length > 0 && (
        <>
          <div className="flex items-center gap-x-2 border p-2 rounded-lg bg-gray-50">
            <Pin className="h-4 w-4" />
            <h2>Pinned projects</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {pinnedProjects?.map((p) => {
              const progressBar = calculateProjectProgress(p);

              return (
                <ProjectCard
                  key={p.id}
                  project={p}
                  totalTasks={progressBar.totalTasks}
                  completedTasks={progressBar.completedTasks}
                />
              );
            })}
          </div>
        </>
      )}
      {otherProjects.length > 0 && (
        <>
          <div className="flex items-center gap-x-2 border p-2 rounded-lg bg-gray-50">
            <Layers className="h-4 w-4" />
            <h2>Other projects</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {otherProjects?.map((p) => {
              const progressBar = calculateProjectProgress(p);

              return (
                <ProjectCard
                  key={p.id}
                  project={p}
                  totalTasks={progressBar.totalTasks}
                  completedTasks={progressBar.completedTasks}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
