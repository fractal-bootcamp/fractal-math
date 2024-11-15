import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const curves = {
    visualizationPoints: Array.from({ length: 50 }, (_, i) => {
      const angle = (i / 50) * Math.PI * 2;
      const radius = 2; // Size of the circle
      return [
        radius * Math.cos(angle), // x
        radius * Math.sin(angle), // y
        0, // z
      ] as [number, number, number];
    }),
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
      visualizationPoints: [],
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
      visualizationPoints: [],
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
      visualizationPoints: [],
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
      visualizationPoints: [],
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
      visualizationPoints: [],
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
      visualizationPoints: [],
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
      visualizationPoints: [],
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
      visualizationPoints: [],
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
      visualizationPoints: [],
    },
    "11": {
      id: "11",
      name: "Cubic",
      description: "A curve defined by a third-degree polynomial equation",
      examples: ["y = ax³ + bx² + cx + d", "x³ + y³ = 3axy"],
      properties: [
        "Can have up to three real roots",
        "At least one real root",
        "Point of inflection",
        "Algebraic degree 3",
      ],
      visualizationPoints: [],
    },
    "12": {
      id: "12",
      name: "Folium of Descartes",
      description:
        "A curve with a leaf-like shape, discovered by René Descartes",
      examples: ["x³ + y³ = 3axy", "r = 3a sin(θ)cos(θ)/(sin³(θ) + cos³(θ))"],
      properties: [
        "Single leaf shape",
        "One double point",
        "Asymptote x + y + a = 0",
        "Algebraic degree 3",
      ],
      visualizationPoints: [],
    },
    "13": {
      id: "13",
      name: "Witch of Agnesi",
      description:
        "A curve studied by Maria Agnesi, with applications in probability",
      examples: ["y = 8a³/(x² + 4a²)", "y = a(1 + cos(θ))"],
      properties: [
        "Bell-shaped curve",
        "Horizontal asymptote y = 0",
        "Maximum height at x = 0",
        "Area = 4πa²",
      ],
      visualizationPoints: [],
    },
    "14": {
      id: "14",
      name: "Butterfly",
      description: "A transcendental curve that resembles butterfly wings",
      examples: [
        "x = sin(t)(e^cos(t) - 2cos(4t) - sin^5(t/12))",
        "y = cos(t)(e^cos(t) - 2cos(4t) - sin^5(t/12))",
      ],
      properties: [
        "Symmetrical about both axes",
        "Transcendental curve",
        "Periodic pattern",
        "Wing-like structure",
      ],
      visualizationPoints: [],
    },
    "15": {
      id: "15",
      name: "Maltese Cross",
      description: "A curve forming a cross-like shape with eight cusps",
      examples: ["r = a√(2cos(2θ))", "r = a√(2sin(2θ))"],
      properties: [
        "Eight cusps",
        "Four-fold symmetry",
        "Cross formation",
        "Algebraic curve",
      ],
      visualizationPoints: [],
    },
    "16": {
      id: "16",
      name: "Devil's Curve",
      description: "A quartic curve with a distinctive shape resembling horns",
      examples: ["(x² + y²)³ = 4x²y²", "(r²)³ = 4(cos²θ)(sin²θ)"],
      properties: [
        "Four loops",
        "Double point at origin",
        "Symmetrical about both axes",
        "Quartic curve",
      ],
      visualizationPoints: [],
    },
    "17": {
      id: "17",
      name: "Algebraic Oval",
      description: "A curve formed by two ovals connected by a line",
      examples: ["(x² + y²)² = a²(x² - y²)", "(r²)² = a²(cos²θ - sin²θ)"],
      properties: [
        "Two ovals",
        "One line",
        "Symmetrical about both axes",
        "Algebraic curve",
      ],
      visualizationPoints: [],
    },
    "18": {
      id: "18",
      name: "Heart-Shaped Curve",
      description: "A curve resembling a heart shape",
      examples: ["r = a(1 + cos(θ))", "r = 2a(1 + cos(θ))"],
      properties: [
        "Heart-shaped",
        "One cusp",
        "Special case of limacon",
        "Area = 6πa²",
      ],
      visualizationPoints: [],
    },
    "19": {
      id: "19",
      name: "Transcendental Curve",
      description: "A curve that cannot be expressed as a polynomial",
      examples: [
        "x = sin(t)(e^cos(t) - 2cos(4t) - sin^5(t/12))",
        "y = cos(t)(e^cos(t) - 2cos(4t) - sin^5(t/12))",
      ],
      properties: [
        "Symmetrical about both axes",
        "Transcendental curve",
        "Periodic pattern",
        "Wing-like structure",
      ],
      visualizationPoints: [],
    },
    "20": {
      id: "20",
      name: "Sextic Curve",
      description: "A curve defined by a sixth-degree polynomial equation",
      examples: [
        "y = ax^6 + bx^5 + cx^4 + dx^3 + ex^2 + fx + g",
        "x^6 + y^6 = 3axy",
      ],
      properties: [
        "Can have up to six real roots",
        "At least one real root",
        "Point of inflection",
        "Algebraic degree 6",
      ],
      visualizationPoints: [],
    },
    "21": {
      id: "21",
      name: "Mechanical Curve",
      description: "A curve formed by a mechanical system",
      examples: ["y = a(1 + cos(θ))", "r = 2a(1 + cos(θ))"],
      properties: [
        "Heart-shaped",
        "One cusp",
        "Special case of limacon",
        "Area = 6πa²",
      ],
      visualizationPoints: [],
    },
    "22": {
      id: "22",
      name: "Quartic Curve",
      description: "A curve defined by a fourth-degree polynomial equation",
      examples: ["y = ax^4 + bx^3 + cx^2 + dx + e", "x^4 + y^4 = 3axy"],
      properties: [
        "Can have up to four real roots",
        "At least one real root",
        "Point of inflection",
        "Algebraic degree 4",
      ],
      visualizationPoints: [],
    },
    "23": {
      id: "23",
      name: "Quintic Curve",
      description: "A curve defined by a fifth-degree polynomial equation",
      examples: ["y = ax^5 + bx^4 + cx^3 + dx^2 + ex + f", "x^5 + y^5 = 3axy"],
      properties: [
        "Can have up to five real roots",
        "At least one real root",
        "Point of inflection",
        "Algebraic degree 5",
      ],
      visualizationPoints: [],
    },
  };

  return NextResponse.json(curves[params.id] ?? null);
}
