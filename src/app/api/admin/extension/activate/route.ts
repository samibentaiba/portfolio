/**
 * POST /api/admin/extension/activate
 * Adds email to activatedUsers Firestore collection
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb, ACTIVATED_USERS_COLLECTION } from "@/lib/firebase-admin";

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

    // Check if already activated
    const existingSnapshot = await adminDb
      .collection(ACTIVATED_USERS_COLLECTION)
      .where("email", "==", emailLower)
      .get();

    if (!existingSnapshot.empty) {
      return NextResponse.json(
        { success: false, error: "User is already activated" },
        { status: 400 }
      );
    }

    // Add to activatedUsers collection with auto-generated ID
    await adminDb.collection(ACTIVATED_USERS_COLLECTION).add({
      email: emailLower,
    });

    return NextResponse.json({
      success: true,
      message: `User ${emailLower} activated successfully`,
    });
  } catch (error: unknown) {
    console.error("Failed to activate user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to activate user" },
      { status: 500 }
    );
  }
}
