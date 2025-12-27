import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * API endpoint for projects to verify their access
 *
 * GET /api/admin/verify?slug=project-slug
 *
 * Returns:
 * - { allowed: true, response: "yes", message: "ok" } if accepted
 * - { allowed: false, response: "no", destroy: true } if rejected
 * - { allowed: false, response: "pending" } if pending
 * - { allowed: true } if project not registered (allowed by default)
 */

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");

  if (!slug) {
    return NextResponse.json(
      {
        error:
          "Project slug required. Usage: /api/admin/verify?slug=your-project-slug",
        allowed: false,
      },
      { status: 400 }
    );
  }

  return verifyBySlug(slug);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json(
        { error: "Project slug required", allowed: false },
        { status: 400 }
      );
    }

    return verifyBySlug(slug);
  } catch {
    return NextResponse.json(
      { error: "Invalid request body", allowed: false },
      { status: 400 }
    );
  }
}

async function verifyBySlug(slug: string) {
  try {
    const project = await prisma.projectAccess.findUnique({
      where: { slug },
    });

    // If project not registered, allow by default
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

    // Return access status
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
        message: "Access rejected",
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
  } catch (error) {
    console.error("Verify API error:", error);
    return NextResponse.json(
      { error: "Internal server error", allowed: false },
      { status: 500 }
    );
  }
}
