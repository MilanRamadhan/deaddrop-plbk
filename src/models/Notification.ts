import mongoose, { InferSchemaType, Model, Schema } from "mongoose";

const NotificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export type NotificationDocument = InferSchemaType<typeof NotificationSchema>;

const Notification: Model<NotificationDocument> = mongoose.models.Notification || mongoose.model<NotificationDocument>("Notification", NotificationSchema);

export default Notification;
