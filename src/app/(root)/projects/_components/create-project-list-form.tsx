"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTransition } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/submit-button";

import { createProjectListSchema } from "../validation";
import { createProjectListAction } from "../_actions/create-project-list-action";

interface CreateProjectListFormProps {
  projectId: string;
}

export const CreateProjectListForm = ({
  projectId,
}: CreateProjectListFormProps) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof createProjectListSchema>>({
    resolver: zodResolver(createProjectListSchema),
    defaultValues: {
      title: "",
    },
  });

  const handleCreateProjectList = async (
    values: z.infer<typeof createProjectListSchema>
  ) => {
    console.log(values);
    try {
      startTransition(async () => {
        const { data, success } = await createProjectListAction(
          projectId,
          values
        );
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(handleCreateProjectList)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="List title" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <SubmitButton
          idleText="Create List"
          pending={isPending}
          submittingText="Creating..."
        />
      </form>
    </Form>
  );
};
