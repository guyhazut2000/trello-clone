"use client";

import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { ListItem } from "@/types";
import { cn, sortTasksByPosition } from "@/lib/utils";
import { ProjectTask } from "./project-task";
import { CalendarX, Clock, ListTodo } from "lucide-react";

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
            "rounded-lg flex flex-col gap-3 p-4 transition-all duration-300 ease-in-out hover:shadow-lg hover:ring-4 hover:ring-gray-200",
            snapshot.isDragging ? "bg-gray-200 scale-105 shadow-lg" : ""
          )}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="flex justify-start gap-x-2 items-center">
            {list.title === "To Do" && (
              <ListTodo className="w-5 h-5 text-gray-500" />
            )}
            {list.title === "In Progress" && (
              <Clock className="w-5 h-5 text-blue-500" />
            )}
            {list.title === "Completed" && (
              <ListTodo className="w-5 h-5 text-green-500" />
            )}
            {list.title === "Backlog" && (
              <CalendarX className="w-5 h-5 text-red-500" />
            )}
            <h3 className="text-gray-800 flex justify-center items-center gap-x-2">
              {list.title}
              <span className="select-none bg-gray-100 px-2 rounded-full py-1">
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
