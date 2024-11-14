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
        if (curves.length > 0) {
          // Use all curves instead of just the first 5
          const initialNodes: NodeData[] = curves.map(
            (curve: { id: string; name: string }) => ({
              id: curve.id,
              label: curve.name,
              comfort: null,
            })
          );

          // Create a more connected graph structure
          // Each node connects to the next one in sequence, creating a chain
          const initialLinks: LinkData[] = [];
          for (let i = 0; i < initialNodes.length - 1; i++) {
            initialLinks.push({
              source: initialNodes[i].id,
              target: initialNodes[i + 1].id,
            });
            // Add some cross connections for every third node
            if (i % 3 === 0 && i + 3 < initialNodes.length) {
              initialLinks.push({
                source: initialNodes[i].id,
                target: initialNodes[i + 3].id,
              });
            }
          }

          if (!containerRef.current) return;

          // Clear any existing SVG
          d3.select(containerRef.current).selectAll("svg").remove();

          // Get the container dimensions
          const container = containerRef.current;
          const width = container.clientWidth;
          const height = container.clientHeight;

          const svg = d3
            .select(containerRef.current)
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

          const simulation = d3
            .forceSimulation(initialNodes)
            .force(
              "link",
              d3
                .forceLink(initialLinks)
                .id((d: any) => d.id)
                .distance(100)
            )
            .force("charge", d3.forceManyBody().strength(-200))
            .force("collision", d3.forceCollide().radius(60))
            .force(
              "radial",
              d3.forceRadial(
                Math.min(width, height) / 4, // Make radius relative to container size
                0,
                0
              )
            );

          const links = svg
            .append("g")
            .selectAll("line")
            .data(initialLinks)
            .join("line")
            .attr("stroke", (d) =>
              ["2", "3"].includes(d.source as string) ? "#ff6b6b" : "#69db7c"
            )
            .attr("stroke-width", 2);

          // Define the drag behavior before creating nodes
          const drag = d3
            .drag<SVGGElement, NodeData>()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);

          // Then create the nodes with the drag behavior
          const nodes = svg
            .selectAll(".node")
            .data(initialNodes)
            .join("g")
            .attr("class", "node")
            .call(drag as any)
            .style("cursor", "pointer");

          nodes
            .append("circle")
            .attr("r", 30)
            .attr("fill", "#1a1a1a")
            .attr("stroke", "#333")
            .attr("stroke-width", 2)
            .attr("class", "node-circle")
            .style("transition", "all 0.3s ease")
            .on("mouseenter", function () {
              d3.select(this)
                .attr("stroke", "#4f46e5")
                .attr("stroke-width", 3)
                .style("filter", "brightness(1.2)")
                .attr("r", 33);
            })
            .on("mouseleave", function () {
              d3.select(this)
                .attr("stroke", "#333")
                .attr("stroke-width", 2)
                .style("filter", "none")
                .attr("r", 30);
            })
            .on("click", function (event, d) {
              d3.select(this)
                .transition()
                .duration(200)
                .attr("r", 40)
                .transition()
                .duration(200)
                .attr("r", 33);

              setSelectedConcept(d.id);
            });

          nodes
            .append("text")
            .text((d: NodeData) => d.label)
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .attr("fill", "white")
            .style("pointer-events", "none")
            .style("font-size", "12px");

          simulation.on("tick", () => {
            links
              .attr("x1", (d) => {
                const source = d.source as unknown as NodeData;
                return source.x!;
              })
              .attr("y1", (d) => {
                const source = d.source as unknown as NodeData;
                return source.y!;
              })
              .attr("x2", (d) => {
                const target = d.target as unknown as NodeData;
                return target.x!;
              })
              .attr("y2", (d) => {
                const target = d.target as unknown as NodeData;
                return target.y!;
              });

            nodes.attr(
              "transform",
              (d: NodeData) => `translate(${d.x},${d.y})`
            );
          });

          function dragstarted(event: DragEvent) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
          }

          function dragged(event: DragEvent) {
            // Calculate the radius from center where nodes are allowed to move
            const maxRadius = Math.min(width, height) / 2 - 40; // 40px padding

            // Calculate distance from center
            const dx = event.x;
            const dy = event.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // If distance is greater than maxRadius, scale the coordinates back
            if (distance > maxRadius) {
              const scale = maxRadius / distance;
              event.subject.fx = dx * scale;
              event.subject.fy = dy * scale;
            } else {
              event.subject.fx = event.x;
              event.subject.fy = event.y;
            }
          }

          function dragended(event: DragEvent) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
          }
        }
      } catch (error) {
        console.error("Error fetching curve:", error);
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
