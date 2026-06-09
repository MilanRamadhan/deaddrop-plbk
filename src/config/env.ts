function getEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
}

export const env = {
  MONGODB_URI: getEnv("MONGODB_URI"),

  NEXTAUTH_SECRET: getEnv("NEXTAUTH_SECRET"),

  NEXTAUTH_URL: getEnv("NEXTAUTH_URL"),

  APP_URL: getEnv("APP_URL"),

  SOCKET_URL: process.env.SOCKET_URL ?? "",
};
