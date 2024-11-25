"use client";

import { useState, useMemo } from "react";
import { partition } from "lodash";
import { Layers, Pin } from "lucide-react";

import { ProjectItem } from "@/types";
import { calculateProjectProgress } from "@/lib/utils";

import { ProjectCard } from "./project-card";
import { ProjectSearchInput } from "./project-search-input";

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
      {/* Search */}
      <ProjectSearchInput handleOnSearch={handleOnSearch} />

      {/* Pinned Projects */}
      <div className="space-y-4 mt-6">
        {pinnedProjects.length > 0 && (
          <>
            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-600">
              <Pin className="h-4 w-4" />
              Pinned projects
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3  gap-4">
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

        {/* All Projects */}
        {otherProjects.length > 0 && (
          <>
            <h2 className="mb-4 text-sm font-medium text-gray-600">
              All projects
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
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
