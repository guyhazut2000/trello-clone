"use client";

import { useState } from "react";
import { ChevronRight, Fullscreen } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TaskBadge from "@/components/task-badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TaskItem } from "@/types";

import { EditTaskForm } from "./edit-task-form";
import { DeleteTaskSheet } from "./delete-task-sheet";
import { TaskStatus } from "@prisma/client";
import clsx from "clsx";

interface EditTaskSheetProps {
  task: TaskItem;
}

export const EditTaskSheet = ({ task }: EditTaskSheetProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const params = useParams<{ projectId: string }>();

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <div className="flex flex-col justify-center w-full">
          <div className="p-2 py-4 flex items-center space-x-2 justify-between w-full cursor-pointer">
            <span className="truncate text-gray-700">{task.title}</span>
          </div>
          <div className="flex gap-x-2">
            <TaskBadge  priority={task.priority} />
            <TaskBadge type={task.type} />
          </div>
        </div>
      </SheetTrigger>
      <SheetContent
        className="w-screen md:w-full space-y-4"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader className="w-full">
          <div className="flex flex-row w-full justify-between items-center">
            <SheetTitle>Edit task</SheetTitle>
            <div className="flex gap-x-1 items-center px-2">
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
          <SheetDescription className="py-2">
            Make changes to your task here. Click save when you're done.
          </SheetDescription>
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
