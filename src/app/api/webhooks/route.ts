import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
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
    console.log(`Processing webhook: ${eventType}`);

    if (eventType === "user.created") {
      const { id, email_addresses, image_url, first_name, last_name } =
        evt.data;

      await prisma.user.create({
        data: {
          externalId: id as string,
          email: email_addresses[0]?.email_address,
          name: `${first_name || ""} ${last_name || ""}`.trim(),
          imageUrl: image_url,
        },
      });
      console.log("User created successfully:", id);
    }

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response("Error processing webhook", { status: 500 });
  }
}
