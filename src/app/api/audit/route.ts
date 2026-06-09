import { NextResponse } from "next/server";
import AuditLog from "@/models/AuditLog";
import { connectDB } from "@/lib/db/mongodb";

export async function GET() {
  try {
    await connectDB();

    const logs = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({
      success: true,
      logs,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
