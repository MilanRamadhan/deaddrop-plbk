import { cookies } from "next/headers";
import { generateIdentity } from "./generateIdentity";
import User from "@/models/User";
import { connectDB } from "@/lib/db/mongodb";

const COOKIE_NAME = "deaddrop_identity";

export async function getOrCreateIdentity() {
  await connectDB();

  const cookieStore = await cookies();

  const existingToken = cookieStore.get(COOKIE_NAME)?.value;

  if (existingToken) {
    const user = await User.findOne({
      identityToken: existingToken,
    });

    if (user) {
      return user;
    }
  }

  const identity = generateIdentity();

  const user = await User.create(identity);

  cookieStore.set(COOKIE_NAME, identity.identityToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return user;
}
