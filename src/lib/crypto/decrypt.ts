import { deriveKey } from "./deriveKey";

export async function decryptMessage(cipherText: string, iv: string, salt: string, identityToken: string, latitude: number, longitude: number) {
  const cipherArray = Uint8Array.from(atob(cipherText), (c) => c.charCodeAt(0));

  const ivArray = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));

  const saltArray = Uint8Array.from(atob(salt), (c) => c.charCodeAt(0));

  const { key } = await deriveKey({
    identityToken,
    latitude,
    longitude,
    salt: saltArray,
  });

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: ivArray,
    },
    key,
    cipherArray,
  );

  return new TextDecoder().decode(decrypted);
}
