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

interface DragEvent extends d3.D3DragEvent<SVGGElement, NodeData, NodeData> {
  subject: NodeData;
}

// Add a new interface for mathematical relationships
interface MathRelationship {
  id: string;
  label: string;
  prerequisites: string[]; // IDs of concepts that must be understood first
  related: string[]; // IDs of related concepts
  level: number; // Conceptual difficulty level
}

const NODE_RADIUS = 28; // Bigger circles

// Component for visualizing and interacting with mathematical concept relationships
export default function ConceptFlow() {
  // State and ref declarations
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const simulationRef = useRef<d3.Simulation<any, undefined> | null>(null);

  // Main useEffect for graph initialization and data fetching
  useEffect(() => {
    const fetchCurveData = async () => {
      try {
        // Fetch curve data from API
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

        // Create SVG container with dimensions
        const svg = d3
          .select(containerRef.current)
          .append("svg")
          .attr("width", "100%")
          .attr("height", "100%")
          .attr("viewBox", [0, 0, width, height]);

        // Set up groups for links and nodes
        const linksGroup = svg.append("g").attr("class", "links");
        const nodesGroup = svg.append("g").attr("class", "nodes");

        // Create nodes from math relationships
        const mathRelationships = organizeMathConcepts(curves);
        const nodes = mathRelationships.map((concept) => ({
          id: concept.id,
          label: concept.label,
          comfort: null,
          level: concept.level,
          x: Math.random() * width,
          y: Math.random() * height,
        }));

        // Generate links between related concepts
        const links = [];
        mathRelationships.forEach((concept) => {
          // Add prerequisite links
          concept.prerequisites.forEach((preReqId) => {
            links.push({
              source: preReqId,
              target: concept.id,
              type: "prerequisite",
            });
          });

          // Add related concept links
          concept.related.forEach((relatedId) => {
            // Avoid duplicate links
            if (
              !links.some(
                (link) =>
                  (link.source === concept.id && link.target === relatedId) ||
                  (link.source === relatedId && link.target === concept.id)
              )
            ) {
              links.push({
                source: concept.id,
                target: relatedId,
                type: "related",
              });
            }
          });
        });

        // Define spiral layout for node positioning
        function createSpiralLayout(
          nodeCount: number,
          width: number,
          height: number
        ) {
          const centerX = width / 2;
          const centerY = height / 2;
          const spacing = 111; // Distance between spiral arms
          const maxRadius = Math.min(width, height) * 0.35;

          const positions = [];

          positions.push({ x: centerX, y: centerY });

          for (let i = 0; i < nodeCount; i++) {
            // Archimedean spiral formula: r = a * theta
            const theta = i * 0.5; // Controls rotation (smaller = more spread)
            const radius = spacing * Math.sqrt(theta); // Controls distance between rings
            const x = centerX + radius * Math.cos(theta);
            const y = centerY + radius * Math.sin(theta);
            positions.push({ x, y });
          }
          return positions;
        }

        // Configure force simulation
        simulationRef.current = d3
          .forceSimulation(nodes)
          .force(
            "link",
            d3
              .forceLink(links)
              .id((d) => d.id)
              .distance(NODE_RADIUS * 2)
              .strength(0.2)
          )
          .force(
            "charge",
            d3
              .forceManyBody()
              .strength(-300)
              .distanceMax(width / 4)
              .distanceMin(30)
          )
          .force(
            "collision",
            d3
              .forceCollide()
              .radius(NODE_RADIUS * 1.2)
              .strength(1)
              .iterations(2)
          )
          .force("position", (alpha) => {
            const positions = createSpiralLayout(nodes.length, width, height);
            nodes.forEach((node, i) => {
              const target = positions[i];
              node.vx += (target.x - node.x) * alpha * 0.05;
              node.vy += (target.y - node.y) * alpha * 0.05;
            });
          })
          .alphaDecay(0.01)
          .alphaMin(0.001)
          .alphaTarget(0.3)
          .velocityDecay(0.4);

        // Set up drag behavior
        const drag = d3
          .drag<SVGGElement, NodeData>()
          .on("start", (event, d) => {
            if (!event.active)
              simulationRef.current?.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulationRef.current?.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          });

        // Add SVG filter definition for Gaussian blur
        const defs = svg.append("defs");
        defs
          .append("filter")
          .attr("id", "gaussian-blur")
          .append("feGaussianBlur")
          .attr("stdDeviation", "3");

        // Modify the existing nodeGroup creation to include the blur effect
        const nodeGroup = nodesGroup
          .selectAll("g")
          .data(nodes)
          .join("g")
          .call(drag as any)
          .on("click", (event, d) => {
            setSelectedConcept(d.id);
          })
          .on("mouseover", function () {
            d3.select(this)
              .style("cursor", "pointer")
              .select("circle")
              .transition()
              .duration(200)
              .attr("r", NODE_RADIUS + 2)
              .attr("fill", "#00ff88");

            d3.select(this)
              .select("text")
              .transition()
              .duration(200)
              .style("font-size", "16px")
              .attr("font-weight", "bold");
          })
          .on("mouseout", function () {
            d3.select(this)
              .select("circle")
              .transition()
              .duration(200)
              .attr("r", NODE_RADIUS)
              .attr("fill", "#4CAF50");

            d3.select(this)
              .select("text")
              .transition()
              .duration(200)
              .style("font-size", "14px")
              .attr("font-weight", "normal");
          });

        // Add the blurred circle first (will be behind)
        nodeGroup
          .append("circle")
          .attr("r", NODE_RADIUS)
          .attr("fill", "#4CAF50")
          .style("filter", "url(#gaussian-blur)");

        // Add the sharp circle on top
        nodeGroup
          .append("circle")
          .attr("r", NODE_RADIUS - 2)
          .attr("fill", "#4CAF50")
          .style("filter", "none");

        // Keep your existing text labels
        nodeGroup
          .append("text")
          .text((d) => d.label)
          .attr("text-anchor", "middle")
          .attr("dy", "0.3em")
          .attr("fill", "white")
          .attr("font-size", "14px")
          .attr("pointer-events", "none");

        // Render links with styling
        const link = linksGroup
          .selectAll("path")
          .data(links)
          .join("path")
          .attr("stroke", "#ff8c00")
          .attr("stroke-opacity", 0.8)
          .attr("stroke-width", 2)
          .attr("fill", "none");

        // Configure simulation tick updates
        simulationRef.current?.on("tick", () => {
          link.attr("d", (d) => {
            const dx = d.target.x - d.source.x;
            const dy = d.target.y - d.source.y;
            const dr = Math.sqrt(dx * dx + dy * dy) * 2;
            return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
          });

          nodeGroup.attr("transform", (d) => `translate(${d.x},${d.y})`);
        });

        // Configure simulation parameters
        simulationRef.current?.alphaDecay(0.01);

        // Add zoom functionality
        const zoom = d3
          .zoom()
          .scaleExtent([0.5, 2])
          .on("zoom", (event) => {
            svg.selectAll("g").attr("transform", event.transform);
          });

        svg.call(zoom);
      } catch (error) {
        console.error("Error fetching curves:", error);
      }
    };

    fetchCurveData();

    // Cleanup simulation on unmount
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, []);

  // Animation refresh effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (simulationRef.current) {
        simulationRef.current.alpha(0.1).restart();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Handler for concept completion
  const handleConceptComplete = async (conceptId: string) => {
    try {
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

      setSelectedConcept(null);
      const node = d3.select(`circle[data-id="${conceptId}"]`);
      node.attr("stroke", "#4CAF50").attr("stroke-width", 4);
    } catch (error) {
      console.error("Error marking concept as complete:", error);
    }
  };

  // Handler for overlay dismissal
  const handleOverlayClick = () => {
    setSelectedConcept(null);
  };

  // Component render
  return (
    <div className="w-screen h-screen transition-all duration-300 ease-in-out overflow-visible">
      <div ref={containerRef} className="w-full h-full overflow-visible">
        {selectedConcept && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={handleOverlayClick}
          >
            <div
              className="relative bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-auto"
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

// Helper function to organize mathematical concepts
function organizeMathConcepts(curves: any[]): MathRelationship[] {
  // This is where you'd implement your mathematical relationship logic
  // Example structure:
  return curves.map((curve, index) => ({
    id: curve.id,
    label: curve.name,
    prerequisites: index > 0 ? [curves[index - 1].id] : [],
    related: index < curves.length - 1 ? [curves[index + 1].id] : [],
    level: Math.floor(index / 3), // Simple level assignment for example
  }));
}
