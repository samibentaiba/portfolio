/**
 * GET /api/admin/extension/users
 * Fetch all Firebase Auth users with their activation status and deviceId
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  adminAuth,
  adminDb,
  ACTIVATED_USERS_COLLECTION,
  ExtensionUser,
  ActivatedUser,
} from "@/lib/firebase-admin";

export async function GET() {
  try {
    // Check admin session
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all users from Firebase Auth
    const listUsersResult = await adminAuth.listUsers(1000);
    const authUsers = listUsersResult.users;

    // Fetch all activated users from Firestore
    const activatedSnapshot = await adminDb
      .collection(ACTIVATED_USERS_COLLECTION)
      .get();

    // Create a map of email -> activated user data
    const activatedUsersMap = new Map<string, ActivatedUser>();
    activatedSnapshot.docs.forEach((doc) => {
      const data = doc.data() as ActivatedUser;
      if (data.email) {
        activatedUsersMap.set(data.email.toLowerCase(), {
          email: data.email,
          deviceId: data.deviceId,
        });
      }
    });

    // Merge Firebase Auth users with activation status
    const users: ExtensionUser[] = authUsers.map((user) => {
      const email = user.email?.toLowerCase() || "";
      const activatedData = activatedUsersMap.get(email);

      return {
        uid: user.uid,
        email: user.email || "",
        isActivated: !!activatedData,
        deviceId: activatedData?.deviceId,
        createdAt: user.metadata.creationTime || new Date().toISOString(),
        lastSignInTime: user.metadata.lastSignInTime || null,
      };
    });

    // Sort by creation date (newest first)
    users.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Failed to fetch extension users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
