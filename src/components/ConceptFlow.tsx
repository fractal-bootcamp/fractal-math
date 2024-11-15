"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import dynamic from "next/dynamic";
import { CurveInfo } from "@/types/curveTypes";

const CurveVisualization = dynamic(() => import("./CurveVisualization"), {
  ssr: false,
  loading: () => <div>Loading visualization...</div>,
});

interface NodeData extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  comfort: boolean | null;
  level: number;
}

interface LinkData {
  source: string;
  target: string;
  type: "prerequisite" | "related";
}

const NODE_RADIUS = 28;
const ZOOM_MIN = 0.1;
const ZOOM_MAX = 4;
const ZOOM_DURATION = 250;

export default function ConceptFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedCurve, setSelectedCurve] = useState<CurveInfo | null>(null);
  const simulationRef = useRef<d3.Simulation<NodeData, LinkData> | null>(null);

  useEffect(() => {
    const fetchCurveData = async () => {
      try {
        const response = await fetch("/api/curves");
        const curves = await response.json();

        if (!containerRef.current) return;

        const container = containerRef.current;
        const bounds = container.getBoundingClientRect();
        const width = bounds.width;
        const height = bounds.height;

        // Clear existing SVG
        d3.select(containerRef.current).selectAll("svg").remove();

        // Create new SVG
        const svg = d3
          .select(containerRef.current)
          .append("svg")
          .attr("width", "100%")
          .attr("height", "100%")
          .attr("viewBox", [0, 0, width, height]);

        // Create groups for links and nodes
        const linksGroup = svg.append("g").attr("class", "links");
        const nodesGroup = svg.append("g").attr("class", "nodes");

        // Create nodes and links from curves data
        const nodes: NodeData[] = Object.values(curves).map(
          (curve: any, index) => ({
            id: curve.id,
            name: curve.name,
            comfort: null,
            level: Math.floor(index / 3),
            x: Math.random() * width,
            y: Math.random() * height,
          })
        );

        const links: LinkData[] = [];
        Object.values(curves).forEach((curve: any, index, array) => {
          if (index > 0) {
            links.push({
              source: array[index - 1].id,
              target: curve.id,
              type: "prerequisite",
            });
          }
          if (index < array.length - 1) {
            links.push({
              source: curve.id,
              target: array[index + 1].id,
              type: "related",
            });
          }
        });

        // Configure force simulation
        simulationRef.current = d3
          .forceSimulation<NodeData>(nodes)
          .force(
            "link",
            d3
              .forceLink<NodeData, LinkData>(links)
              .id((d) => d.id)
              .distance(NODE_RADIUS * 4)
              .strength(0.5)
          )
          .force(
            "charge",
            d3
              .forceManyBody()
              .strength(-500)
              .distanceMax(width)
              .distanceMin(NODE_RADIUS * 2)
          )
          .force(
            "collision",
            d3
              .forceCollide()
              .radius(NODE_RADIUS * 1.5)
              .strength(1)
              .iterations(2)
          )
          .force("center", d3.forceCenter(width / 2, height / 2))
          .alphaDecay(0.01)
          .velocityDecay(0.3);

        // Setup drag behavior
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

        // Add links
        const link = linksGroup
          .selectAll("path")
          .data(links)
          .join("path")
          .attr("stroke", "#ff8c00")
          .attr("stroke-opacity", 0.6)
          .attr("stroke-width", 2)
          .attr("fill", "none");

        // Add nodes with glow effect
        const defs = svg.append("defs");
        const filter = defs
          .append("filter")
          .attr("id", "glow")
          .attr("x", "-50%")
          .attr("y", "-50%")
          .attr("width", "200%")
          .attr("height", "200%");

        filter
          .append("feGaussianBlur")
          .attr("stdDeviation", "3")
          .attr("result", "coloredBlur");

        const nodeGroup = nodesGroup
          .selectAll("g")
          .data(nodes)
          .join("g")
          .call(drag as any)
          .on("click", async (event, d) => {
            try {
              const response = await fetch(`/api/curves/${d.id}`);
              if (!response.ok) throw new Error("Failed to fetch curve data");
              const data = await response.json();
              setSelectedCurve(data);
            } catch (error) {
              console.error("Error fetching curve data:", error);
            }
          });

        // Add circle with glow
        nodeGroup
          .append("circle")
          .attr("r", NODE_RADIUS)
          .attr("fill", "#4CAF50")
          .style("filter", "url(#glow)");

        // Add text labels
        nodeGroup
          .append("text")
          .text((d) => d.name)
          .attr("text-anchor", "middle")
          .attr("dy", "0.3em")
          .attr("fill", "white")
          .attr("font-size", "12px")
          .style("pointer-events", "none");

        // Update positions on simulation tick
        simulationRef.current.on("tick", () => {
          link.attr("d", (d: any) => {
            const dx = d.target.x - d.source.x;
            const dy = d.target.y - d.source.y;
            const dr = Math.sqrt(dx * dx + dy * dy) * 2;
            return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
          });

          nodeGroup.attr("transform", (d) => `translate(${d.x},${d.y})`);
        });

        // Update zoom behavior
        const zoom = d3
          .zoom<SVGSVGElement, unknown>()
          .scaleExtent([ZOOM_MIN, ZOOM_MAX])
          .on("zoom", (event) => {
            const transform = event.transform;

            // Apply transform to both links and nodes groups
            linksGroup.attr("transform", transform);
            nodesGroup.attr("transform", transform);

            // Scale stroke width inversely to zoom to maintain visual consistency
            link.style("stroke-width", 2 / transform.k);
            nodeGroup
              .selectAll("circle")
              .style("stroke-width", 1.5 / transform.k);

            // Scale text size inversely to zoom
            nodeGroup
              .selectAll("text")
              .style("font-size", `${12 / transform.k}px`);
          });

        // Initialize zoom with transition
        svg
          .call(zoom as any)
          .call(
            zoom.transform as any,
            d3.zoomIdentity.translate(width / 2, height / 2).scale(0.8)
          );

        // Add double-click to reset zoom
        svg.on("dblclick.zoom", () => {
          svg
            .transition()
            .duration(ZOOM_DURATION)
            .call(
              zoom.transform as any,
              d3.zoomIdentity.translate(width / 2, height / 2).scale(0.8)
            );
        });
      } catch (error) {
        console.error("Error fetching curves:", error);
      }
    };

    fetchCurveData();

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

  return (
    <div className="w-screen h-screen bg-gray-900 relative">
      <div ref={containerRef} className="w-full h-full">
        {selectedCurve && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-lg p-6 max-w-4xl w-full relative">
              <button
                onClick={() => setSelectedCurve(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold text-white mb-4">
                {selectedCurve.name}
              </h2>
              <div className="h-[300px] bg-gray-800 rounded-lg overflow-hidden">
                <CurveVisualization
                  equation={selectedCurve.examples[0]}
                  initialParameters={{
                    a: 1,
                    b: 0,
                    c: 0,
                    h: 0,
                    k: 0,
                  }}
                  curveName={selectedCurve.name}
                />
              </div>
              <div className="mt-4 space-y-4 text-white">
                <div>
                  <h3 className="text-lg font-semibold">Description</h3>
                  <p className="text-gray-300">{selectedCurve.description}</p>
                </div>
                {selectedCurve.examples?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold">Examples</h3>
                    <ul className="list-disc list-inside text-gray-300">
                      {selectedCurve.examples.map((example, index) => (
                        <li key={index}>{example}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
