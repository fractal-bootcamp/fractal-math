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
    { id: "11", label: "Cubic Function", name: "Cubic" },
    { id: "12", label: "Historical Cubic", name: "Folium of Descartes" },
    { id: "13", label: "Witch of Agnesi", name: "Probability Curve" },
    { id: "14", name: "Butterfly Curve", label: "Butterfly" },
    { id: "15", name: "Cross Curve", label: "Maltese Cross" },
    { id: "16", name: "Octic Curve", label: "Devil's Curve" },
    { id: "17", name: "Algebraic Oval", label: "Cassini Ovals" },
    { id: "18", name: "Heart-Shaped Curve", label: "Heart Curve" },
    { id: "19", name: "Transcendental Curve", label: "Bow Curve" },
    { id: "20", name: "Sextic Curve", label: "Cayley's Sextic" },
    { id: "21", name: "Mechanical Curve", label: "Stirrup Curve" },
    { id: "22", name: "Quartic Curve", label: "Plücker's Quartic" },
    { id: "23", name: "Quintic Curve", label: "Mordell Curve" },
  ];

  return NextResponse.json(curves);
}
