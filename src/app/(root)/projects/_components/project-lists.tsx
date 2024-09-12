"use client";

import { ChevronRight } from "lucide-react";
import {
  Draggable,
  Droppable,
  DragDropContext,
  DropResult,
} from "@hello-pangea/dnd";
import { useCallback, useState } from "react";

import { ListItem } from "@/types";
import { toast } from "sonner";
import {
  cn,
  getStatusFromListTitle,
  sortListByPosition,
  sortTasksByPosition,
} from "@/lib/utils";

import { updateListOrderAction } from "../_actions/update-list-order-action";
import { updateTaskOrderAction } from "../_actions/update-task-order-action";
import { updateTaskAction } from "../../tasks/_actions/update-task-action";
import { cloneDeep } from "lodash";

interface ProjectListsProps {
  initialLists: ListItem[];
  projectId: string;
}

export const ProjectLists = ({
  initialLists,
  projectId,
}: ProjectListsProps) => {
  const [lists, setLists] = useState(initialLists);

  const reorder = useCallback(
    (list: any[], startIndex: number, endIndex: number) => {
      const result = [...list];
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    },
    []
  );

  const handleListDrag = async (
    sourceIndex: number,
    destinationIndex: number,
    previousLists: ListItem[]
  ) => {
    const reorderedList = reorder(
      previousLists,
      sourceIndex,
      destinationIndex
    ).map((item, index) => ({ ...item, position: index }));

    setLists(reorderedList);

    try {
      const { error, success } = await updateListOrderAction(
        projectId,
        reorderedList
      );

      if (!success) throw new Error(error || "Failed to update list");

      toast.success("List updated successfully");
    } catch (err) {
      toast.error("Failed to update list");
      setLists(previousLists);
    }
  };

  const handleTaskDrag = async (
    source: any,
    destination: any,
    previousLists: ListItem[]
  ) => {
    const sourceList = previousLists.find((l) => l.id === source.droppableId);
    const destinationList = previousLists.find(
      (l) => l.id === destination.droppableId
    );

    console.log("Sources: ", sourceList);
    console.log("Destination: ", destinationList);

    if (!sourceList || !destinationList) return;

    if (source.droppableId === destination.droppableId) {
      const reorderedTasks = reorder(
        sourceList.tasks,
        source.index,
        destination.index
      ).map((task, index) => ({ ...task, position: index }));

      sourceList.tasks = reorderedTasks;

      setLists(
        lists.map((list) =>
          list.id === sourceList.id
            ? { ...sourceList, tasks: reorderedTasks }
            : list
        )
      );

      try {
        const { error, success } = await updateTaskOrderAction(
          projectId,
          destination.droppableId,
          reorderedTasks
        );

        if (!success)
          throw new Error(error || "Failed to update task position");

        toast.success("Task position updated successfully");
      } catch (err) {
        toast.error("Failed to update task position");
        setLists(previousLists);
      }
    } else {
      const [movedTask] = sourceList.tasks.splice(source.index, 1);

      if (!movedTask) return;

      movedTask.listId = destination.droppableId;
      movedTask.status = getStatusFromListTitle(destinationList.title);

      destinationList.tasks.splice(destination.index, 0, movedTask);

      sourceList.tasks.forEach((task, index) => (task.position = index));
      destinationList.tasks.forEach((task, index) => (task.position = index));

      setLists(
        lists.map((list) =>
          list.id === sourceList.id
            ? { ...sourceList, tasks: [...sourceList.tasks] }
            : list.id === destinationList.id
            ? { ...destinationList, tasks: [...destinationList.tasks] }
            : list
        )
      );

      try {
        const results = await Promise.allSettled([
          updateTaskOrderAction(projectId, sourceList.id, sourceList.tasks),
          updateTaskOrderAction(
            projectId,
            destinationList.id,
            destinationList.tasks
          ),
          updateTaskAction(movedTask.id, {
            ...movedTask,
            status: movedTask.status,
          }),
        ]);

        const errors = results
          .filter(
            (result) =>
              result.status === "rejected" ||
              (result.status === "fulfilled" && result.value?.error)
          )
          .map((result) =>
            result.status === "rejected"
              ? (result as PromiseRejectedResult).reason.message ||
                "Unknown error"
              : result.value?.error
          );

        if (errors.length > 0) {
          toast.error(`Failed to move the task. Error: ${errors.join(", ")}`);
          setLists(previousLists);
        } else {
          toast.success("Task moved successfully!");
        }
      } catch {
        toast.error("An unexpected error occurred while moving the task.");
        setLists(previousLists);
      }
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, type } = result;

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    )
      return;

    if (type === "LIST") {
      await handleListDrag(source.index, destination.index, initialLists);
    } else if (type === "TASK") {
      console.log("Initial list: ", initialLists);
      console.log("Prev lists: ", initialLists);
      console.log("Source: ", source);
      console.log("Destination: ", destination);
      console.log("Data: ", initialLists);
      await handleTaskDrag(source, destination, initialLists);
    }
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
