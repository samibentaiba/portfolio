/**
 * POST /api/admin/extension/reset-device
 * Clears the deviceId field from a user's activatedUsers document
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  adminAuth,
  adminDb,
  ACTIVATED_USERS_COLLECTION,
} from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

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

    // Check if user document exists
    const userDoc = await adminDb
      .collection(ACTIVATED_USERS_COLLECTION)
      .doc(userRecord.uid)
      .get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { success: false, error: "User is not activated" },
        { status: 400 }
      );
    }

    // Remove deviceId field (set to delete)
    await adminDb
      .collection(ACTIVATED_USERS_COLLECTION)
      .doc(userRecord.uid)
      .update({
        deviceId: FieldValue.delete(),
      });

    return NextResponse.json({
      success: true,
      message: `Device reset for ${emailLower}. User can now login on a new device.`,
    });
  } catch (error: unknown) {
    console.error("Failed to reset device:", error);

    const firebaseError = error as { code?: string };
    if (firebaseError.code === "auth/user-not-found") {
      return NextResponse.json(
        { success: false, error: "User not found in Firebase Auth" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to reset device" },
      { status: 500 }
    );
  }
}
