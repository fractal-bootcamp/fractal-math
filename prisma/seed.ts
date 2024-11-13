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

  const curves = [
    {
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
    {
      name: "Ellipse",
      wolframId: "Ellipse",
      description: "A stretched circle with two focal points",
      categoryId: category.id,
      parameters: JSON.stringify({
        a: {
          name: "semi-major axis",
          symbol: "a",
          defaultValue: "2",
          range: [0.1, 10],
        },
        b: {
          name: "semi-minor axis",
          symbol: "b",
          defaultValue: "1",
          range: [0.1, 10],
        },
      }),
      equations: JSON.stringify({
        cartesian: "(x²/a²) + (y²/b²) = 1",
        parametric: {
          x: "a * cos(t)",
          y: "b * sin(t)",
        },
      }),
    },
    {
      name: "Parabola",
      wolframId: "Parabola",
      description:
        "A U-shaped symmetric curve that represents a quadratic function",
      categoryId: category.id,
      parameters: JSON.stringify({
        a: {
          name: "vertical stretch",
          symbol: "a",
          defaultValue: "1",
          range: [0.1, 5],
        },
        h: {
          name: "horizontal shift",
          symbol: "h",
          defaultValue: "0",
          range: [-5, 5],
        },
        k: {
          name: "vertical shift",
          symbol: "k",
          defaultValue: "0",
          range: [-5, 5],
        },
      }),
      equations: JSON.stringify({
        cartesian: "y = a(x - h)² + k",
        parametric: {
          x: "t",
          y: "a*t²",
        },
      }),
    },
    {
      name: "Sine Wave",
      wolframId: "SineWave",
      description: "A periodic wave that oscillates above and below the x-axis",
      categoryId: category.id,
      parameters: JSON.stringify({
        A: {
          name: "amplitude",
          symbol: "A",
          defaultValue: "1",
          range: [0.1, 5],
        },
        ω: {
          name: "angular frequency",
          symbol: "ω",
          defaultValue: "1",
          range: [0.1, 10],
        },
      }),
      equations: JSON.stringify({
        cartesian: "y = A*sin(ωx)",
        parametric: {
          x: "t",
          y: "A*sin(ωt)",
        },
      }),
    },
    {
      name: "Lemniscate",
      wolframId: "Lemniscate",
      description:
        "A figure-eight curve that represents the locus of points where the product of distances from two fixed points is constant",
      categoryId: category.id,
      parameters: JSON.stringify({
        a: {
          name: "scale factor",
          symbol: "a",
          defaultValue: "1",
          range: [0.1, 5],
        },
      }),
      equations: JSON.stringify({
        cartesian: "(x² + y²)² = 2a²(x² - y²)",
        parametric: {
          x: "a*cos(t)/(1 + sin²(t))",
          y: "a*sin(t)*cos(t)/(1 + sin²(t))",
        },
      }),
    },
    {
      name: "Cardioid",
      wolframId: "Cardioid",
      description:
        "A heart-shaped curve traced by a point on a circle rolling around another circle of the same size",
      categoryId: category.id,
      parameters: JSON.stringify({
        a: {
          name: "scale factor",
          symbol: "a",
          defaultValue: "1",
          range: [0.1, 5],
        },
      }),
      equations: JSON.stringify({
        cartesian: "(x² + y² - 2ax)² = 4a²(x² + y²)",
        parametric: {
          x: "a*(2*cos(t) - cos(2*t))",
          y: "a*(2*sin(t) - sin(2*t))",
        },
      }),
    },
    {
      name: "Hyperbola",
      wolframId: "Hyperbola",
      description:
        "A curve consisting of two infinite branches, formed by the intersection of a plane with a double cone",
      categoryId: category.id,
      parameters: JSON.stringify({
        a: {
          name: "transverse axis",
          symbol: "a",
          defaultValue: "1",
          range: [0.1, 5],
        },
        b: {
          name: "conjugate axis",
          symbol: "b",
          defaultValue: "1",
          range: [0.1, 5],
        },
      }),
      equations: JSON.stringify({
        cartesian: "(x²/a²) - (y²/b²) = 1",
        parametric: {
          x: "a*sec(t)",
          y: "b*tan(t)",
        },
      }),
    },
    {
      name: "Astroid",
      wolframId: "Astroid",
      description:
        "A star-shaped curve with four cusps, traced by a point on a circle rolling inside a larger circle",
      categoryId: category.id,
      parameters: JSON.stringify({
        a: {
          name: "radius",
          symbol: "a",
          defaultValue: "1",
          range: [0.1, 5],
        },
      }),
      equations: JSON.stringify({
        cartesian: "(x/a)^(2/3) + (y/a)^(2/3) = 1",
        parametric: {
          x: "a*cos³(t)",
          y: "a*sin³(t)",
        },
      }),
    },
    {
      name: "Rose Curve",
      wolframId: "RoseCurve",
      description: "A mathematical curve that looks like a flower with petals",
      categoryId: category.id,
      parameters: JSON.stringify({
        a: {
          name: "scale factor",
          symbol: "a",
          defaultValue: "1",
          range: [0.1, 5],
        },
        n: {
          name: "petal count",
          symbol: "n",
          defaultValue: "4",
          range: [1, 8],
        },
      }),
      equations: JSON.stringify({
        cartesian: "r = a*cos(nθ)",
        parametric: {
          x: "a*cos(n*t)*cos(t)",
          y: "a*cos(n*t)*sin(t)",
        },
      }),
    },
  ];

  // Add the curves to the database
  for (const curve of curves) {
    await prisma.curve.upsert({
      where: { wolframId: curve.wolframId },
      update: {},
      create: curve,
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
