/**
 * Learning Paths API Endpoints
 *
 * These endpoints manage learning paths in the application.
 *
 * GET /api/learning-paths
 * Returns an array of all learning paths.
 * Requires authentication.
 * Example response:
 * [
 *   {
 *     "id": "cm3hhv7cu00019nakampcpz2k",
 *     "name": "Algebraic Curves Fundamentals",
 *     "description": "Learn the basics of algebraic curves, from lines to conics",
 *     "difficulty": 1
 *   }
 * ]
 *
 * POST /api/learning-paths
 * Creates a new learning path.
 * Requires authentication.
 * Request body:
 * {
 *   "name": string,        // required
 *   "description": string, // required
 *   "difficulty": number   // required, represents difficulty level
 * }
 *
 * Example curl:
 * curl -X POST \
 *   http://localhost:3000/api/learning-paths \
 *   -H 'Content-Type: application/json' \
 *   -H 'Cookie: next-auth.session-token=<token>' \
 *   -d '{
 *     "name": "Algebraic Curves Fundamentals",
 *     "description": "Learn the basics of algebraic curves, from lines to conics",
 *     "difficulty": 1
 *   }'
 *
 * Returns the created learning path object with id and timestamps.
 */

import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { authOptions } from "../../../lib/auth";

export async function GET() {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch learning paths
    const learningPaths = await prisma.learningPath.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        difficulty: true,
      },
    });

    return NextResponse.json(learningPaths);
  } catch (error) {
    console.error("Error fetching learning paths:", error);
    return NextResponse.json(
      { error: "Failed to fetch learning paths" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, difficulty } = body;

    // Validate required fields
    if (!name || !description || difficulty === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create learning path
    const learningPath = await prisma.learningPath.create({
      data: {
        name,
        description,
        difficulty,
      },
    });

    return NextResponse.json(learningPath);
  } catch (error) {
    console.error("Error creating learning path:", error);
    return NextResponse.json(
      { error: "Failed to create learning path" },
      { status: 500 }
    );
  }
}
