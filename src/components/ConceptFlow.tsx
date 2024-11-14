"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import ConceptCards from "./ConceptCards";
// import { useSession } from "next-auth/react";

// Define the structure for node data
interface NodeData extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  comfort: boolean | null;
}

// Define the structure for link data
interface LinkData {
  source: string;
  target: string;
}

// Add these interfaces for d3 types
// interface SimulationLink extends d3.SimulationLinkDatum<NodeData> {
//     source: NodeData;
//     target: NodeData;
// }

interface DragEvent extends d3.D3DragEvent<SVGGElement, NodeData, NodeData> {
  subject: NodeData;
}

// interface ConceptData {
//   id: string;
//   title: string;
//   content: string;

// }
const NODE_RADIUS = 28; // Bigger circles

export default function ConceptFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  //   const { data: session } = useSession();

  // Move these inside useEffect to avoid the dependency warning
  // while maintaining the exact same functionality
  useEffect(() => {
    const fetchCurveData = async () => {
      try {
        const response = await fetch("/api/curves");
        const curves = await response.json();

        if (!containerRef.current) return;

        // Get container dimensions
        const container = containerRef.current;
        const bounds = container.getBoundingClientRect();
        const width = bounds.width;
        const height = bounds.height;

        // Clear any existing SVG
        d3.select(containerRef.current).selectAll("svg").remove();

        // Create SVG with container dimensions
        const svg = d3
          .select(containerRef.current)
          .append("svg")
          .attr("width", "100%")
          .attr("height", "100%")
          .attr("viewBox", [0, 0, width, height]);

        // Initialize nodes from curves
        const nodes = curves.map((curve: { id: string; name: string }) => ({
          id: curve.id,
          label: curve.name,
          comfort: null,
          x: Math.random() * width,
          y: Math.random() * height,
        }));

        // Create links between nodes
        const links = [];
        for (let i = 0; i < nodes.length - 1; i++) {
          links.push({
            source: nodes[i].id,
            target: nodes[i + 1].id,
          });
          // Add some cross connections for every third node
          if (i % 3 === 0 && i + 3 < nodes.length) {
            links.push({
              source: nodes[i].id,
              target: nodes[i + 3].id,
            });
          }
        }

        // Modify the force simulation to respect bounds
        const simulation = d3
          .forceSimulation(nodes)
          .force(
            "link",
            d3
              .forceLink(links)
              .id((d) => d.id)
              .distance(NODE_RADIUS)
          )
          .force("charge", d3.forceManyBody().strength(-200))
          .force("center", d3.forceCenter(width / 2, height / 2))
          .force("collision", d3.forceCollide().radius(NODE_RADIUS + 5))
          // Add boundary force
          .force("bounds", () => {
            for (let node of nodes) {
              node.x = Math.max(30, Math.min(width - 30, node.x));
              node.y = Math.max(30, Math.min(height - 30, node.y));
            }
          });

        // Add links to SVG
        const link = svg
          .append("g")
          .selectAll("line")
          .data(links)
          .join("line")
          .attr("stroke", "#999")
          .attr("stroke-opacity", 0.6)
          .attr("stroke-width", 1);

        // Modify drag behavior to work with groups
        const drag = d3.drag<SVGGElement, NodeData>().on("drag", (event, d) => {
          d.x = Math.max(30, Math.min(width - 30, event.x));
          d.y = Math.max(30, Math.min(height - 30, event.y));
          simulation.alpha(1).restart();
        });

        // Create node groups
        const nodeGroup = svg
          .append("g")
          .selectAll("g")
          .data(nodes)
          .join("g")
          .call(drag as any);

        // Add circles to each node group
        nodeGroup
          .append("circle")
          .attr("r", NODE_RADIUS)
          .attr("fill", "#4CAF50")
          .attr("cursor", "pointer")
          .on("click", (event, d) => {
            setSelectedConcept(d.id);
          });

        // Add labels to each node group
        nodeGroup
          .append("text")
          .text((d) => d.label)
          .attr("text-anchor", "middle")
          .attr("dy", "0.3em")
          .attr("fill", "white")
          .attr("font-size", "14px")
          .attr("pointer-events", "none");

        // Update the simulation tick function
        simulation.on("tick", () => {
          link
            .attr("x1", (d) => Math.max(30, Math.min(width - 30, d.source.x)))
            .attr("y1", (d) => Math.max(30, Math.min(height - 30, d.source.y)))
            .attr("x2", (d) => Math.max(30, Math.min(width - 30, d.target.x)))
            .attr("y2", (d) => Math.max(30, Math.min(height - 30, d.target.y)));

          // Move the entire group together
          nodeGroup.attr("transform", (d) => {
            const x = Math.max(30, Math.min(width - 30, d.x));
            const y = Math.max(30, Math.min(height - 30, d.y));
            return `translate(${x},${y})`;
          });
        });

        // Optional: Add hover effects to the entire group
        nodeGroup
          .on("mouseover", function () {
            d3.select(this)
              .select("circle")
              .transition()
              .duration(200)
              .attr("r", NODE_RADIUS + 2)
              .attr("fill", "#45a049");
          })
          .on("mouseout", function () {
            d3.select(this)
              .select("circle")
              .transition()
              .duration(200)
              .attr("r", NODE_RADIUS)
              .attr("fill", "#4CAF50");
          });
      } catch (error) {
        console.error("Error fetching curves:", error);
      }
    };

    fetchCurveData();
  }, []);

  const handleConceptComplete = async (conceptId: string) => {
    try {
      // Call the API endpoint
      const response = await fetch("/api/user-progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          curveId: conceptId,
          status: "completed",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update progress");
      }

      // Update UI
      setSelectedConcept(null);
      const node = d3.select(`circle[data-id="${conceptId}"]`);
      node.attr("stroke", "#4CAF50").attr("stroke-width", 4);
    } catch (error) {
      console.error("Error marking concept as complete:", error);
      // You might want to add error handling UI here
    }
  };

  const handleOverlayClick = () => {
    setSelectedConcept(null);
  };

  return (
    <div className="w-full h-full transition-all duration-300 ease-in-out">
      <div ref={containerRef} className="w-full h-full">
        {selectedConcept && (
          <div
            className="absolute inset-0 bg-black/50 flex items-center justify-center p-4"
            onClick={handleOverlayClick}
          >
            <div
              className="relative bg-gray-800 rounded-lg p-6 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedConcept(null)}
                className="absolute top-4 right-4 z-50 text-gray-400 hover:text-white cursor-pointer"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <ConceptCards
                conceptId={selectedConcept}
                onComplete={() => handleConceptComplete(selectedConcept!)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
