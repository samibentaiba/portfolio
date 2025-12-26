import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendLoginAlertEmail } from "@/lib/mailer";
import { themeFromPrisma, themeToPrisma } from "@/types";

export const authOptions: NextAuthOptions = {
  // Cast to base PrismaClient since extended client (withAccelerate) is a superset
  adapter: PrismaAdapter(prisma as unknown as PrismaClient),

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password.");
        }

        // Fetch user from DB
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid email or password.");
        }

        // Verify Password
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password.");
        }

        // Verify Email Status
        if (!user.emailVerified) {
          throw new Error("Please verify your email before logging in.");
        }

        // Return the object that matches the `User` type in next-auth.d.ts
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          theme: user.theme,
          sidebarAutoCollapse: user.sidebarAutoCollapse,
        };
      },
    }),
  ],

  callbacks: {
    // 1. JWT Callback: Called whenever a token is created or updated
    async jwt({ token, user, trigger, session }) {
      // On initial login
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.avatar = user.avatar;
        token.name = user.name;
        token.email = user.email;
        token.theme = user.theme;
        token.sidebarAutoCollapse = user.sidebarAutoCollapse;
      }

      // Handle manual session updates (from update() on client)
      if (trigger === "update" && session) {
        if (session.theme !== undefined) {
          token.theme = themeToPrisma(session.theme);
        }
        if (session.sidebarAutoCollapse !== undefined)
          token.sidebarAutoCollapse = session.sidebarAutoCollapse;
        if (session.name !== undefined) token.name = session.name;
      }

      // CRITICAL: Refresh user data from database on every request
      // This ensures cross-browser/cross-device sync
      if (token.email && !user && trigger !== "update") {
        try {
          const freshUser = await prisma.user.findUnique({
            where: { email: token.email as string },
            select: {
              theme: true,
              sidebarAutoCollapse: true,
              avatar: true,
              name: true,
              role: true,
            },
          });

          if (freshUser) {
            // Update token with fresh database values
            token.theme = freshUser.theme;
            token.sidebarAutoCollapse = freshUser.sidebarAutoCollapse;
            token.avatar = freshUser.avatar;
            token.name = freshUser.name;
            token.role = freshUser.role;
          }
        } catch (error) {
          console.error("Failed to refresh user data:", error);
        }
      }

      return token;
    },
    // 2. Session Callback: Called whenever useSession() is used in the client
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.avatar = token.avatar;
        session.user.name = token.name;
        session.user.email = token.email;
        // Convert Prisma enum to next-themes format
        session.user.theme = themeFromPrisma(token.theme as string);
        session.user.sidebarAutoCollapse = token.sidebarAutoCollapse;
      }
      return session;
    },
    async signIn({ user }) {
      if (user && user.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            select: { emailAlertOnLogin: true },
          });

          if (dbUser?.emailAlertOnLogin) {
            // Fire and forget email
            const time = new Date().toLocaleString();
            // IP is hard to get here without request object, defaulting to "Unknown" or handling it in middleware
            // For now, we'll just say "New Login"
            sendLoginAlertEmail(
              user.email,
              time,
              "Unknown (via Credentials)"
            ).catch(console.error);
          }
        } catch (error) {
          console.error("Error in signIn callback:", error);
        }
      }
      return true;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login", // Redirect auth errors to login
  },

  secret: process.env.NEXTAUTH_SECRET,

  // Fix for Next.js 15 / Bun console noise
  logger: {
    error(code, metadata) {
      console.error(code, metadata);
    },
    warn(code) {
      // Suppress specific warnings if needed
      console.warn(code);
    },
    debug(code, metadata) {
      console.warn(code, metadata);
    },
  },
};
