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
import { sortListByPosition, sortTasksByPosition } from "@/lib/utils";

import { CreateTaskSheet } from "./create-task-sheet";
import { DeleteListButton } from "./delete-list-button";
import { updateListOrderAction } from "../_actions/update-list-order-action";
import { updateTaskOrderAction } from "../_actions/update-task-order-action";
import { deleteTaskAction } from "../_actions/delete-task-action";
import { createTaskAction } from "../_actions/create-task-action";

interface ProjectListsProps {
  initialLists: ListItem[];
  projectId: string;
}

export const ProjectLists = ({
  initialLists,
  projectId,
}: ProjectListsProps) => {
  const [lists, setLists] = useState(initialLists);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return;

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // Prepare for optimistic updates
    let updatedLists = [...lists];

    if (type === "LIST") {
      const reorderedList = reorder(
        updatedLists,
        source.index,
        destination.index
      ).map((item, index) => ({ ...item, position: index }));

      // Optimistically update the UI
      setLists(reorderedList);

      // Dispatch server action to update list position
      try {
        const { error, success } = await updateListOrderAction(
          projectId,
          reorderedList
        );

        if (success) {
          toast.success("List updated successfully");
        } else {
          toast.error(error || "Failed to update list");
          setLists(lists);
        }
      } catch (err) {
        toast.error("Failed to update list");
        // Rollback the optimistic update if needed
        setLists(lists);
      }
    }

    if (type === "TASK") {
      const sourceList = lists.find((l) => l.id === source.droppableId);
      const destinationList = lists.find(
        (l) => l.id === destination.droppableId
      );

      if (!sourceList || !destinationList) {
        return;
      }

      if (!sourceList.tasks) {
        sourceList.tasks = [];
      }

      if (!destinationList.tasks) {
        destinationList.tasks = [];
      }

      // Reorder the task in the same list
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

        const listId = destination.droppableId;

        const { error, success } = await updateTaskOrderAction(
          projectId,
          listId,
          reorderedTasks
        );

        if (success) {
          toast.success("Task position updated successfully");
        } else {
          toast.error(error || "Failed to update task position");
          setLists(lists);
        }

        // User move the task to another list
      } else {
        const [movedTask] = sourceList.tasks.splice(source.index, 1);

        // Update the task's listId to the destination
        movedTask.listId = destination.droppableId;

        // Add the task to the destination list
        destinationList.tasks.splice(destination.index, 0, movedTask);

        // Update positions in the source list
        sourceList.tasks.forEach((task, index) => {
          task.position = index;
        });

        // Update positions in the destination list
        destinationList.tasks.forEach((task, index) => {
          task.position = index;
        });

        // Optimistically update the UI
        setLists([...updatedLists]);

        // Dispatch the server action to update both lists
        try {
          await Promise.all([
            updateTaskOrderAction(projectId, sourceList.id, sourceList.tasks),
            updateTaskOrderAction(
              projectId,
              destinationList.id,
              destinationList.tasks
            ),
          ]);

          toast.success("Task moved successfully!");
        } catch (error) {
          // If something goes wrong, rollback the changes
          toast.error("Failed to move the task.");
          setLists(lists); // Rollback to the previous state
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {lists.length > 0 ? (
              lists.sort(sortListByPosition).map((list, index) => (
                <Draggable key={list.id} draggableId={list.id} index={index}>
                  {(provided) => (
                    <div
                      className="bg-gray-50 rounded-lg shadow-md flex flex-col gap-3 p-4 transition-all duration-300 ease-in-out hover:shadow-lg"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-lg text-gray-800">
                          {list.title}
                        </h3>
                        <DeleteListButton
                          listId={list.id}
                          projectId={projectId}
                        />
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
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="bg-white p-3 rounded shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group"
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
