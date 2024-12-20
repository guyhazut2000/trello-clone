import { Webhook } from "svix";
import { headers } from "next/headers";
import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  // Get the webhook signing secret from your environment variables
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Missing WEBHOOK_SECRET");
    return new Response("Missing WEBHOOK_SECRET", { status: 500 });
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing svix headers");
    return new Response("Missing svix headers", { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  try {
    evt = new Webhook(WEBHOOK_SECRET).verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }

  // Handle the webhook event
  try {
    const eventType = evt.type;

    if (eventType === "user.created") {
      const {
        id,
        first_name,
        last_name,
        email_addresses,
        username,
        image_url,
        phone_numbers,
        external_accounts,
        created_at,
        updated_at,
      } = evt.data;

      const primaryEmail = email_addresses?.[0]?.email_address;
      const primaryPhone = phone_numbers?.[0]?.phone_number;
      const externalAccount = external_accounts?.[0];

      const user = await prisma.user.create({
        data: {
          email: primaryEmail,
          name: `${first_name || ""} ${last_name || ""}`.trim(),
          firstName: first_name as string,
          lastName: last_name as string,
          imageUrl: image_url as string,
          username: username as string,
          phoneNumber: primaryPhone,

          // External provider info (if user signed up with OAuth)
          externalId: id,
          provider: externalAccount?.provider,

          // Timestamps
          lastSignInAt: new Date(),
          createdAt: new Date(created_at),
          updatedAt: new Date(updated_at),
        },
      });

      const client = clerkClient();

      // Update the Clerk metadata (store custom user ID in metadata)
      await client.users.updateUserMetadata(id, {
        publicMetadata: {
          role: user.role,
          appUserId: user.id,
        },
      });

      console.log("User created successfully:", id);
      return new Response("User created", { status: 201 });
    }

    return new Response("Webhook processed", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(
      `Error processing webhook: ${(error as Error).message}`,
      { status: 500 }
    );
  }
}
