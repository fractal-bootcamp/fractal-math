import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    console.log("API: Looking for curve with ID:", id); // Debug log
    const curve = await prisma.curve.findUnique({
      where: { id: id },
      include: { category: true },
    });

    console.log("API: Found curve:", curve); // Debug log

    if (!curve) {
      return NextResponse.json(null);
    }

    return NextResponse.json(curve);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Error fetching curve" },
      { status: 500 }
    );
  }
}
