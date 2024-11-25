import { CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { timeAgo } from "@/lib/utils";
import { Clock } from "lucide-react";
import React from "react";

interface ProjectProgressBarProps {
  completedTasks: number;
  totalTasks: number;
}

export const ProjectProgressBar = ({
  completedTasks,
  totalTasks,
}: ProjectProgressBarProps) => {
  const percentage =
    totalTasks === 0 ? 0 : Math.floor((completedTasks / totalTasks) * 100);

  return (
    <div className="flex flex-col w-full space-y-2">
      <div className="flex flex-row justify-between items-center">
        <p className="text-sm">{percentage}% completed</p>
        <p className="text-sm">
          {completedTasks}/{totalTasks} tasks
        </p>
      </div>
      <Progress value={percentage} />
    </div>
  );
};
