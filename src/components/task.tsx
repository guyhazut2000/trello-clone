"use client";

import React from "react";
import { DraggableProvided } from "@hello-pangea/dnd";
import { TaskItem } from "@/types";

interface TaskProps {
  task: TaskItem;
  index: number;
  provided: DraggableProvided;
  isDragging: boolean;
}

export const Task = ({ task, index, provided, isDragging }: TaskProps) => {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={{
        background: isDragging ? "lightgreen" : "white",
        padding: "8px",
        margin: "4px 0",
        border: "1px solid lightgray",
        borderRadius: "4px",
        ...provided.draggableProps.style,
      }}
      className="task-item"
    >
      {task.title}
    </div>
  );
};
