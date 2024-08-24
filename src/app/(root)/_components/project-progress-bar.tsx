import { Progress } from "@/components/ui/progress";
import { timeAgo } from "@/lib/utils";
import React from "react";

interface ProjectProgressBarProps {
  completedTask: number;
  totalTasks: number;
  lastUpdate: Date;
}

export const ProjectProgressBar = ({
  completedTask,
  totalTasks,
  lastUpdate,
}: ProjectProgressBarProps) => {
  const percentage = Math.round((completedTask / totalTasks) * 100);

  return (
    <div className="flex flex-col w-full space-y-2">
      <div className="flex flex-row justify-between items-center">
        <p className="text-sm">{percentage}% completed</p>
        <p className="text-sm">
          {completedTask}/{totalTasks} tasks
        </p>
      </div>
      <Progress value={percentage} />
      <div className="text-sm">Last updated {timeAgo(lastUpdate)}</div>
    </div>
  );
};
