import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import ExtensionUsersClient from "./client";

/**
 * Server-side extension users page
 * - Verifies admin session on the server
 * - Redirects if not authenticated/authorized
 */
export default async function ExtensionUsersPage() {
  // Server-side session check
  const session = await getServerSession(authOptions);

  // Redirect if not authenticated
  if (!session?.user) {
    redirect("/login?callbackUrl=/admin/extension-users");
  }

  // Redirect if not admin
  if (session.user.role !== "admin") {
    redirect("/?error=unauthorized");
  }

  return (
    <ExtensionUsersClient
      user={{
        email: session.user.email || "",
        name: session.user.name || "",
      }}
    />
  );
}
