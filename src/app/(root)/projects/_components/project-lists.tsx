"use client";

import { ChevronRight } from "lucide-react";

import { CreateTaskSheet } from "./create-task-sheet";
import { DeleteListButton } from "./delete-list-button";
import { CreateProjectListSheet } from "./create-project-list-sheet";

interface ProjectListsProps {
  lists: any[];
  projectId: string;
}

export const ProjectLists = ({ lists, projectId }: ProjectListsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {lists.length > 0 ? (
        lists.map((list, index) => (
          <div
            key={list.id}
            className="bg-gray-50 rounded-lg shadow-md flex flex-col gap-3 p-4 transition-all duration-300 ease-in-out hover:shadow-lg"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg text-gray-800">
                {list.title}
              </h3>
              <DeleteListButton listId={list.id} projectId={projectId} />
            </div>
            <div className="space-y-2 flex-grow">
              {list.tasks.length > 0 ? (
                list.tasks.map((task: any, index: any) => (
                  <div
                    key={task.id}
                    className="bg-white p-3 rounded shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group"
                  >
                    <span className="truncate">{task.title}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 transform transition-transform duration-200 ease-in-out group-hover:translate-x-1" />
                  </div>
                ))
              ) : (
                <div className="text-gray-500 italic">No tasks yet</div>
              )}
            </div>
            <CreateTaskSheet listId={list.id} projectId={projectId} />
          </div>
        ))
      ) : (
        <div className="col-span-full flex justify-center">
          <CreateProjectListSheet projectId={projectId} />
        </div>
      )}
    </div>
  );
};
