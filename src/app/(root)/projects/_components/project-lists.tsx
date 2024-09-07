"use client";

import { ChevronRight } from "lucide-react";
import {
  Draggable,
  Droppable,
  DragDropContext,
  DropResult,
} from "@hello-pangea/dnd";
import { useState } from "react";

import { ListItem } from "@/types";
import { toast } from "sonner";
import { cn, sortListByPosition, sortTasksByPosition } from "@/lib/utils";

import { CreateTaskSheet } from "./create-task-sheet";
import { updateListOrderAction } from "../_actions/update-list-order-action";
import { updateTaskOrderAction } from "../_actions/update-task-order-action";

export const dynamicParams = true; // Enable handling of dynamic parameters

interface ProjectListsProps {
  initialLists: ListItem[];
  projectId: string;
}

export const ProjectLists = ({
  initialLists,
  projectId,
}: ProjectListsProps) => {
  initialLists.forEach((prop) => console.log(prop));
  const [lists, setLists] = useState(initialLists);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const previousLists = [...lists]; // Capture the previous state

    if (type === "LIST") {
      const reorderedList = reorder(
        previousLists,
        source.index,
        destination.index
      ).map((item, index) => ({ ...item, position: index }));

      setLists(reorderedList);

      try {
        const { error, success } = await updateListOrderAction(
          projectId,
          reorderedList
        );

        if (!success) {
          throw new Error(error || "Failed to update list");
        }

        toast.success("List updated successfully");
      } catch (err) {
        toast.error("Failed to update list");
        setLists(previousLists); // Rollback to previous state
      }
    }

    if (type === "TASK") {
      const sourceList = lists.find((l) => l.id === source.droppableId);
      const destinationList = lists.find(
        (l) => l.id === destination.droppableId
      );

      if (!sourceList || !destinationList) return;

      const previousLists = [...lists]; // Capture the previous state

      if (source.droppableId === destination.droppableId) {
        const reorderedTasks = reorder(
          sourceList.tasks,
          source.index,
          destination.index
        ).map((task, index) => ({
          ...task,
          position: index,
        }));

        sourceList.tasks = reorderedTasks;

        setLists([...previousLists]);

        try {
          const { error, success } = await updateTaskOrderAction(
            projectId,
            destination.droppableId,
            reorderedTasks
          );

          if (!success) {
            throw new Error(error || "Failed to update task position");
          }

          toast.success("Task position updated successfully");
        } catch (err) {
          toast.error("Failed to update task position");
          setLists(previousLists); // Rollback to previous state
        }
      } else {
        const [movedTask] = sourceList.tasks.splice(source.index, 1);
        movedTask.listId = destination.droppableId;
        destinationList.tasks.splice(destination.index, 0, movedTask);

        sourceList.tasks.forEach((task, index) => {
          task.position = index;
        });

        destinationList.tasks.forEach((task, index) => {
          task.position = index;
        });

        setLists([...previousLists]);

        try {
          const results = await Promise.allSettled([
            updateTaskOrderAction(projectId, sourceList.id, sourceList.tasks),
            updateTaskOrderAction(
              projectId,
              destinationList.id,
              destinationList.tasks
            ),
          ]);

          const errors = results
            .filter(
              (result) =>
                result.status === "rejected" ||
                (result.status === "fulfilled" && result.value?.error)
            )
            .map((result) => {
              if (result.status === "rejected") {
                return (
                  (result as PromiseRejectedResult).reason.message ||
                  "Unknown error"
                );
              }
              if (result.status === "fulfilled" && result.value.error) {
                return result.value.error;
              }
            });

          if (errors.length > 0) {
            // If any of the promises failed, display an error message
            toast.error(`Failed to move the task. Error: ${errors.join(", ")}`);
            setLists(previousLists); // Rollback to previous state
          } else {
            // If all promises were successful
            toast.success("Task moved successfully!");
          }
        } catch (err) {
          // Handle any unexpected errors (unlikely with Promise.allSettled)
          toast.error("An unexpected error occurred while moving the task.");
          setLists(previousLists); // Rollback to previous state
        }
      }
    }
  };

  const reorder = (list: any[], startIndex: number, lastIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(lastIndex, 0, removed);

    return result;
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="project-lists" direction="horizontal" type="LIST">
        {(provided) => (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {initialLists.length > 0 ? (
              initialLists.sort(sortListByPosition).map((list, index) => (
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
                        <h3 className="font-semibold text-lg text-gray-800">
                          {list.title}
                        </h3>
                        <span className="select-none">{list.tasks.length}</span>
                      </div>

                      <Droppable droppableId={list.id} type="TASK">
                        {(provided) => (
                          <div
                            className="space-y-2 flex-grow"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {list.tasks.length > 0 ? (
                              list.tasks
                                .sort(sortTasksByPosition)
                                .map((task, taskIndex) => (
                                  <Draggable
                                    key={task.id}
                                    draggableId={`task-${task.id}`}
                                    index={taskIndex}
                                  >
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={cn(
                                          "bg-white p-3 rounded shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group",
                                          snapshot.isDragging
                                            ? "bg-blue-200 scale-105 shadow-lg"
                                            : "bg-white"
                                        )}
                                      >
                                        <span className="truncate">
                                          {task.title}
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 transform transition-transform duration-200 ease-in-out group-hover:translate-x-1" />
                                      </div>
                                    )}
                                  </Draggable>
                                ))
                            ) : (
                              <div className="text-gray-500 italic">
                                No tasks yet
                              </div>
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

                      <CreateTaskSheet listId={list.id} projectId={projectId} />
                    </div>
                  )}
                </Draggable>
              ))
            ) : (
              <div className="col-span-full flex justify-center">
                You have no lists
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
