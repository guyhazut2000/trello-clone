import { UserRole } from "@prisma/client";

export {};

// Create a type for the roles
export type Roles = UserRole;

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role: Roles;
      appUserId: string;
    };
  }
}
