"use client";

import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { ListItem } from "@/types";
import { cn, sortTasksByPosition } from "@/lib/utils";
import { ProjectTask } from "./project-task";

interface ProjectListProps {
  list: ListItem;
  index: number;
}

export const ProjectList = ({ list, index }: ProjectListProps) => {
  return (
    <Draggable key={list.id} draggableId={list.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={cn(
            "rounded-lg shadow-md flex flex-col gap-3 p-4 transition-all duration-300 ease-in-out hover:shadow-lg",
            snapshot.isDragging
              ? "bg-gray-200 scale-105 shadow-lg"
              : "bg-gray-50"
          )}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg text-gray-800 flex justify-center items-center gap-x-2">
              {list.title}
              <span className="select-none bg-gray-200 rounded-md px-3 py-1">
                {list.tasks.length}
              </span>
            </h3>
          </div>

          <Droppable droppableId={list.id} type="TASK">
            {(provided) => (
              <div
                className="space-y-2 flex-grow"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {list.tasks.length > 0
                  ? list.tasks
                      .sort(sortTasksByPosition)
                      .map((task, taskIndex) => (
                        <ProjectTask
                          key={task.id}
                          task={task}
                          index={taskIndex}
                        />
                      ))
                  : null}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};
