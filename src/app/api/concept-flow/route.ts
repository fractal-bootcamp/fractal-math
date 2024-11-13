import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    console.log("Fetching curves from database...");
    const curves = await prisma.curve.findMany({
      select: {
        id: true,
        name: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    console.log(
      "Curve IDs:",
      curves.map((curve) => curve.id)
    );
    console.log("Fetched curves:", curves);

    // Transform data into ConceptFlow format
    const nodes = curves.map((curve) => ({
      id: curve.id,
      label: curve.name,
      comfort: null,
      category: curve.category.name,
    }));
    console.log("Transformed nodes:", nodes);

    // Create links based on category relationships
    const links = curves.reduce((acc: any[], curve, index) => {
      // Link curves within the same category
      const relatedCurves = curves.filter(
        (c) => c.categoryId === curve.categoryId && c.id !== curve.id
      );

      const newLinks = relatedCurves.map((related) => ({
        source: curve.id,
        target: related.id,
      }));

      return [...acc, ...newLinks];
    }, []);

    // Remove duplicate links
    const uniqueLinks = Array.from(new Set(links.map(JSON.stringify))).map(
      (str) => JSON.parse(str)
    );

    return NextResponse.json({
      nodes,
      links: uniqueLinks,
    });
  } catch (error) {
    console.error("Error fetching concept flow data:", error);
    return NextResponse.json(
      { message: "Error fetching concept flow data" },
      { status: 500 }
    );
  }
}
