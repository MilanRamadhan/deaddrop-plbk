import { z } from "zod";

export const createMessageSchema = z.object({
  recipientName: z.string().min(2).max(100),

  content: z.string().min(1).max(10000),

  latitude: z.number(),

  longitude: z.number(),

  radius: z.number().min(50).max(1000),

  selfDestruct: z.boolean(),

  expiresAt: z.string(),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;
