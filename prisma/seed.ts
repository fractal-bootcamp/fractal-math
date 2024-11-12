import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create a test category
  const category = await prisma.category.create({
    data: {
      name: "Algebraic Curves",
      description: "Basic algebraic curves",
    },
  });

  // Create a test curve
  await prisma.curve.create({
    data: {
      name: "Circle",
      wolframId: "Circle",
      description: "A perfect circle",
      categoryId: category.id,
      parameters: {
        radius: {
          name: "radius",
          symbol: "r",
          defaultValue: "1",
          range: [0.1, 10],
        },
        center: {
          x: 0,
          y: 0,
        },
      },
      equations: {
        cartesian: "x² + y² = r²",
        parametric: {
          x: "r * cos(t)",
          y: "r * sin(t)",
        },
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
