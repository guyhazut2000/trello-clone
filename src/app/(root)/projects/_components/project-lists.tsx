"use client";

import { ChevronRight } from "lucide-react";
import {
  Draggable,
  Droppable,
  DragDropContext,
  DropResult,
} from "@hello-pangea/dnd";

import { CreateTaskSheet } from "./create-task-sheet";
import { DeleteListButton } from "./delete-list-button";
import { CreateProjectListSheet } from "./create-project-list-sheet";
import { ListItem, TaskItem } from "@/types";
import { updateListOrderAction } from "../_actions/update-list-order-action";
import { toast } from "sonner";

interface ProjectListsProps {
  lists: ListItem[];
  projectId: string;
}

const sortListByPosition = (a: ListItem, b: ListItem) => {
  return a.position - b.position;
};

const sortTasksByPosition = (a: TaskItem, b: TaskItem) => {
  return a.position - b.position;
};

export const ProjectLists = ({ lists, projectId }: ProjectListsProps) => {
  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, type, draggableId } = result;

    if (!destination) return;

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // User move a list
    if (type === "LIST") {
      const reorderedList = reorder(lists, source.index, destination.index).map(
        (item, index) => ({
          ...item,
          position: index,
        })
      );
      console.log(reorderedList);

      // Dispatch server action
      console.log("Start: ", source.index);
      console.log("End: ", destination.index);
      const { success } = await updateListOrderAction({
        projectId,
        tasks: reorderedList,
      });
      if (success) {
        toast.success("List order updated successfully");
      } else {
        toast.error("Failed to update list order");
      }
    }

    if (type === "TASK") {
      const sourceList = lists.find((l) => l.id === source.droppableId);
      const DestinationList = lists.find(
        (l) => l.id === destination.droppableId
      );

      if (!sourceList || !DestinationList) {
        return;
      }

      if (!sourceList.tasks) {
        sourceList.tasks = [];
      }

      if (!DestinationList.tasks) {
        DestinationList.tasks = [];
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
        console.log(sourceList);
        // Dispatch server action

        // User move the task to another list
      } else {
        const [movedTask] = sourceList.tasks.splice(source.index, 1);

        movedTask.listId = destination.droppableId;
        DestinationList.tasks.splice(destination.index, 0, movedTask);

        sourceList.tasks.forEach((task, index) => {
          task.position = index;
        });

        DestinationList.tasks.forEach((task, index) => {
          task.position = index;
        });
      }
    }

    // Add logic to update the positions of lists and tasks in your state and/or backend
  };

  const reorder = (list: any[], startIndex: number, lastIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(lastIndex, 0, removed);

    console.log("Result: ", result);
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
                <Draggable
                  key={list.id}
                  draggableId={`list-${list.id}`}
                  index={index}
                >
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

                      <Droppable droppableId={`list-${list.id}`} type="TASK">
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
                <CreateProjectListSheet projectId={projectId} />
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
