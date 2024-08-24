"use client";

import { z } from "zod";
import { PlusIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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

import { createProjectAction } from "../../_actions/create-project-action";
import { createProjectSchema } from "../../projects/validation";

export const CreateProjectForm = () => {
  const [showSheet, setShowSheet] = useState(false);

  return (
    <Sheet open={showSheet} onOpenChange={setShowSheet}>
      <SheetTrigger asChild>
        <Button className="flex items-center justify-center gap-x-2">
          <PlusIcon className="w-4 h-4" />
          Create Project
        </Button>
      </SheetTrigger>
      <SheetContent>
        <CreateProject setShowSheet={setShowSheet} />
      </SheetContent>
    </Sheet>
  );
};

interface CreateProjectProps {
  setShowSheet: (show: boolean) => void;
}

const CreateProject = ({ setShowSheet }: CreateProjectProps) => {
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
                <Input placeholder="project name" {...field} />
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
              <FormLabel>Project Title</FormLabel>
              <FormControl>
                <Input placeholder="project name" {...field} />
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
