import { NextResponse } from "next/server";

import { createMessageSchema } from "@/validators/message.schema";

import { createMessage } from "@/services/message.service";

import { encryptMessage } from "@/lib/crypto/encrypt";

import { getOrCreateIdentity } from "@/lib/auth/getOrCreateIdentity";

import { getMessages } from "@/services/message.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = createMessageSchema.parse(body);

    const sender = await getOrCreateIdentity();

    const encrypted = await encryptMessage(parsed.content, sender.identityToken, parsed.latitude, parsed.longitude);

    const message = await createMessage({
      senderId: sender._id,

      recipientName: parsed.recipientName,

      recipientId: sender._id,

      cipherText: encrypted.cipherText,

      iv: encrypted.iv,

      salt: encrypted.salt,

      latitude: parsed.latitude,

      longitude: parsed.longitude,

      radius: parsed.radius,

      expiresAt: new Date(parsed.expiresAt),

      selfDestruct: parsed.selfDestruct,

      status: "pending",
    });

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 400,
      },
    );
  }
}

export async function GET() {
  try {
    const messages = await getMessages();

    return Response.json({
      success: true,
      messages,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      },
    );
  }
}
