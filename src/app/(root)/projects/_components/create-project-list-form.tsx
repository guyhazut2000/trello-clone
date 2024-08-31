"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTransition } from "react";
import { toast } from "sonner";

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
import { createProjectListAction } from "../_actions/create-list-action";

interface CreateProjectListFormProps {
  projectId: string;
  setSheetOpen: (open: boolean) => void;
}

export const CreateProjectListForm = ({
  projectId,
  setSheetOpen,
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
    try {
      startTransition(async () => {
        const { data, success } = await createProjectListAction(
          projectId,
          values
        );
        if (success) {
          toast.success("List created successfully!");
          setSheetOpen(false);
        } else {
          toast.error("Failed to create list");
        }
      });
    } catch (err) {
      toast.error("Failed to create list");
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
