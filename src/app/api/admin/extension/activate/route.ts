/**
 * POST /api/admin/extension/activate
 * Adds email to activatedUsers Firestore collection
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

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();

    // Get user UID from Firebase Auth
    const userRecord = await adminAuth.getUserByEmail(emailLower);

    // Add to activatedUsers collection (use UID as document ID)
    await adminDb
      .collection(ACTIVATED_USERS_COLLECTION)
      .doc(userRecord.uid)
      .set({
        email: emailLower,
      });

    return NextResponse.json({
      success: true,
      message: `User ${emailLower} activated successfully`,
    });
  } catch (error: unknown) {
    console.error("Failed to activate user:", error);

    const firebaseError = error as { code?: string };
    if (firebaseError.code === "auth/user-not-found") {
      return NextResponse.json(
        { success: false, error: "User not found in Firebase Auth" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to activate user" },
      { status: 500 }
    );
  }
}
