"use client";

import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { TaskStatus } from "@prisma/client";

import { TaskItem } from "@/types";

import { EditTaskSheet } from "./edit-task-sheet";
import { Card, CardContent } from "@/components/ui/card";
import clsx from "clsx";

const getTaskStatusBorderColor = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.BACKLOG:
      return "border-l-4 border-l-orange-500";
    case TaskStatus.IN_PROGRESS:
      return "border-l-4 border-l-blue-500";
    case TaskStatus.TODO:
      return "border-l-4 border-l-gray-500";
    case TaskStatus.COMPLETED:
      return "border-l-4 border-l-green-500";
    default:
      return "border-l-4 border-l-gray-500";
  }
};

const getTaskStatusColor = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.BACKLOG:
      return "hover:bg-orange-50";
    case TaskStatus.IN_PROGRESS:
      return "hover:bg-blue-50";
    case TaskStatus.TODO:
      return "hover:bg-gray-50";
    case TaskStatus.COMPLETED:
      return "hover:bg-green-50";
    default:
      return "hover:bg-gray-50";
  }
};

interface ProjectTaskProps {
  task: TaskItem;
  index: number;
}

export const ProjectTask = ({ task, index }: ProjectTaskProps) => {
  return (
    <Draggable draggableId={`task-${task.id}`} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={clsx(
            `border-l-4 ${getTaskStatusBorderColor(
              task.status
            )} ${getTaskStatusColor(task.status)} ${
              snapshot.isDragging
                ? "bg-green-100 scale-105 shadow-xl"
                : "bg-white"
            }`
          )}
        >
          <CardContent>
            <EditTaskSheet task={task} />
          </CardContent>
        </Card>
        // <span
        //   ref={provided.innerRef}
        //   {...provided.draggableProps}
        //   {...provided.dragHandleProps}
        //   className={cn(
        //     "bg-white hover:bg-blue-100 cursor-pointer w-full rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between ",
        //     snapshot.isDragging ? "bg-blue-100 scale-105 shadow-xl" : "bg-white"
        //   )}
        // >
        //   <EditTaskSheet task={task} />
        // </span>
      )}
    </Draggable>
  );
};
