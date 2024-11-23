"use server";

import { getUserByExternalId } from "@/data-access/user";
import { auth } from "@clerk/nextjs/server";

export const getDatabaseSyncStatus = async () => {
  try {
    // Get the user id from clerk
    const { userId } = auth();

    // If no user id, return false
    if (!userId) return { isUserSynced: false };

    // Get the user from the database
    const user = await getUserByExternalId(userId);

    return { isUserSynced: !!user };
  } catch (error) {
    return { isUserSynced: false };
  }
};
