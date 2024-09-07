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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/submit-button";

import { createProjectSchema } from "../projects/validation";
import { createProjectAction } from "../projects/_actions/create-project-action";

export const CreateProjectSheet = () => {
  const [showSheet, setShowSheet] = useState(false);

  return (
    <Sheet open={showSheet} onOpenChange={setShowSheet}>
      <SheetTrigger asChild>
        <Button className="flex items-center justify-center gap-x-2">
          <PlusIcon className="w-4 h-4" />
          Create Project
        </Button>
      </SheetTrigger>
      <SheetContent className="gap-4 flex flex-col">
        <SheetHeader>
          <SheetTitle>Create Project</SheetTitle>
          <SheetDescription>Create your project here. </SheetDescription>
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
              <FormDescription>
                This is your project display name.
              </FormDescription>
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
                <Input
                  placeholder="Enter a brief description of the project..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is your project display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton
          pending={isPending}
          idleText="Create Project"
          submittingText="Creating..."
        />
      </form>
    </Form>
  );
};
