"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import ConceptCards from "./ConceptCards";

// Define the structure for node data
interface NodeData {
  id: string;
  label: string;
  comfort: number | null;
  category: string;
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

interface ConceptFlowData {
  nodes: NodeData[];
  links: LinkData[];
}

export default function ConceptFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<ConceptFlowData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConcept, setSelectedConcept] = useState<NodeData | null>(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchConceptData();
  }, []);

  const fetchConceptData = async () => {
    try {
      console.log("Starting data fetch");
      const response = await fetch("/api/concept-flow");
      console.log("API Response:", response.status);

      if (!response.ok) throw new Error("Failed to fetch concept data");
      const conceptData = await response.json();
      console.log("Received data:", conceptData);

      if (!conceptData.nodes || !conceptData.links) {
        throw new Error("Invalid data format received");
      }

      setData(conceptData);
    } catch (err) {
      console.error("Error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch concept data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!data || !containerRef.current) return;

    // Clear any existing SVG
    d3.select(containerRef.current).selectAll("svg").remove();

    // Get container dimensions
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    console.log("Container dimensions:", width, height); // Debug dimensions

    // Create SVG with explicit dimensions and background
    const svg = d3
      .select(containerRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("background-color", "#111") // Dark background to see if SVG is rendered
      .append("g");

    // Create the simulation with actual data
    const simulation = d3
      .forceSimulation(data.nodes)
      .force(
        "link",
        d3
          .forceLink(data.links)
          .id((d: any) => d.id)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(50));

    // Create links with visible styling
    const links = svg
      .append("g")
      .selectAll("line")
      .data(data.links)
      .join("line")
      .style("stroke", "#666")
      .style("stroke-width", 2);

    // Create nodes with visible styling
    const nodes = svg
      .append("g")
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedConcept(d);
        setPopupPosition({
          x: event.pageX,
          y: event.pageY,
        });
        console.log("Clicked node:", d); // Debug log to see the node data
      });

    // Add click handler to background to close popup
    svg.on("click", () => {
      setSelectedConcept(null);
    });

    // Add circles to nodes
    nodes
      .append("circle")
      .attr("r", 30)
      .style("fill", "#4f46e5")
      .style("stroke", "#fff")
      .style("stroke-width", 2);

    // Add labels to nodes
    nodes
      .append("text")
      .text((d) => d.label)
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .style("fill", "#fff")
      .style("font-size", "12px");

    // Add drag behavior
    nodes.call(
      d3
        .drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

    // Update positions on simulation tick
    simulation.on("tick", () => {
      links
        .attr("x1", (d) => (d.source as any).x)
        .attr("y1", (d) => (d.source as any).y)
        .attr("x2", (d) => (d.target as any).x)
        .attr("y2", (d) => (d.target as any).y);

      nodes.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [data]);

  if (loading) {
    console.log("Rendering loading state");
    return <div className="text-white">Loading concept map...</div>;
  }

  if (error) {
    console.log("Rendering error state:", error);
    return <div className="text-white">Error: {error}</div>;
  }

  if (!data) {
    console.log("No data available");
    return <div className="text-white">No concept data available</div>;
  }

  console.log("Rendering visualization with data:", data);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="w-full h-full bg-black border border-gray-700 rounded-lg"
        style={{ minHeight: "600px" }}
      />

      {/* Concept Details Popup */}
      {selectedConcept && (
        <div
          className="absolute bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-lg"
          style={{
            left: popupPosition.x,
            top: popupPosition.y,
            transform: "translate(-50%, -100%)",
            zIndex: 1000,
            minWidth: "300px",
          }}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-white">
              {selectedConcept.label}
            </h3>
            <button
              onClick={() => setSelectedConcept(null)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>

          {/* Concept Cards Component */}
          <ConceptCards
            conceptId={selectedConcept.id}
            onComplete={(conceptId) => {
              // Handle completion
              console.log(`Completed concept: ${conceptId}`);
            }}
          />
        </div>
      )}
    </div>
  );
}
