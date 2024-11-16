"use client";
import { useSession, signIn } from "next-auth/react";
import { useState } from "react";
import FractalLanding from "../components/MandelbrotSet";
import ConceptExplorer from "../components/ConceptExplorer";
import { ConceptNode, Edge } from "../types/conceptTypes";

// Sample data - replace with actual data from your API
const sampleNodes: ConceptNode[] = [
  {
    id: "mandelbrot",
    name: "Mandelbrot Set",
    type: "concept",
    prerequisites: [],
    subConcepts: ["julia", "escape-time"],
    description: "The Mandelbrot set is the set of complex numbers c for which the sequence f(z) = z² + c remains bounded.",
    equation: "z * z + c",
    theorems: ["mandelbrot-connectedness"],
    problems: ["mandelbrot-plot"],
    visualizationType: "parametric",
    domain: [-2, 2],
    range: [-2, 2],
  },
  {
    id: "julia",
    name: "Julia Set",
    type: "concept",
    prerequisites: ["mandelbrot"],
    subConcepts: [],
    description: "A Julia set is the set of points that remain bounded under iteration of a complex function.",
    equation: "z * z + c",
    problems: ["julia-plot"],
    visualizationType: "parametric",
  },
  {
    id: "escape-time",
    name: "Escape Time Algorithm",
    type: "theorem",
    prerequisites: ["mandelbrot"],
    subConcepts: [],
    description: "Algorithm to determine if a point is in the Mandelbrot set by tracking iterations.",
    problems: ["implement-escape-time"],
  },
];

const sampleEdges: Edge[] = [
  {
    source: "mandelbrot",
    target: "julia",
    type: "prerequisite",
    strength: 1,
  },
  {
    source: "mandelbrot",
    target: "escape-time",
    type: "prerequisite",
    strength: 0.8,
  },
];

export default function Home() {
  const { data: session, status } = useSession();
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const handleConceptClick = (conceptId: string) => {
    setSelectedConcept(conceptId);
  };

  if (status === "authenticated") {
    return (
      <main className="h-screen w-screen overflow-hidden">
        <FractalLanding onConceptClick={handleConceptClick} />
        {selectedConcept && (
          <ConceptExplorer
            initialConcept={selectedConcept}
            nodes={sampleNodes}
            edges={sampleEdges}
            onClose={() => setSelectedConcept(null)}
          />
        )}
      </main>
    );
  }

  return (
    <div>
      <button onClick={() => signIn()}>Sign in</button>
      <FractalLanding onConceptClick={handleConceptClick} />
      {selectedConcept && (
        <ConceptExplorer
          initialConcept={selectedConcept}
          nodes={sampleNodes}
          edges={sampleEdges}
          onClose={() => setSelectedConcept(null)}
        />
      )}
    </div>
  );
}
