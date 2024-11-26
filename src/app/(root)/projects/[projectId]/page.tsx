"use server";

import { auth } from "@clerk/nextjs/server";
import { ListTodo } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { getProjectById } from "@/data-access/project";
import { Metadata, ResolvingMetadata } from "next";
import { Label } from "@/components/ui/label";

import { ProjectLists } from "../_components/project-lists";
import { shortenString } from "@/lib/utils";
import { CreateTaskSheet } from "../_components/create-task-sheet";
import { Heading } from "@/components/heading";
import { TaskSearchInput } from "../_components/task-search-input";

type Props = {
  params: { projectId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const project = await getProjectById(params.projectId);

  return {
    title: shortenString(project?.title, 20) || "Project",
  };
}

export default async function ProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  const { userId } = auth();

  if (!userId) redirect("/");

  const project = await getProjectById(params.projectId);

  if (!project) throw notFound();

  return (
    <div className="flex flex-col space-y-6 py-6 w-full px-4 sm:px-6 lg:px-8">
      <div className="flex w-full justify-between items-center">
        <div className="flex flex-col w-1/2 space-y-1">
          <Heading className="font-bold text-3xl text-gray-800 transition-all duration-300 ease-in-out hover:text-gray-600">
            {project?.title}
          </Heading>
          <p className="text-gray-500 text-sm">{project?.description}</p>
        </div>
        <CreateTaskSheet projectId={params.projectId} />
      </div>

      <div className="flex flex-col gap-6 bg-white rounded-lg">
        <section className="mt-6">
          <ProjectLists
            initialLists={project.lists}
            projectId={params.projectId}
          />
        </section>
      </div>
    </div>
  );
}
