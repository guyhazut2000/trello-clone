"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { deleteListAction } from "../_actions/delete-list-action";

interface DeleteListButtonProps {
  listId: string;
  projectId: string;
}

export const DeleteListButton = ({
  listId,
  projectId,
}: DeleteListButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const handleDeleteList = async () => {
    try {
      startTransition(async () => {
        const { success, error } = await deleteListAction(projectId, listId);
        if (success) {
          toast.success("List deleted successfully!");
        } else {
          toast.error(error || "Failed to delete list");
        }
      });
    } catch (error) {
      toast.error("Failed to delete list");
    }
  };

  return (
    <button
      disabled={isPending}
      onClick={handleDeleteList}
      className="text-red-500 hover:text-red-700 transition-colors duration-200"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  );
};
