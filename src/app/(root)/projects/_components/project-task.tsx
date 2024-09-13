"use client";

import React from "react";
import { Draggable } from "@hello-pangea/dnd";

import { cn } from "@/lib/utils";
import { TaskItem } from "@/types";

import { EditTaskSheet } from "./edit-task-sheet";

interface ProjectTaskProps {
  task: TaskItem;
  index: number;
}

export const ProjectTask = ({ task, index }: ProjectTaskProps) => {
  return (
    <Draggable draggableId={`task-${task.id}`} index={index}>
      {(provided, snapshot) => (
        <span
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "bg-white hover:bg-blue-100 cursor-pointer w-full rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between ",
            snapshot.isDragging ? "bg-blue-100 scale-105 shadow-xl" : "bg-white"
          )}
        >
          <EditTaskSheet task={task} />
        </span>
      )}
    </Draggable>
  );
};
