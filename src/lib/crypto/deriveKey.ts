export interface DeriveKeyParams {
  identityToken: string;
  latitude: number;
  longitude: number;
  salt?: Uint8Array;
}

export interface DerivedKeyResult {
  key: CryptoKey;
  salt: Uint8Array;
}

export async function deriveKey({ identityToken, latitude, longitude, salt }: DeriveKeyParams): Promise<DerivedKeyResult> {
  const encoder = new TextEncoder();

  const seed = `${identityToken}:${latitude}:${longitude}`;

  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(seed), "PBKDF2", false, ["deriveKey"]);

  const finalSalt = salt ?? crypto.getRandomValues(new Uint8Array(16));

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: new Uint8Array(finalSalt),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt", "decrypt"],
  );

  return {
    key,
    salt: finalSalt,
  };
}
