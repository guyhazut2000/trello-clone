"use client";

import { MoreVertical, Pin, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  Card,
  CardContent,
  CardDescription,
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
import DeleteProjectAlert from "./delete-project-alert";

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

  const handleProjectCardClick = () => {
    router.push(`/projects/${project.id}`);
  };

  const handleMoreClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <Card
      className="w-[300px] cursor-pointer hover:bg-gray-50"
      onClick={handleProjectCardClick}
    >
      <CardHeader className="relative">
        <CardTitle>{project.title}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
        <span
          onClick={handleMoreClick}
          className="absolute right-4 top-4 p-2 cursor-pointer hover:bg-gray-100 rounded-lg"
        >
          <CardOptions projectId={project.id} isPinned={project.isPinned} />
        </span>
      </CardHeader>
      <CardContent>
        <ProjectProgressBar
          completedTasks={completedTasks}
          totalTasks={totalTasks}
          lastUpdate={project.updatedAt}
        />
      </CardContent>
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
          toast.success("Project pinned successfully!");
        } else {
          toast.error(error || "Failed to pin project");
        }
      });
    } catch (error) {
      toast.error((error as Error).message || "Failed to delete project");
    }
  };

  const handleDeleteProject = async () => {
    try {
      startDeleteProjectTransition(async () => {
        const { success, error } = await deleteProjectAction(projectId);
        if (success) {
          toast.success("Project Deleted successfully!");
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
        <MoreVertical className="h-4 w-4" />
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        className="w-[200px] space-y-2 flex flex-col"
        onOpenAutoFocus={(e) => e.preventDefault()} // disable auto focus when visible
      >
        <Button
          disabled={isPinTogglePending}
          onClick={handleMarkProjectAsPinned}
          className="flex gap-x-2 items-center justify-start p-1"
          variant="ghost"
        >
          {isPinTogglePending ? (
            <Loader />
          ) : (
            <>
              <Pin className="h-4 w-4" />
              <span>{isPinned ? "Unpin" : "Pin"}</span>
            </>
          )}
        </Button>
        <Button
          disabled={isDeleteProjectPending}
          variant="ghost"
          className="flex gap-x-2 items-center justify-start text-red-500 hover:text-red-500 p-1"
        >
          {isDeleteProjectPending ? (
            <Loader />
          ) : (
            <DeleteProjectAlert
              onDelete={handleDeleteProject}
              setShowPopover={setShowPopover}
            />
          )}
        </Button>
      </PopoverContent>
    </Popover>
  );
};
