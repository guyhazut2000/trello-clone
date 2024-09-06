"use server";

import { revalidatePath } from "next/cache";

import { updateListsOrder } from "@/data-access/lists";
import { ListItem } from "@/types";

export const updateListOrderAction = async (
  projectId: string,
  lists: ListItem[]
) => {
  try {
    await updateListsOrder(projectId, lists);

    revalidatePath(`/projects/${projectId}`);

    return {
      success: true,
    };
  } catch (err) {
    return {
      error: "Failed to update list order",
    };
  }
};
