"use client";

import { z } from "zod";
import { PlusIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/submit-button";

import { createProjectSchema } from "../projects/validation";
import { createProjectAction } from "../projects/_actions/create-project-action";
import { ShinyButton } from "@/components/shiny-button";
import { toast } from "sonner";

export const CreateProjectSheet = () => {
  const [showSheet, setShowSheet] = useState(false);

  return (
    <Sheet open={showSheet} onOpenChange={setShowSheet}>
      <SheetTrigger asChild>
        <ShinyButton className="flex items-center justify-center gap-x-2">
          Set Up Your New Project
        </ShinyButton>
      </SheetTrigger>
      <SheetContent className="gap-4 flex flex-col">
        <SheetHeader className="mb-6">
          <SheetTitle>New Project Setup</SheetTitle>
          <SheetDescription>
            Complete the form below to configure your project and kick-start
            your next big idea.{" "}
          </SheetDescription>
        </SheetHeader>
        <CreateProjectForm setShowSheet={setShowSheet} />
      </SheetContent>
    </Sheet>
  );
};

interface CreateProjectFormProps {
  setShowSheet: (show: boolean) => void;
}

const CreateProjectForm = ({ setShowSheet }: CreateProjectFormProps) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const handleCreateProject = async (
    values: z.infer<typeof createProjectSchema>
  ) => {
    startTransition(async () => {
      const { data, success } = await createProjectAction(values);

      if (success) {
        form.reset();
        setShowSheet(false);

        toast.success("Project created successfully!");
      } else {
        toast.error("Failed to create project");
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateProject)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter project title..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Description</FormLabel>
              <FormControl>
                <Textarea
                  rows={12}
                  placeholder="Enter a brief description of the project..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton
          pending={isPending}
          disabled={isPending || !form.formState.isValid}
          idleText="Create Project"
          submittingText="Creating..."
        />
      </form>
    </Form>
  );
};
