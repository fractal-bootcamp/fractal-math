import { useState, useRef, useEffect } from "react";

interface Step {
  id: string;
  title: string;
  content: string;
  formula?: string;
  validation?: (input: string) => boolean;
}

interface ConceptCardProps {
  conceptId: string;
  onComplete: (conceptId: string) => void;
}

const conceptStepsMap: Record<string, Step[]> = {
  default: [
    {
      id: "1",
      title: "Coming Soon",
      content:
        "This concept is currently under development. Check back later for interactive content!",
    },
  ],
  Ellipse: [
    {
      id: "1",
      title: "Ellipse",
      content: "A stretched circle with two focal points",
      formula:
        "Cartesian: (x²/a²) + (y²/b²) = 1\nParametric: x = a * cos(t), y = b * sin(t)",
    },
    {
      id: "2",
      title: "Parameters",
      content:
        "semi-major axis (a): 2 Range: [0.1 to 10]\nsemi-minor axis (b): 1 Range: [0.1 to 10]",
    },
  ],
  Parabola: [
    {
      id: "1",
      title: "Parabola",
      content:
        "A U-shaped symmetric curve that represents a quadratic function",
      formula: "Cartesian: y = a(x - h)² + k\nParametric: x = t, y = a*t²",
    },
    {
      id: "2",
      title: "Parameters",
      content:
        "vertical stretch (a): 1 Range: [0.1 to 5]\nhorizontal shift (h): 0 Range: [-5 to 5]\nvertical shift (k): 0 Range: [-5 to 5]",
    },
  ],
  "Sine Wave": [
    {
      id: "1",
      title: "Sine Wave",
      content: "A periodic wave that oscillates above and below the x-axis",
      formula: "Cartesian: y = A*sin(ωx)\nParametric: x = t, y = A*sin(ωt)",
    },
    {
      id: "2",
      title: "Parameters",
      content:
        "amplitude (A): 1 Range: [0.1 to 5]\nangular frequency (ω): 1 Range: [0.1 to 10]",
    },
  ],
  Lemniscate: [
    {
      id: "1",
      title: "Lemniscate",
      content:
        "A figure-eight curve that represents the locus of points where the product of distances from two fixed points is constant",
      formula:
        "Cartesian: (x² + y²)² = 2a²(x² - y²)\nParametric: x = a*cos(t)/(1 + sin²(t)), y = a*sin(t)*cos(t)/(1 + sin²(t))",
    },
    {
      id: "2",
      title: "Parameters",
      content: "scale factor (a): 1 Range: [0.1 to 5]",
    },
  ],
  Cardioid: [
    {
      id: "1",
      title: "Cardioid",
      content:
        "A heart-shaped curve traced by a point on a circle rolling around another circle of the same size",
      formula:
        "Cartesian: (x² + y² - 2ax)² = 4a²(x² + y²)\nParametric: x = a*(2*cos(t) - cos(2*t)), y = a*(2*sin(t) - sin(2*t))",
    },
    {
      id: "2",
      title: "Parameters",
      content: "scale factor (a): 1 Range: [0.1 to 5]",
    },
  ],
  Hyperbola: [
    {
      id: "1",
      title: "Hyperbola",
      content:
        "A curve consisting of two infinite branches, formed by the intersection of a plane with a double cone",
      formula:
        "Cartesian: (x²/a²) - (y²/b²) = 1\nParametric: x = a*sec(t), y = b*tan(t)",
    },
    {
      id: "2",
      title: "Parameters",
      content:
        "transverse axis (a): 1 Range: [0.1 to 5]\nconjugate axis (b): 1 Range: [0.1 to 5]",
    },
  ],
  Astroid: [
    {
      id: "1",
      title: "Astroid",
      content:
        "A star-shaped curve with four cusps, traced by a point on a circle rolling inside a larger circle",
      formula:
        "Cartesian: (x/a)^(2/3) + (y/a)^(2/3) = 1\nParametric: x = a*cos³(t), y = a*sin³(t)",
    },
    {
      id: "2",
      title: "Parameters",
      content: "radius (a): 1 Range: [0.1 to 5]",
    },
  ],
  "Rose Curve": [
    {
      id: "1",
      title: "Rose Curve",
      content: "A mathematical curve that looks like a flower with petals",
      formula:
        "Cartesian: r = a*cos(nθ)\nParametric: x = a*cos(n*t)*cos(t), y = a*cos(n*t)*sin(t)",
    },
    {
      id: "2",
      title: "Parameters",
      content:
        "scale factor (a): 1 Range: [0.1 to 5]\npetal count (n): 4 Range: [1 to 8]",
    },
  ],
};

export default function ConceptCards({
  conceptId,
  onComplete,
}: ConceptCardProps) {
  console.log("ConceptCards received ID:", conceptId);
  console.log("Available concepts:", Object.keys(conceptStepsMap));

  const conceptContent =
    conceptStepsMap[conceptId] || conceptStepsMap["default"];
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="space-y-4 text-white">
      <div className="space-y-2">
        <h4 className="font-semibold">{conceptContent[currentStep].title}</h4>
        <p className="text-sm text-gray-300">
          {conceptContent[currentStep].content}
        </p>
        {conceptContent[currentStep].formula && (
          <div className="bg-gray-800 p-2 rounded">
            <pre className="whitespace-pre-wrap">
              {conceptContent[currentStep].formula}
            </pre>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
          className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => {
            if (currentStep < conceptContent.length - 1) {
              setCurrentStep((prev) => prev + 1);
            } else {
              onComplete(conceptId);
            }
          }}
          className="px-3 py-1 bg-blue-600 rounded"
        >
          {currentStep < conceptContent.length - 1 ? "Next" : "Complete"}
        </button>
      </div>
    </div>
  );
}
