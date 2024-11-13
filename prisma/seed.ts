import { PrismaClient } from "@prisma/client";
import { WolframAPI } from "../src/lib/wolfram";

const prisma = new PrismaClient();
const wolfram = new WolframAPI(process.env.WOLFRAM_APP_ID!);

async function main() {
  // Clear existing data
  await prisma.curve.deleteMany({});
  await prisma.category.deleteMany({});

  // Create a test category
  const category = await prisma.category.create({
    data: {
      name: "Algebraic Curves",
      description: "Basic algebraic curves",
    },
  });

  const curves = [
    {
      name: "Circle",
      wolframId: "Circle",
      category: "ALGEBRAIC",
    },
    {
      name: "Ellipse",
      wolframId: "Ellipse",
      category: "ALGEBRAIC",
    },
    {
      name: "Parabola",
      wolframId: "Parabola",
      category: "ALGEBRAIC",
    },
    {
      name: "Sine Wave",
      wolframId: "SineWave",
      category: "ALGEBRAIC",
    },
    {
      name: "Lemniscate",
      wolframId: "Lemniscate",
      category: "ALGEBRAIC",
    },
    {
      name: "Cardioid",
      wolframId: "Cardioid",
      category: "ALGEBRAIC",
    },
    {
      name: "Hyperbola",
      wolframId: "Hyperbola",
      category: "ALGEBRAIC",
    },
    {
      name: "Astroid",
      wolframId: "Astroid",
      category: "ALGEBRAIC",
    },
    {
      name: "Rose Curve",
      wolframId: "RoseCurve",
      category: "ALGEBRAIC",
    },
  ];

  // Add the curves to the database
  for (const curve of curves) {
    // Fetch Wolfram data
    const wolframData = await wolfram.getCurveData(curve.wolframId);

    // Create curve with all data
    await prisma.curve.create({
      data: {
        ...curve,
        equation: wolframData.equation,
        imageUrl: wolframData.imageUrl,
        animationData: wolframData.animationData,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
