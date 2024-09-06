"use client";

import { MoreVertical, Pin, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

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

interface ProjectCardProps {
  project: ProjectItem;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
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
          completedTask={7}
          totalTasks={11}
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
  const [isPending, startTransition] = useTransition();

  const handleMarkProjectAsPinned = async () => {
    try {
      startTransition(async () => {
        const { success, error } = await TogglePinProjectAction(projectId);
        if (success) {
          toast.success("Project pinned successfully!");
        } else {
          toast.error(error || "Failed to pin project");
        }
      });
    } catch (error) {}
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <MoreVertical className="h-4 w-4" />
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        className="w-[200px] space-y-2 flex flex-col"
        onOpenAutoFocus={(e) => e.preventDefault()} // disable auto focus when visible
      >
        <Button
          disabled={isPending}
          onClick={handleMarkProjectAsPinned}
          className="flex gap-x-2 items-center justify-start p-1"
          variant="popover"
        >
          {isPending ? (
            <Loader />
          ) : (
            <>
              <Pin className="h-4 w-4" />
              <span>{isPinned ? "Un Pin" : "Pin"}</span>
            </>
          )}
        </Button>
        <Button
          disabled={isPending}
          variant="popover"
          className="flex gap-x-2 items-center justify-start text-red-500 hover:text-red-500 p-1"
        >
          <Trash2 className="h-4 w-4" />
          <p>Delete project</p>
        </Button>
      </PopoverContent>
    </Popover>
  );
};
