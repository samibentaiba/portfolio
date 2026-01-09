/**
 * DELETE /api/admin/extension/delete-user
 * Removes user from both Firebase Auth and Firestore completely
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  adminAuth,
  adminDb,
  ACTIVATED_USERS_COLLECTION,
} from "@/lib/firebase-admin";

export async function DELETE(req: Request) {
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
    let userRecord;
    try {
      userRecord = await adminAuth.getUserByEmail(emailLower);
    } catch {
      return NextResponse.json(
        { success: false, error: "User not found in Firebase Auth" },
        { status: 404 }
      );
    }

    // Delete from Firestore (find by email field)
    const snapshot = await adminDb
      .collection(ACTIVATED_USERS_COLLECTION)
      .where("email", "==", emailLower)
      .get();

    if (!snapshot.empty) {
      const batch = adminDb.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    }

    // Delete from Firebase Auth
    await adminAuth.deleteUser(userRecord.uid);

    return NextResponse.json({
      success: true,
      message: `User ${emailLower} deleted completely`,
    });
  } catch (error: unknown) {
    console.error("Failed to delete user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
