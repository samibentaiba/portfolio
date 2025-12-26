import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * API endpoint for projects to verify their access
 *
 * Projects call this endpoint with their API key to check if allowed to run
 *
 * GET /api/admin/verify?apiKey=xxx
 * or
 * POST /api/admin/verify { apiKey: "xxx" }
 *
 * Returns:
 * - { allowed: true, response: "yes", message: "ok" } if accepted
 * - { allowed: false, response: "no", message: "rejected" } if rejected
 * - { allowed: false, response: "pending", message: "awaiting approval" } if pending
 */

export async function GET(req: NextRequest) {
  const apiKey = req.nextUrl.searchParams.get("apiKey");

  if (!apiKey) {
    return NextResponse.json(
      { error: "API key required", allowed: false },
      { status: 400 }
    );
  }

  return verifyAccess(apiKey);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { apiKey } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key required", allowed: false },
        { status: 400 }
      );
    }

    return verifyAccess(apiKey);
  } catch {
    return NextResponse.json(
      { error: "Invalid request body", allowed: false },
      { status: 400 }
    );
  }
}

async function verifyAccess(apiKey: string) {
  try {
    // Find project by API key
    const project = await prisma.projectAccess.findUnique({
      where: { apiKey },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Invalid API key", allowed: false },
        { status: 401 }
      );
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
        message: "Access rejected - destroy code",
        project: project.name,
        destroy: true, // Signal to self-destruct
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
