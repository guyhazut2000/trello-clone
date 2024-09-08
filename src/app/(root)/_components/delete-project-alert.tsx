import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteProjectAlertProps {
  onDelete: () => void;
  setShowPopover: (open: boolean) => void;
}

export default function DeleteProjectAlert({
  onDelete,
  setShowPopover,
}: DeleteProjectAlertProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="flex gap-x-2">
          <Trash2 className="h-4 w-4" />
          Delete project
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[300px] md:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            project and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setShowPopover(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
