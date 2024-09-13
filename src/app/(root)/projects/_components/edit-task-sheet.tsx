"use client";

import { useState } from "react";
import { ChevronRight, Fullscreen } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TaskItem } from "@/types";

import { useParams } from "next/navigation";
import Link from "next/link";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

import { EditTaskForm } from "./edit-task-form";
import { DeleteTaskSheet } from "./delete-task-sheet";

interface EditTaskSheetProps {
  task: TaskItem;
}

export const EditTaskSheet = ({ task }: EditTaskSheetProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const params = useParams<{ projectId: string }>();

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <div className="flex flex-col justify-center p-2 w-full">
          <div className="p-4 flex items-center space-x-2 justify-between w-full cursor-pointer">
            <span className="truncate text-gray-700">{task.title}</span>
            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 transform transition-transform duration-200 ease-in-out group-hover:translate-x-1" />
          </div>
          <div className="flex gap-x-2">
            <Badge>{task.priority}</Badge>
            <Badge>{task.type}</Badge>
          </div>
        </div>
      </SheetTrigger>
      <SheetContent className="w-screen md:w-full">
        <SheetHeader className="w-full">
          <div className="flex flex-row w-full justify-between items-center">
            <SheetTitle>Edit task</SheetTitle>
            <div className="flex gap-x-4 items-center px-6">
              <TaskFullView
                href={`/projects/${params.projectId}/tasks/${task.id}`}
              />
              <DeleteTaskSheet
                taskId={task.id}
                projectId={params.projectId}
                listId={task.listId}
                setSheetOpen={setSheetOpen}
              />
            </div>
          </div>
          <SheetDescription>Here you can edit your task</SheetDescription>
        </SheetHeader>

        <EditTaskForm task={task} setSheetOpen={setSheetOpen} />
      </SheetContent>
    </Sheet>
  );
};

interface TaskFullViewProps {
  href: string;
}

const TaskFullView = ({ href }: TaskFullViewProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild className="bg-gray-100 px-3 py-2 rounded">
          <Link href={href}>
            <Fullscreen className="w-6 h-6" />
          </Link>
        </TooltipTrigger>
        <TooltipContent>Full view</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
