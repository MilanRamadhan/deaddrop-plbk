import User from "@/models/User";
import { connectDB } from "@/lib/db/mongodb";

export async function createUser(identityToken: string, publicId: string) {
  await connectDB();

  return User.create({
    identityToken,
    publicId,
  });
}

export async function getUserByToken(token: string) {
  await connectDB();

  return User.findOne({
    identityToken: token,
  });
}
