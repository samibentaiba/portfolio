/**
 * POST /api/admin/extension/deactivate
 * Removes user from activatedUsers Firestore collection
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

    // Remove from activatedUsers collection
    await adminDb
      .collection(ACTIVATED_USERS_COLLECTION)
      .doc(userRecord.uid)
      .delete();

    return NextResponse.json({
      success: true,
      message: `User ${emailLower} deactivated successfully`,
    });
  } catch (error: unknown) {
    console.error("Failed to deactivate user:", error);

    const firebaseError = error as { code?: string };
    if (firebaseError.code === "auth/user-not-found") {
      return NextResponse.json(
        { success: false, error: "User not found in Firebase Auth" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to deactivate user" },
      { status: 500 }
    );
  }
}
