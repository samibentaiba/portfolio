// src/lib/auth-helpers.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export interface AuthSession {
  user: {
    id: string;
    email: string;
    role: string;
    name?: string | null;
    avatar?: string | null;
  };
}

export async function getAuthenticatedUser(): Promise<AuthSession | null> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  return session as AuthSession;
}

export async function getUser(userId: string): Promise<{
  role: string;
  email: string | null;
  name: string | null;
  avatar: string | null;
} | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, email: true, name: true, avatar: true },
  });
  if (!user) return null;
  else return user;
}

export async function isAdmin(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  return user?.role === "admin" || user?.role === "ADMIN";
}

/**
 * Fetches the current user's session data.
 * @returns The session or null.
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Check if user has admin role in current session
 */
export async function isSessionAdmin(): Promise<boolean> {
  const session = await getSession();
  return session?.user?.role === "admin" || session?.user?.role === "ADMIN";
}
