import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET - Fetch all Sawa9li users
export async function GET() {
  try {
    const users = await prisma.sawa9liUser.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        isActivated: true,
        createdAt: true,
        lastLogin: true,
      },
    });

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Failed to fetch Sawa9li users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST - Toggle user activation
export async function POST(req: Request) {
  try {
    const { userId, action } = await req.json();

    if (!userId || !action) {
      return NextResponse.json(
        { success: false, error: "Missing userId or action" },
        { status: 400 }
      );
    }

    const isActivated = action === "activate";

    const user = await prisma.sawa9liUser.update({
      where: { id: userId },
      data: { isActivated },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        isActivated: user.isActivated,
      },
    });
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// PUT - Create a new user
export async function PUT(req: Request) {
  try {
    const { email, password, isActivated = true } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.sawa9liUser.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.sawa9liUser.create({
      data: {
        email,
        password: hashedPassword,
        isActivated,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        isActivated: user.isActivated,
      },
    });
  } catch (error) {
    console.error("Failed to create user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a user
export async function DELETE(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing userId" },
        { status: 400 }
      );
    }

    await prisma.sawa9liUser.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
