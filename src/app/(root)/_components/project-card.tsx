"use client";

import { MoreVertical, Pin, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ProjectItem } from "@/types";

import { ProjectProgressBar } from "./project-progress-bar";
import { Button } from "@/components/ui/button";

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
    console.log("More options clicked");
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
          <CardOptions />
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

const CardOptions = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <MoreVertical className="h-4 w-4" />
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        className="w-[200px] space-y-2 flex flex-col"
      >
        <Button
          className="flex gap-x-2 items-center justify-start p-1"
          variant="popover"
        >
          <Pin className="h-4 w-4" />
          <p>Pin project</p>
        </Button>
        <Button
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
