/**
 * POST /api/admin/extension/reset-device
 * Clears the deviceId field from a user's activatedUsers document (finds by email field)
 * Works for any user, activated or not
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb, ACTIVATED_USERS_COLLECTION } from "@/lib/firebase-admin";
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

    // Find document by email field (not by document ID)
    const snapshot = await adminDb
      .collection(ACTIVATED_USERS_COLLECTION)
      .where("email", "==", emailLower)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found in activatedUsers collection",
        },
        { status: 404 }
      );
    }

    // Update all matching documents to remove deviceId (should be just one)
    const batch = adminDb.batch();
    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, { deviceId: FieldValue.delete() });
    });
    await batch.commit();

    return NextResponse.json({
      success: true,
      message: `Device reset for ${emailLower}. User can now login on a new device.`,
    });
  } catch (error: unknown) {
    console.error("Failed to reset device:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reset device" },
      { status: 500 }
    );
  }
}
