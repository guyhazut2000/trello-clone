"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { updateListOrder } from "@/data-access/lists";
import { updateListOrderSchema } from "../validation";
import { ListItem } from "@/types";

export const updateListOrderAction = async (
  values: z.infer<typeof updateListOrderSchema>
) => {
  const validatedValues = updateListOrderSchema.safeParse(values);

  if (!validatedValues.success) {
    throw new Error("Invalid values");
  }

  const transaction = values.tasks.map(
    async (list: Omit<ListItem, "tasks">) => {
      const { projectId, ...result } = await updateListOrder({
        projectId: values.projectId,
        id: list.id,
        title: list.title,
        position: list.position,
        createdAt: list.createdAt,
        updatedAt: list.updatedAt,
      });

      return result;
    }
  );

  await Promise.all(transaction);

  revalidatePath(`/projects/${values.projectId}`);

  return {
    success: true,
  };
};
