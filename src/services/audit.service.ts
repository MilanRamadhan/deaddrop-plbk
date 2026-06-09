import AuditLog from "@/models/AuditLog";
import { connectDB } from "@/lib/db/mongodb";

export async function createAuditLog(messageId: string, actorId: string, action: string, metadata: Record<string, unknown> = {}) {
  await connectDB();

  return AuditLog.create({
    messageId,
    actorId,
    action,
    metadata,
  });
}
