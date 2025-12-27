import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * API endpoint for projects to verify their access
 *
 * Projects call this endpoint with their slug to check if allowed to run
 *
 * GET /api/admin/verify?slug=project-slug
 * or
 * GET /api/admin/verify?apiKey=xxx (legacy support)
 *
 * Returns:
 * - { allowed: true, response: "yes", message: "ok" } if accepted
 * - { allowed: false, response: "no", message: "rejected" } if rejected
 * - { allowed: false, response: "pending", message: "awaiting approval" } if pending
 * - { allowed: true } if project not registered (permissive by default)
 */

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  const apiKey = req.nextUrl.searchParams.get("apiKey");

  // Try slug first, then apiKey for backwards compatibility
  if (slug) {
    return verifyBySlug(slug);
  } else if (apiKey) {
    return verifyByApiKey(apiKey);
  }

  return NextResponse.json(
    {
      error:
        "Project slug required. Usage: /api/admin/verify?slug=your-project-slug",
      allowed: false,
    },
    { status: 400 }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, apiKey } = body;

    if (slug) {
      return verifyBySlug(slug);
    } else if (apiKey) {
      return verifyByApiKey(apiKey);
    }

    return NextResponse.json(
      { error: "Project slug required", allowed: false },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid request body", allowed: false },
      { status: 400 }
    );
  }
}

async function verifyBySlug(slug: string) {
  try {
    // Find project by slug
    const project = await prisma.projectAccess.findUnique({
      where: { slug },
    });

    // If project not registered, allow by default (permissive)
    if (!project) {
      return NextResponse.json({
        allowed: true,
        response: "yes",
        message: "Project not registered - allowed by default",
        registered: false,
      });
    }

    // Update last check time
    await prisma.projectAccess.update({
      where: { id: project.id },
      data: { lastCheck: new Date() },
    });

    return getAccessResponse(project);
  } catch (error) {
    console.error("Verify API error:", error);
    return NextResponse.json(
      { error: "Internal server error", allowed: false },
      { status: 500 }
    );
  }
}

async function verifyByApiKey(apiKey: string) {
  try {
    const project = await prisma.projectAccess.findUnique({
      where: { apiKey },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Invalid API key", allowed: false },
        { status: 401 }
      );
    }

    await prisma.projectAccess.update({
      where: { id: project.id },
      data: { lastCheck: new Date() },
    });

    return getAccessResponse(project);
  } catch (error) {
    console.error("Verify API error:", error);
    return NextResponse.json(
      { error: "Internal server error", allowed: false },
      { status: 500 }
    );
  }
}

function getAccessResponse(project: { name: string; status: string }) {
  if (project.status === "accepted") {
    return NextResponse.json({
      allowed: true,
      response: "yes",
      message: "ok",
      project: project.name,
    });
  } else if (project.status === "rejected") {
    return NextResponse.json({
      allowed: false,
      response: "no",
      message: "Access rejected - destroy code",
      project: project.name,
      destroy: true,
    });
  } else {
    return NextResponse.json({
      allowed: false,
      response: "pending",
      message: "Awaiting admin approval",
      project: project.name,
    });
  }
}
