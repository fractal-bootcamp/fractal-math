import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const curveData = {
    "1": {
      id: "1",
      name: "Line",
      description:
        "The simplest algebraic curve, representing a straight path between two points",
      examples: ["y = mx + b", "ax + by + c = 0"],
      properties: [
        "Constant slope",
        "No curvature",
        "Shortest path between two points",
        "Infinite length",
      ],
    },
    "2": {
      id: "2",
      name: "Circle",
      description:
        "A perfectly round curve where all points are equidistant from a center point",
      examples: ["x² + y² = r²", "(x-h)² + (y-k)² = r²"],
      properties: [
        "Constant radius",
        "Perfect symmetry",
        "Area = πr²",
        "Circumference = 2πr",
      ],
    },
    "3": {
      id: "3",
      name: "Parabola",
      description:
        "A U-shaped curve formed by points equidistant from a point and a line",
      examples: ["y = ax² + bx + c", "x = ay² + by + c"],
      properties: [
        "One axis of symmetry",
        "One focus and directrix",
        "Conic section",
        "Reflective property",
      ],
    },
    "4": {
      id: "4",
      name: "Ellipse",
      description:
        "A closed curve where sum of distances from two fixed points is constant",
      examples: ["x²/a² + y²/b² = 1", "(x-h)²/a² + (y-k)²/b² = 1"],
      properties: [
        "Two foci",
        "Two axes of symmetry",
        "Closed curve",
        "Eccentricity < 1",
      ],
    },
    "5": {
      id: "5",
      name: "Hyperbola",
      description:
        "A curve where difference of distances from two fixed points is constant",
      examples: ["x²/a² - y²/b² = 1", "y²/a² - x²/b² = 1"],
      properties: [
        "Two branches",
        "Two asymptotes",
        "Two foci",
        "Eccentricity > 1",
      ],
    },
    "6": {
      id: "6",
      name: "Sine Curve",
      description:
        "A periodic curve that oscillates above and below a horizontal axis",
      examples: ["y = sin(x)", "y = A sin(Bx + C) + D"],
      properties: [
        "Periodic function",
        "Amplitude = 1",
        "Period = 2π",
        "Odd function",
      ],
    },
    "7": {
      id: "7",
      name: "Cardioid",
      description:
        "A heart-shaped curve traced by a point on a circle rolling around another circle",
      examples: ["r = a(1 + cos θ)", "r = 2a(1 + cos θ)"],
      properties: [
        "Heart-shaped",
        "One cusp",
        "Special case of limacon",
        "Area = 6πa²",
      ],
    },
    "8": {
      id: "8",
      name: "Lemniscate",
      description:
        "A figure-eight shaped curve whose points multiply to give a constant",
      examples: ["(x² + y²)² = a²(x² - y²)", "(x² + y²)² = 2a²xy"],
      properties: [
        "Figure-eight shape",
        "Two loops",
        "One self-intersection",
        "Symmetric about both axes",
      ],
    },
    "9": {
      id: "9",
      name: "Catenary",
      description:
        "The curve formed by a hanging chain or rope under uniform gravity",
      examples: ["y = a cosh(x/a)", "y = (e^(x/a) + e^(-x/a))/2"],
      properties: [
        "Natural occurring curve",
        "Minimal surface area",
        "Not a parabola",
        "Symmetric about y-axis",
      ],
    },
    "10": {
      id: "10",
      name: "Cycloid",
      description:
        "The curve traced by a point on a circle as it rolls along a straight line",
      examples: ["x = a(t - sin t)", "y = a(1 - cos t)"],
      properties: [
        "Brachistochrone curve",
        "Tautochrone curve",
        "Period = 2πa",
        "Area = 3πa²",
      ],
    },
  };

  const data = curveData[id as keyof typeof curveData];

  if (!data) {
    return NextResponse.json({ error: "Curve not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
