"use client";

import { useState, useMemo } from "react";
import { partition } from "lodash";
import { Layers, Pin } from "lucide-react";

import { ProjectItem } from "@/types";
import { calculateProjectProgress } from "@/lib/utils";

import { ProjectCard } from "./project-card";
import { ProjectSearchInput } from "./project-search-input";
import { CreateProjectSheet } from "./create-project-sheet";

interface ProjectListProps {
  projects: ProjectItem[];
}

const isPinnedPredicate = (project: ProjectItem): boolean => project.isPinned;

export const ProjectList = ({ projects }: ProjectListProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

  const [pinnedProjects, otherProjects] = partition(
    filteredProjects,
    isPinnedPredicate
  );

  const handleOnSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center gap-2">
        <ProjectSearchInput handleOnSearch={handleOnSearch} />
        <CreateProjectSheet />
      </div>

      <div className="space-y-4 mt-6">
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
            <div className="flex text-primary items-center gap-x-2 border p-2 rounded-lg bg-gray-50">
              <Layers className="h-4 w-4" />
              <h2>Projects</h2>
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
    </div>
  );
};
