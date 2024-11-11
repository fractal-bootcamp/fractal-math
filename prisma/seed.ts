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
      parameters: JSON.stringify([
        {
          name: "radius",
          symbol: "r",
          defaultValue: "1",
          range: [0.1, 10],
        },
      ]),
      equations: JSON.stringify([
        {
          type: "cartesian",
          expression: "x² + y² = r²",
        },
      ]),
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
