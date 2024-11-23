"use server";

import prisma from "@/lib/db";

export const getUserByExternalId = async (userId: string) => {
  const foundExternalUser = await prisma.user.findUnique({
    where: {
      externalId: userId,
    },
  });

  return foundExternalUser;
};
