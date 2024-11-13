import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

  // Create a test curve
  await prisma.curve.upsert({
    // upsert to handle existing data
    where: {
      wolframId: "Circle", // look for exisitng record with this id
    },
    update: {}, // do nothing if record exists
    create: {
      // if not found, create new record
      name: "Circle",
      wolframId: "Circle",
      description: "A perfect circle",
      categoryId: category.id,
      parameters: JSON.stringify({
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
      }),
      equations: JSON.stringify({
        cartesian: "x² + y² = r²",
        parametric: {
          x: "r * cos(t)",
          y: "r * sin(t)",
        },
      }),
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
