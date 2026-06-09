import mongoose, { InferSchemaType, Model, Schema } from "mongoose";

const MessageSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    recipientName: {
      type: String,
      required: true,
    },

    cipherText: {
      type: String,
      required: true,
    },

    iv: {
      type: String,
      required: true,
    },

    salt: {
      type: String,
      required: true,
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    radius: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "opened", "expired", "destroyed"],
      default: "pending",
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    openedAt: {
      type: Date,
    },

    destroyedAt: {
      type: Date,
    },

    selfDestruct: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export type MessageDocument = InferSchemaType<typeof MessageSchema>;

const Message: Model<MessageDocument> = mongoose.models.Message || mongoose.model<MessageDocument>("Message", MessageSchema);

export default Message;
