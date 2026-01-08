/**
 * Firebase Admin SDK initialization
 * Used for server-side operations on Firebase Auth and Firestore
 * for the Sawa9li browser extension users management
 */

import { initializeApp, cert, getApps, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";

// Validate required environment variables
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.warn(
    "Firebase Admin SDK: Missing environment variables. Firebase operations will fail."
  );
}

// Initialize Firebase Admin only once
let app: App;
let adminAuth: Auth;
let adminDb: Firestore;

try {
  if (getApps().length === 0) {
    app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } else {
    app = getApps()[0];
  }

  adminAuth = getAuth(app);
  adminDb = getFirestore(app);
} catch (error) {
  console.error("Failed to initialize Firebase Admin SDK:", error);
  throw error;
}

export { adminAuth, adminDb };

// Collection name for activated users
export const ACTIVATED_USERS_COLLECTION = "activatedUsers";

// Helper types
export interface ActivatedUser {
  email: string;
  deviceId?: string;
}

export interface ExtensionUser {
  uid: string;
  email: string;
  isActivated: boolean;
  deviceId?: string;
  createdAt: string;
  lastSignInTime: string | null;
}
