"use client";

import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskItem } from "@/types";

interface ProjectTaskProps {
  task: TaskItem;
  index: number;
}

export const ProjectTask = ({ task, index }: ProjectTaskProps) => {
  return (
    <Draggable draggableId={`task-${task.id}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "bg-white p-3 rounded shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group",
            snapshot.isDragging ? "bg-blue-200 scale-105 shadow-lg" : "bg-white"
          )}
        >
          <span className="truncate">{task.title}</span>
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 transform transition-transform duration-200 ease-in-out group-hover:translate-x-1" />
        </div>
      )}
    </Draggable>
  );
};
