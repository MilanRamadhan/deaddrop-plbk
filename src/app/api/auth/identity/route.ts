import { NextResponse } from "next/server";
import { getOrCreateIdentity } from "@/lib/auth/getOrCreateIdentity";

export async function GET() {
  try {
    const user = await getOrCreateIdentity();

    return NextResponse.json({
      success: true,
      user,
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
