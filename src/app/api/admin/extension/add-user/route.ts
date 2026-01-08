/**
 * POST /api/admin/extension/add-user
 * Creates a new user in Firebase Auth and optionally activates them
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  adminAuth,
  adminDb,
  ACTIVATED_USERS_COLLECTION,
} from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    // Check admin session
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, password, activate } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email: email.toLowerCase().trim(),
      password,
      emailVerified: true, // Auto-verify for admin-created users
    });

    // Optionally activate the user
    if (activate) {
      await adminDb
        .collection(ACTIVATED_USERS_COLLECTION)
        .doc(userRecord.uid)
        .set({
          email: email.toLowerCase().trim(),
        });
    }

    return NextResponse.json({
      success: true,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        isActivated: activate,
      },
    });
  } catch (error: unknown) {
    console.error("Failed to create user:", error);

    // Handle Firebase Auth specific errors
    const firebaseError = error as { code?: string };
    if (firebaseError.code === "auth/email-already-exists") {
      return NextResponse.json(
        { success: false, error: "Email is already in use" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 }
    );
  }
}
