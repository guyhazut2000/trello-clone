"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";

import { TaskItem, TaskPriority, TaskStatus, TaskType } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeleteTaskSheet } from "@/app/(root)/projects/_components/delete-task-sheet";
import { Input } from "@/components/ui/input";
import useClickOutside from "@/hooks/useOnClickOutside";
import { updateTaskAction } from "@/app/(root)/tasks/_actions/update-task-action";
import { getListByTitle } from "@/data-access/list";

interface TaskDetailViewProps {
  projectId: string;
  listId: string;
  task: TaskItem;
}

export default function TaskDetailView({
  task,
  projectId,
  listId,
}: TaskDetailViewProps) {
  const [status, setStatus] = useState(task.status);

  const { ref, handleInputChange } = useClickOutside(async () => {
    try {
      const { success, error } = await updateTaskAction(
        task.id,
        {
          title: ref.current?.value || task.title,
        },
        projectId
      );

      if (success) {
        toast.success("Task updated successfully");
      } else {
        toast.error("Failed to update task");
      }
    } catch (err) {
      toast.error("Failed to update task");
    }
  });

  return (
    <div className="container mx-auto ">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Button
            asChild
            variant={"link"}
            className="px-0 text-sm text-blue-500"
          >
            <Link href={"/tasks"}>All Work Items</Link>
          </Button>
          <span className="text-sm text-gray-500">&gt;</span>
          <span className="text-sm font-semibold select-none">
            {task.title}
          </span>
        </div>
        <DeleteTaskSheet
          taskId={task.id}
          projectId={projectId}
          listId={listId}
          isNested={false}
          redirect
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            <Input
              ref={ref}
              onChange={handleInputChange}
              defaultValue={task.title}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2 mb-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 select-none">
                Status
              </label>
              <Select
                defaultValue={task.status}
                onValueChange={async (newStatus: keyof typeof TaskStatus) => {
                  try {
                    if (newStatus === task.status) return;

                    const { success } = await updateTaskAction(
                      task.id,
                      {
                        status: newStatus,
                        listId: listId,
                      },
                      projectId
                    );
                    if (success) {
                      toast.success("Task status updated successfully");
                    } else {
                      toast.error("Failed to update task status");
                    }
                  } catch (err) {
                    console.log(err);
                    toast.error("Failed to update task status");
                  }
                }}
              >
                <SelectTrigger className="w-full mt-1 ">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TaskStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 select-none">
                Priority
              </label>
              <Select
                defaultValue={task.priority}
                onValueChange={async (
                  newPriority: keyof typeof TaskPriority
                ) => {
                  try {
                    const { success } = await updateTaskAction(
                      task.id,
                      { priority: newPriority },
                      projectId
                    );
                    if (success) {
                      toast.success("Task priority updated successfully");
                    } else {
                      toast.error("Failed to update task priority");
                    }
                  } catch (err) {
                    toast.error("Failed to update task priority");
                  }
                }}
              >
                <SelectTrigger className="w-full mt-1 ">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TaskPriority).map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 select-none">
                Type
              </label>
              <Select
                defaultValue={task.type}
                onValueChange={async (newType: keyof typeof TaskType) => {
                  try {
                    const { success } = await updateTaskAction(
                      task.id,
                      { type: newType },
                      projectId
                    );
                    if (success) {
                      toast.success("Task type updated successfully");
                    } else {
                      toast.error("Failed to update task type");
                    }
                  } catch (err) {
                    toast.error("Failed to update task type");
                  }
                }}
              >
                <SelectTrigger className="w-full mt-1 ">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TaskType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Textarea
              placeholder="Enter task description"
              rows={8}
              defaultValue={task.description || ""}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="comments" className="mt-4">
        <TabsList>
          <TabsTrigger value="comments">Comments (0)</TabsTrigger>
          <TabsTrigger value="images">Images (0)</TabsTrigger>
        </TabsList>
        <TabsContent value="comments">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">
                No comments yet, post one below
              </p>
              <Textarea
                placeholder="Post a comment"
                className="w-full mt-4 h-32"
              />
              <div className="flex justify-end mt-2">
                <Button>Post Comment</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="images">
          <Card>
            <CardContent>
              <p className="text-center text-gray-500">
                No images uploaded yet
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
