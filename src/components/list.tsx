"use client";

import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Task } from "./task";

interface TaskItem {
  id: string;
  content: string;
}

interface List {
  id: string;
  title: string;
}

interface ListProps {
  list: List;
  tasks: TaskItem[];
  index: number;
}

export const List = ({ list, tasks, index }: ListProps) => {
  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="list-item"
          aria-label={`List ${index + 1}`}
        >
          <h3>{list.title}</h3>
          <Droppable droppableId={list.id} type="task">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="task-list"
              >
                {tasks.map((task, taskIndex) => (
                  <Draggable
                    key={task.id}
                    draggableId={task.id}
                    index={taskIndex}
                  >
                    {(provided, snapshot) => (
                      <Task
                        task={task}
                        index={taskIndex}
                        provided={provided}
                        isDragging={snapshot.isDragging}
                      />
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};
