import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import projects from "@/data/projects.json";

// GET - Fetch all registered projects and available projects
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const registeredProjects = await prisma.projectAccess.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Get available projects from projects.json
    const availableProjects = projects.map((p) => ({
      slug: p.slug,
      title: p.title,
      liveUrl: p.liveUrl,
    }));

    return NextResponse.json({
      success: true,
      projects: registeredProjects,
      availableProjects,
    });
  } catch (error) {
    console.error("Projects API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Accept or reject a project
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { slug, action } = body;

    if (!slug || !["accept", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const project = await prisma.projectAccess.update({
      where: { slug },
      data: {
        status: action === "accept" ? "accepted" : "rejected",
        response: action === "accept" ? "yes" : "no",
        message: action === "accept" ? "ok" : "Access rejected",
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("Projects POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Add a new project for access control
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { slug, name } = body;

    if (!slug || !name) {
      return NextResponse.json(
        { error: "Slug and name required" },
        { status: 400 }
      );
    }

    // Check if already exists
    const existing = await prisma.projectAccess.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Project already registered" },
        { status: 400 }
      );
    }

    const project = await prisma.projectAccess.create({
      data: {
        slug,
        name,
        status: "pending",
      },
    });

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("Projects PUT error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
