"use server";

import { User2Icon } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getProjectsByUserId } from "@/data-access/project";
import { CreateProjectAnimation } from "@/components/animations/create-project-animation";

import { CreateProjectSheet } from "../_components/create-project-sheet";
import { ProjectList } from "../_components/project-list";

export default async function ProjectsPage() {
  const { userId: ClerkUserId, sessionClaims } = auth();
  const appUserId = sessionClaims?.metadata.appUserId;
  if (!ClerkUserId || !appUserId) {
    return redirect("/");
  }

  const projects = await getProjectsByUserId(appUserId, {
    sort: "updatedAt",
  });

  if (projects.length === 0) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-full text-center text-neutral-500">
        <CreateProjectAnimation />
        No projects found. Click the Button below to create a new project.
        <CreateProjectSheet />
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-8 w-full h-full py-4">
      <div className="text-primary flex items-center font-semibold text-lg text-neutral-700">
        <User2Icon className="h-6 w-6 mr-2" />
        Your Projects
      </div>

      <ProjectList projects={projects} />
    </div>
  );
}
