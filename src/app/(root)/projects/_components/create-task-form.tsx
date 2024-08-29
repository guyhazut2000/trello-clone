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

import { createTaskSchema } from "../validation";
import { createTaskAction } from "../_actions/create-task-action";
import { toast } from "sonner";

interface CreateTaskFormProps {
  listId: string;
  projectId: string;
  setSheetOpen: (open: boolean) => void;
}

export const CreateTaskForm = ({
  projectId,
  listId,
  setSheetOpen,
}: CreateTaskFormProps) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
    },
  });

  const handleCreateTask = async (values: z.infer<typeof createTaskSchema>) => {
    console.log(values);
    try {
      startTransition(async () => {
        const { data, success } = await createTaskAction(
          projectId,
          listId,
          values
        );

        if (success) {
          form.reset();
          toast.success("Task created successfully");
          setSheetOpen(false);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Form {...form}>
      <form
        autoFocus={false}
        className="space-y-4"
        onSubmit={form.handleSubmit(handleCreateTask)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Task title" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <SubmitButton
          idleText="Create Task"
          pending={isPending}
          submittingText="Creating..."
        />
      </form>
    </Form>
  );
};
