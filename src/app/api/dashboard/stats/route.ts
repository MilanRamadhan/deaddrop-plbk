import { NextResponse } from "next/server";
import Message from "@/models/Message";
import { connectDB } from "@/lib/db/mongodb";

export async function GET() {
  try {
    await connectDB();

    const total = await Message.countDocuments();

    const opened = await Message.countDocuments({
      status: "opened",
    });

    const pending = await Message.countDocuments({
      status: "pending",
    });

    const destroyed = await Message.countDocuments({
      status: "destroyed",
    });

    return NextResponse.json({
      success: true,
      stats: {
        total,
        opened,
        pending,
        destroyed,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      },
    );
  }
}
