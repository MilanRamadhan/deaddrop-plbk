import mongoose, { InferSchemaType, Model, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    identityToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    publicId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export type UserDocument = InferSchemaType<typeof UserSchema>;

const User: Model<UserDocument> = mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);

export default User;
