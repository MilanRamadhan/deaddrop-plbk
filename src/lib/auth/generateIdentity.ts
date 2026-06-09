export interface Identity {
  identityToken: string;
  publicId: string;
}

export function generateIdentity(): Identity {
  return {
    identityToken: crypto.randomUUID(),

    publicId: crypto.randomUUID(),
  };
}
