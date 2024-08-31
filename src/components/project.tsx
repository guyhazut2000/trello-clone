"use client";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { ProjectItem } from "@/types";
import { List } from "./list";

interface ProjectProps {
  project: ProjectItem;
}

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  // optional styling logic for when an item is being dragged
  background: isDragging ? "lightgreen" : "white",
  ...draggableStyle,
});

const Project = ({ project }: ProjectProps) => {
  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    // Add logic to reorder lists or tasks based on result
  };

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {project.lists.map((list, index) => (
                <Draggable key={list.id} draggableId={list.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <List
                        key={list.id}
                        list={list}
                        tasks={list.tasks}
                        index={index}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Project;
