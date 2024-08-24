"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PlusIcon } from "lucide-react";

export const CreateTaskSheet = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Button asChild>
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
      </SheetContent>
    </Sheet>
  );
};
