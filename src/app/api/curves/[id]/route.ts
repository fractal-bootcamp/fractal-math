import { NextResponse } from "next/server";
import { WolframAPI } from "../../../../lib/wolfram";
import { prisma } from "../../../../lib/prisma";

const wolframAPI = new WolframAPI(process.env.WOLFRAM_APP_ID!);

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    // find curve in db
    const curve = await prisma.curve.findUnique({
      where: {
        id: id,
      },
      include: {
        category: true,
      },
    });

    if (!curve) {
      return NextResponse.json({ message: "curve not found" }, { status: 404 });
    }

    // parse JSON strings back into objects
    const equations = JSON.parse(curve.equations as string);
    const parameters = JSON.parse(curve.parameters as string);

    // fetch wolfram data
    const wolframData = await wolframAPI.getCurveData(curve.wolframId);

    // return formatted response
    return NextResponse.json({
      id: curve.id,
      name: curve.name,
      description: curve.description,
      wolframId: curve.wolframId,
      category: {
        id: curve.category.id,
        name: curve.category.name,
        description: curve.category.description,
      },
      equations,
      parameters,
      wolframData,
    });
  } catch (error) {
    console.error("Error fetching curve data:", error);
    return NextResponse.json(
      { message: "Error fetching curve data" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}