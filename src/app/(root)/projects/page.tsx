"use server";

import { User2Icon } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getProjectsByUserId } from "@/data-access/project";
import { CreateProjectAnimation } from "@/components/animations/create-project-animation";

import { CreateProjectSheet } from "../_components/create-project-sheet";
import { ProjectList } from "../_components/project-list";
import { PageWrapper } from "@/components/page-wrapper";
import { Heading } from "@/components/heading";

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
    <PageWrapper>
      <Heading>
        <User2Icon className="h-6 w-6 mr-2" />
        Projects
      </Heading>

      <ProjectList projects={projects} />
    </PageWrapper>
  );
}
