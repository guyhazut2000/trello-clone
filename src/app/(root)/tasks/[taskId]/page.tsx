"use server";

import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { getTaskById } from "@/data-access/task";

interface TaskPageProps {
  params: {
    projectId: string;
    taskId: string;
  };
}

export default async function TaskPage({ params: { taskId } }: TaskPageProps) {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  const task = await getTaskById(taskId, { include: { list: true } });
  console.log(task);

  if (!task) {
    throw notFound();
  }

  return <div>{taskId}</div>;
}
