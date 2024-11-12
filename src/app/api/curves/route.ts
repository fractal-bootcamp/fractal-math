import { NextResponse } from "next/server"; // Changed from "next/response"
import { prisma } from "../../../lib/prisma"; // Alternative to "@/lib/prisma"

export async function GET() {
  try {
    const curves = await prisma.curve.findMany({
      include: {
        category: true,
      },
    });

    return NextResponse.json(curves);
  } catch (error) {
    console.error("Error fetching curves:", error);
    return NextResponse.json(
      { message: "Error fetching curves" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
