import { deriveKey } from "./deriveKey";

export interface EncryptPayload {
  cipherText: string;
  iv: string;
  salt: string;
}

export async function encryptMessage(message: string, identityToken: string, latitude: number, longitude: number): Promise<EncryptPayload> {
  const encoder = new TextEncoder();

  const { key, salt } = await deriveKey({
    identityToken,
    latitude,
    longitude,
  });

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    encoder.encode(message),
  );

  return {
    cipherText: btoa(String.fromCharCode(...new Uint8Array(encrypted))),

    iv: btoa(String.fromCharCode(...iv)),

    salt: btoa(String.fromCharCode(...salt)),
  };
}
