import { NextResponse } from "next/server";

import { getMessageById } from "@/services/message.service";

import { verifyLocation } from "@/lib/location/verifyLocation";

import { decryptMessage } from "@/lib/crypto/decrypt";

import { updateMessageStatus, destroyMessage } from "@/services/message.service";

import { createAuditLog } from "@/services/audit.service";

import User from "@/models/User";

export async function POST(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    const { id } = await context.params;

    const body = await request.json();

    const message = await getMessageById(id);

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          error: "Message not found",
        },
        {
          status: 404,
        },
      );
    }

    if (new Date() > message.expiresAt) {
      return NextResponse.json(
        {
          success: false,
          error: "Message expired",
        },
        {
          status: 400,
        },
      );
    }

    const locationCheck = verifyLocation(body.latitude, body.longitude, message.latitude, message.longitude, message.radius);

    if (!locationCheck.valid) {
      return NextResponse.json(
        {
          success: false,
          error: "Outside allowed radius",
          distance: locationCheck.distance,
        },
        {
          status: 403,
        },
      );
    }

    const sender = await User.findById(message.senderId);

    if (!sender) {
      return NextResponse.json(
        {
          success: false,
          error: "Sender not found",
        },
        {
          status: 404,
        },
      );
    }

    const content = await decryptMessage(message.cipherText, message.iv, message.salt, sender.identityToken, message.latitude, message.longitude);

    await updateMessageStatus(message._id.toString(), "opened");

    await createAuditLog(message._id.toString(), sender._id.toString(), "MESSAGE_OPENED", {
      distance: locationCheck.distance,
    });

    if (message.selfDestruct) {
      await destroyMessage(message._id.toString());
    }

    return NextResponse.json({
      success: true,
      content,
      distance: locationCheck.distance,
    });
  } catch (error) {
    return NextResponse.json(
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
