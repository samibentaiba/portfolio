// src/lib/secrets.ts

export async function getAppBaseUrl(): Promise<string> {
  // In production, use the NEXTAUTH_URL env variable
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }

  // In development, default to localhost
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const host = process.env.VERCEL_URL || "localhost:3000";
  
  return `${protocol}://${host}`;
}