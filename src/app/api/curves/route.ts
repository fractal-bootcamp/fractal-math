import { NextResponse } from "next/server";

export async function GET() {
  const curves = [
    { id: "1", label: "Linear Polynomial", name: "Line" },
    { id: "2", label: "Circular Conic Section", name: "Circle" },
    { id: "3", label: "Quadratic Conic Section", name: "Parabola" },
    { id: "4", label: "Elliptical Conic Section", name: "Ellipse" },
    { id: "5", label: "Hyperbolic Conic Section", name: "Hyperbola" },
    { id: "6", label: "Sinusoidal Function", name: "Sine Curve" },
    { id: "7", label: "Epicycloid (n=1)", name: "Cardioid" },
    { id: "8", label: "Bernoulli Lemniscate", name: "Lemniscate" },
    { id: "9", label: "Hyperbolic Cosine Curve", name: "Catenary" },
    { id: "10", label: "Parametric Cycloid", name: "Cycloid" },
  ];

  return NextResponse.json(curves);
}
