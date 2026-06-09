import { cookies } from "next/headers";

const COOKIE_NAME = "deaddrop_identity";

export async function getIdentityToken() {
  const cookieStore = await cookies();

  return cookieStore.get(COOKIE_NAME)?.value;
}

export async function setIdentityToken(token: string) {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}
