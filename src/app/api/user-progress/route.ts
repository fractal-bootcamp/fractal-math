import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { authOptions } from "../../../lib/auth";
import { getServerSession } from "next-auth";

export const POST = async (request: Request) => {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Session user email:", session.user.email); // Debug log

    // Get request body
    const { curveId, status } = await request.json();

    if (!curveId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    // If user doesn't exist, create them
    if (!user) {
      console.log("Creating new user for email:", session.user.email); // Debug log
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || "Anonymous",
        },
      });
    }

    console.log("User:", user); // Debug log

    // Update or create progress
    const progress = await prisma.userProgress.upsert({
      where: {
        userId_curveId: {
          userId: user.id,
          curveId: curveId,
        },
      },
      update: {
        status: status,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        curveId: curveId,
        status: status,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      {
        error: "Failed to update progress",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
};
