import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminClient from "./client";
import projects from "@/data/projects.json";

/**
 * Server-side admin page
 * - Verifies admin session on the server
 * - Fetches initial data securely
 * - Passes data to client component
 */
export default async function AdminPage() {
  // Server-side session check - most secure
  const session = await getServerSession(authOptions);

  // Redirect if not authenticated
  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  // Redirect if not admin
  if (session.user.role !== "admin") {
    redirect("/?error=unauthorized");
  }

  // Fetch registered projects from database
  const registeredProjects = await prisma.projectAccess.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Get available projects from projects.json
  const availableProjects = projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    liveUrl: p.liveUrl || null,
  }));

  return (
    <AdminClient
      user={{
        email: session.user.email || "",
        name: session.user.name || "",
      }}
      initialProjects={registeredProjects.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        status: p.status,
        apiKey: p.apiKey,
        response: p.response,
        message: p.message,
        lastCheck: p.lastCheck?.toISOString() || null,
        createdAt: p.createdAt.toISOString(),
      }))}
      availableProjects={availableProjects}
    />
  );
}
