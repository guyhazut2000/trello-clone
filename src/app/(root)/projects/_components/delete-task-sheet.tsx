"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Trash } from "lucide-react";

import { deleteTaskAction } from "../_actions/delete-task-action";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface DeleteTaskSheetProps {
  taskId: string;
  listId: string;
  projectId: string;
  setSheetOpen: (open: boolean) => void;
}

export const DeleteTaskSheet = ({
  taskId,
  projectId,
  listId,
  setSheetOpen,
}: DeleteTaskSheetProps) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDeleteTask = async () => {
    try {
      startTransition(async () => {
        const { success } = await deleteTaskAction(projectId, listId, taskId);

        if (success) {
          toast.success("Task deleted successfully!");
          setSheetOpen(false);
        } else {
          toast.error("Failed to delete task");
        }
      });
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Trash className="h-6 w-6 text-red-500 cursor-pointer hover:bg-gray-100 transition-all" />
      </SheetTrigger>
      <SheetContent className="w-full" isNested>
        <SheetHeader>
          <SheetTitle>Delete Task</SheetTitle>
          <SheetDescription>
            Are you sure you want to delete this task? This action cannot be
            undone.
          </SheetDescription>
        </SheetHeader>

        <SheetFooter className="flex justify-center w-full space-x-2 mt-4 ">
          <Button
            className="w-full"
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="w-full"
            variant="destructive"
            onClick={handleDeleteTask}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete Task"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
