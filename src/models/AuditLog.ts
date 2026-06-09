import mongoose, { InferSchemaType, Model, Schema } from "mongoose";

const AuditLogSchema = new Schema(
  {
    messageId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      required: true,
      index: true,
    },

    actorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    action: {
      type: String,
      required: true,
      index: true,
    },

    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

export type AuditLogDocument = InferSchemaType<typeof AuditLogSchema>;

const AuditLog: Model<AuditLogDocument> = mongoose.models.AuditLog || mongoose.model<AuditLogDocument>("AuditLog", AuditLogSchema);

export default AuditLog;
