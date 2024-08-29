"use client";

import { PlusIcon } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { CreateProjectListForm } from "./create-project-list-form";
import { cn } from "@/lib/utils";

interface CreateProjectListSheetProps {
  projectId: string;
  type?: "button" | "default";
}

export const CreateProjectListSheet = ({
  projectId,
  type = "default",
}: CreateProjectListSheetProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className={cn(
            type === "default" && "bg-gray-100 gap-x-2 h-80 w-60",
            type === "button" && buttonVariants({ variant: "ghost" })
          )}
        >
          Create New List
          <PlusIcon className="w-4 h-4 ml-2" />
        </Button>
      </SheetTrigger>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Create new project list</SheetTitle>
          <SheetDescription>
            Add a new list to the current project. This will help you organize
            your tasks. You can later move tasks between lists.
          </SheetDescription>
        </SheetHeader>
        <CreateProjectListForm projectId={projectId} />
      </SheetContent>
    </Sheet>
  );
};
