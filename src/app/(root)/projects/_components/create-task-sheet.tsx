"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { CreateTaskForm } from "./create-task-form";

interface CreateTaskSheetProps {
  listId: string;
  projectId: string;
}

export const CreateTaskSheet = ({
  listId,
  projectId,
}: CreateTaskSheetProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger>
        <Button asChild variant={"outline"}>
          <div className="flex gap-x-2 items-center justify-start">
            Create new Task
            <PlusIcon className="w-4 h-4" />
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create Task</SheetTitle>
          <SheetDescription>
            Add a new task to the current board.
          </SheetDescription>
        </SheetHeader>
        <CreateTaskForm
          listId={listId}
          projectId={projectId}
          setSheetOpen={setSheetOpen}
        />
      </SheetContent>
    </Sheet>
  );
};
