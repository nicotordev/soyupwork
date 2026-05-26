import { UserRole } from "@/generated/prisma/client";
import prisma from "@/lib/db/prisma";
import { anonymizedEmail, getPrimaryEmail } from "@/lib/webhooks/shared";

type ClerkEmailAddress = {
  email_address: string;
};

type ClerkUserData = {
  id: string;
  email_addresses?: ClerkEmailAddress[];
  first_name?: string | null;
  last_name?: string | null;
  image_url?: string | null;
};

type ClerkWebhookEvent = {
  type: string;
  data: ClerkUserData;
};

function parseClerkEvent(payload: unknown): ClerkWebhookEvent {
  if (
    typeof payload !== "object" ||
    payload === null ||
    !("type" in payload) ||
    !("data" in payload)
  ) {
    throw new Error("Invalid Clerk webhook payload");
  }
  return payload as ClerkWebhookEvent;
}

export async function handleClerkWebhook(payload: unknown): Promise<void> {
  const event = parseClerkEvent(payload);

  switch (event.type) {
    case "user.created":
      await handleUserCreated(event.data);
      break;
    case "user.updated":
      await handleUserUpdated(event.data);
      break;
    case "user.deleted":
      await handleUserDeleted(event.data);
      break;
    default:
      break;
  }
}

async function handleUserCreated(data: ClerkUserData): Promise<void> {
  const email = getPrimaryEmail(data.email_addresses);

  await prisma.user.upsert({
    where: { clerkId: data.id },
    create: {
      clerkId: data.id,
      email,
      firstName: data.first_name ?? null,
      lastName: data.last_name ?? null,
      imageUrl: data.image_url ?? null,
      role: UserRole.STUDENT,
    },
    update: {
      email,
      firstName: data.first_name ?? null,
      lastName: data.last_name ?? null,
      imageUrl: data.image_url ?? null,
      deletedAt: null,
    },
  });
}

async function handleUserUpdated(data: ClerkUserData): Promise<void> {
  const existing = await prisma.user.findUnique({
    where: { clerkId: data.id },
  });

  if (!existing || existing.deletedAt) {
    return;
  }

  await prisma.user.update({
    where: { clerkId: data.id },
    data: {
      email: getPrimaryEmail(data.email_addresses),
      firstName: data.first_name ?? null,
      lastName: data.last_name ?? null,
      imageUrl: data.image_url ?? null,
    },
  });
}

async function handleUserDeleted(data: ClerkUserData): Promise<void> {
  const existing = await prisma.user.findUnique({
    where: { clerkId: data.id },
  });

  if (!existing) {
    return;
  }

  if (existing.deletedAt) {
    return;
  }

  await prisma.user.update({
    where: { clerkId: data.id },
    data: {
      deletedAt: new Date(),
      email: anonymizedEmail(existing.id),
      firstName: null,
      lastName: null,
      imageUrl: null,
    },
  });
}
