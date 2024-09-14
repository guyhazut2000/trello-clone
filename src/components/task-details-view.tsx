"use client";

import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

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
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Button asChild variant={"link"} className="text-sm text-blue-500">
            <Link href={"/tasks"}>All Work Items</Link>
          </Button>
          <span className="text-sm text-gray-500">&gt;</span>
          <span className="text-sm font-semibold">{task.title}</span>
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
          <CardTitle className="text-2xl font-bold">{task.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <Select defaultValue={task.status}>
                <SelectTrigger className="w-full mt-1">
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
              <label className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <Select defaultValue={task.priority}>
                <SelectTrigger className="w-full mt-1">
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
              <label className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <Select defaultValue={task.type}>
                <SelectTrigger className="w-full mt-1">
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
              defaultValue={task.description || ""}
              className="w-full h-64"
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
