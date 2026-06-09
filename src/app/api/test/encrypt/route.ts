import { NextResponse } from "next/server";

import { encryptMessage } from "@/lib/crypto/encrypt";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const encrypted = await encryptMessage(body.message, body.identityToken, body.latitude, body.longitude);

    return NextResponse.json({
      success: true,
      encrypted,
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
