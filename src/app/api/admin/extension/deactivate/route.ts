/**
 * POST /api/admin/extension/deactivate
 * Removes user from activatedUsers Firestore collection (finds by email field)
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

    // Find document by email field (not by document ID)
    const snapshot = await adminDb
      .collection(ACTIVATED_USERS_COLLECTION)
      .where("email", "==", emailLower)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { success: false, error: "User not found in activatedUsers" },
        { status: 404 }
      );
    }

    // Delete all matching documents (should be just one)
    const batch = adminDb.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    return NextResponse.json({
      success: true,
      message: `User ${emailLower} deactivated successfully`,
    });
  } catch (error: unknown) {
    console.error("Failed to deactivate user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to deactivate user" },
      { status: 500 }
    );
  }
}
