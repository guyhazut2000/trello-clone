"use server";

import { auth } from "@clerk/nextjs/server";
import { ListTodo } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { getProjectById } from "@/data-access/projects";
import { Label } from "@/components/ui/label";

import { ProjectLists } from "../_components/project-lists";
import { Metadata, ResolvingMetadata } from "next";
import { shortenString } from "@/lib/utils";

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
    <div className="flex flex-col space-y-6 py-6 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-row justify-between items-center w-full">
        <h2 className="font-bold text-3xl text-gray-800 transition-all duration-300 ease-in-out hover:text-gray-600">
          {project?.title}
        </h2>
      </div>

      <div className="flex flex-col gap-6 bg-white shadow-lg rounded-lg p-6">
        <div className="space-y-2">
          <Label className="text-lg font-semibold text-gray-700">
            Description:
          </Label>
          <p className="text-gray-600">{project?.description}</p>
        </div>
        <div className="flex gap-2 items-center justify-between border-t border-gray-200 pt-4">
          <div className="flex gap-x-2 items-center text-gray-700">
            <ListTodo className="w-5 h-5" />
            <span className="font-medium">Work Items</span>
          </div>
        </div>
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
