"use server";

import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

import { getTaskById } from "@/data-access/task";
import { PageWrapper } from "@/components/page-wrapper";
import TaskDetailView from "@/components/task-details-view";

interface TaskPageProps {
  params: {
    projectId: string;
    taskId: string;
  };
}

export default async function TaskPage({
  params: { taskId, projectId },
}: TaskPageProps) {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  const task = await getTaskById(taskId, { include: { list: true } });

  if (!task) {
    throw notFound();
  }

  return (
    <PageWrapper>
      <TaskDetailView task={task} projectId={projectId} listId={task.listId} />
    </PageWrapper>
  );
}
