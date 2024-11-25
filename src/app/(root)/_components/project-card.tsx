"use client";

import { Clock, MoreVertical, Pin, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ProjectItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/loader";
import { ProjectProgressBar } from "./project-progress-bar";
import { TogglePinProjectAction } from "../projects/_actions/toggle-pin-project-action";
import { deleteProjectAction } from "../projects/_actions/delete-project-action";
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
import { timeAgo } from "@/lib/utils";

interface ProjectCardProps {
  project: ProjectItem;
  totalTasks: number;
  completedTasks: number;
}

export const ProjectCard = ({
  project,
  totalTasks,
  completedTasks,
}: ProjectCardProps) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleProjectCardClick = () => {
    router.push(`/projects/${project.id}`);
  };

  return (
    <Card
      className="group relative transition-all duration-300 hover:shadow-md cursor-pointer space-y-6 hover:ring-green-100 hover:ring-4"
      onClick={handleProjectCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="relative flex flex-col pb-2">
        <CardTitle className="text-lg font-semibold line-clamp-1">
          {project.title}
        </CardTitle>
        <CardDescription className="text-sm mt-1 mb-2 line-clamp-2">
          {project.description}
        </CardDescription>
        <div
          className={`absolute right-4 top-4 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <CardOptions projectId={project.id} isPinned={project.isPinned} />
        </div>
      </CardHeader>
      <CardContent>
        <ProjectProgressBar
          completedTasks={completedTasks}
          totalTasks={totalTasks}
        />
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="mr-2 h-4 w-4" />
          Last updated {timeAgo(project.updatedAt)}
        </div>
      </CardFooter>
    </Card>
  );
};

interface CardOptionsProps {
  projectId: string;
  isPinned: boolean;
}

const CardOptions = ({ projectId, isPinned }: CardOptionsProps) => {
  const [isPinTogglePending, startPinToggleTransition] = useTransition();
  const [isDeleteProjectPending, startDeleteProjectTransition] =
    useTransition();
  const [showPopover, setShowPopover] = useState(false);

  const handleMarkProjectAsPinned = async () => {
    try {
      startPinToggleTransition(async () => {
        const { success, error } = await TogglePinProjectAction(projectId);
        if (success) {
          toast.success(
            isPinned
              ? "Project unpinned successfully!"
              : "Project pinned successfully!"
          );
        } else {
          toast.error(error || "Failed to update project pin status");
        }
      });
    } catch (error) {
      toast.error(
        (error as Error).message || "Failed to update project pin status"
      );
    }
  };

  const handleDeleteProject = async () => {
    try {
      startDeleteProjectTransition(async () => {
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve("ok");
          }, 2000);
        });
        const { success, error } = await deleteProjectAction(projectId);
        if (success) {
          toast.success("Project deleted successfully!");
          setShowPopover(false);
        } else {
          toast.error(error || "Failed to delete project");
        }
      });
    } catch (error) {
      toast.error((error as Error).message || "Failed to delete project");
    }
  };

  return (
    <Popover open={showPopover} onOpenChange={setShowPopover}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Project options</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" className="w-56 p-1">
        <div className="flex flex-col space-y-2 p-2">
          <Button
            disabled={isPinTogglePending}
            onClick={handleMarkProjectAsPinned}
            className="justify-start gap-x-2 flex items-center"
            variant="ghost"
          >
            {isPinTogglePending ? <Loader /> : <Pin className="mr-2 h-4 w-4" />}
            {isPinned ? "Unpin" : "Pin"}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild className="focus-visible::bg-red-500">
              <Button
                disabled={isDeleteProjectPending}
                variant="destructive"
                className="justify-start focus-visible::bg-red-500 gap-x-2 flex items-center"
              >
                {isDeleteProjectPending ? (
                  <Loader />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                {isDeleteProjectPending ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="space-y-12 p-8">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete this project?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  project and all associated tasks.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="w-full flex items-center justify-between">
                <AlertDialogCancel className="w-full">Cancel</AlertDialogCancel>
                <Button asChild variant={"destructive"} className="w-full">
                  <AlertDialogAction
                    onClick={handleDeleteProject}
                    className="flex items-center gap-x-2"
                  >
                    {isDeleteProjectPending ? (
                      <Loader />
                    ) : (
                      <Trash2 className="mr-2 h-4 w-4" />
                    )}
                    Delete
                  </AlertDialogAction>
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </PopoverContent>
    </Popover>
  );
};
