"use client";

import { redirect, useParams, useSearchParams } from "next/navigation";
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
import { TaskStatus, TaskPriority, TaskType, TaskItem } from "@/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { editTaskAction } from "../_actions/edit-task-action";
import { editTaskSchema } from "../validation";
import { SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface EditTaskFormProps {
  task: TaskItem;
  setSheetOpen: (open: boolean) => void;
}

export const EditTaskForm = ({ task, setSheetOpen }: EditTaskFormProps) => {
  const [isPending, startTransition] = useTransition();
  const params = useParams<{ projectId: string }>();

  const projectId = params.projectId;

  if (!projectId) {
    redirect("/projects");
  }

  const form = useForm<z.infer<typeof editTaskSchema>>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
      title: task.title,
      status: task.status,
      priority: task.priority,
      type: task.type,
      description: task.description || "",
      deadline: new Date(task.deadline),
    },
  });

  const handleEditTask = async (values: z.infer<typeof editTaskSchema>) => {
    try {
      startTransition(async () => {
        const { success } = await editTaskAction(projectId, task.id, values);

        if (success) {
          toast.success("Task edited successfully!");
          setSheetOpen(false);
        } else {
          toast.error("Failed to edit task");
        }
      });
    } catch (err) {
      toast.error("Failed to edit task");
    }
  };

  return (
    <Form {...form}>
      <form
        className="space-y-8 w-full"
        onSubmit={form.handleSubmit(handleEditTask)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} autoFocus />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Object.values(TaskStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue defaultValue={field.value} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Object.values(TaskPriority).map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Object.values(TaskType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={10} placeholder="Task description" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button asChild variant={"outline"}>
            <SheetClose>Cancel</SheetClose>
          </Button>
          <SubmitButton
            idleText="Save Changes"
            pending={isPending}
            submittingText="Saving..."
          />
        </div>
      </form>
    </Form>
  );
};
