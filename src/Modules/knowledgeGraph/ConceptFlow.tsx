"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import dynamic from "next/dynamic";
import { CurveInfo } from "@/types/curveTypes";
import { motion, AnimatePresence } from "framer-motion";
import { LearningPanel } from "@/modules/LearningPanel";

const CurveVisualization = dynamic(() => import("@/components/CurveVisualization"), {
  ssr: false,
  loading: () => <div>Loading visualization...</div>,
});

interface NodeData extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  comfort: boolean | null;
  level: number;
  x?: number;
  y?: number;
}

interface LinkData {
  source: string;
  target: string;
  type: "prerequisite" | "related";
}

const NODE_RADIUS = 28;
const ZOOM_MIN = 0.1;
const ZOOM_MAX = 4;
const ZOOM_DURATION = 750;
const TRANSITION_DURATION = 500;

export default function ConceptFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedCurve, setSelectedCurve] = useState<CurveInfo | null>(null);
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [expandedNode, setExpandedNode] = useState<NodeData | null>(null);
  const [childNodes, setChildNodes] = useState<NodeData[]>([]);
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [links, setLinks] = useState<LinkData[]>([]);
  const [showLearningPanel, setShowLearningPanel] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const simulationRef = useRef<d3.Simulation<NodeData, LinkData> | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const zoomToNode = (node: NodeData, scale: number = 2) => {
    if (!svgRef.current || !containerRef.current || !zoomRef.current) return;

    const bounds = containerRef.current.getBoundingClientRect();
    const width = bounds.width;
    const height = bounds.height;

    const dx = width / 2 - (node.x || 0) * scale;
    const dy = height / 2 - (node.y || 0) * scale;

    d3.select(svgRef.current)
      .transition()
      .duration(ZOOM_DURATION)
      .call(
        zoomRef.current.transform as any,
        d3.zoomIdentity.translate(dx, dy).scale(scale)
      );
  };

  const handleNodeClick = async (event: any, d: NodeData) => {
    event.stopPropagation();
    
    if (selectedNode?.id === d.id) {
      // Second click - show learning panel
      setShowLearningPanel(true);
      setSelectedNode(d);
    } else {
      // First click - zoom to node and show child nodes
      setSelectedNode(d);
      zoomToNode(d);

      // If there's already an expanded node, collapse it first
      if (expandedNode && expandedNode.id !== d.id) {
        setChildNodes([]);
        setExpandedNode(null);
      }

      // Toggle child nodes
      if (expandedNode?.id === d.id) {
        setChildNodes([]);
        setExpandedNode(null);
      } else {
        try {
          // Fetch child concepts from API
          const response = await fetch(`/api/concepts/${d.id}/children`);
          if (!response.ok) throw new Error("Failed to fetch child concepts");
          const childData = await response.json();
          
          // Create child nodes in a circular arrangement
          const numChildren = childData.length;
          const radius = NODE_RADIUS * 4;
          const newChildNodes: NodeData[] = childData.map((child: any, index: number) => ({
            id: child.id,
            name: child.name,
            comfort: null,
            level: d.level + 1,
            x: (d.x || 0) + radius * Math.cos(2 * Math.PI * index / numChildren),
            y: (d.y || 0) + radius * Math.sin(2 * Math.PI * index / numChildren),
          }));

          setChildNodes(newChildNodes);
          setExpandedNode(d);
          
          // Update simulation with new nodes
          if (simulationRef.current) {
            const allNodes = [...nodes, ...newChildNodes];
            simulationRef.current.nodes(allNodes);
            simulationRef.current.alpha(0.1).restart();
          }
        } catch (error) {
          console.error("Error fetching child concepts:", error);
        }
      }
    }
  };

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

        // Create new SVG with defs and groups only once
        const svg = d3
          .select(containerRef.current)
          .append("svg")
          .attr("width", "100%")
          .attr("height", "100%")
          .attr("viewBox", [0, 0, width, height]);

        svgRef.current = svg.node();

        // Create groups for links and nodes
        const linksGroup = svg.append("g").attr("class", "links");
        const nodesGroup = svg.append("g").attr("class", "nodes");

        // Create nodes and links from curves data - memoize this computation
        const initialNodes = Object.values(curves).map(
          (curve: any, index) => ({
            id: curve.id,
            name: curve.name,
            comfort: null,
            level: Math.floor(index / 3),
            x: width / 2 + (Math.random() - 0.5) * 100, // Centered initial positions
            y: height / 2 + (Math.random() - 0.5) * 100,
          })
        );

        const initialLinks = [];
        Object.values(curves).forEach((curve: any, index, array) => {
          if (index > 0) {
            initialLinks.push({
              source: array[index - 1].id,
              target: curve.id,
              type: "prerequisite",
            });
          }
          if (index < array.length - 1) {
            initialLinks.push({
              source: curve.id,
              target: array[index + 1].id,
              type: "related",
            });
          }
        });

        setNodes(initialNodes);
        setLinks(initialLinks);

        // Setup optimized drag behavior with debounced simulation updates
        const drag = d3
          .drag<SVGGElement, NodeData>()
          .on("start", (event, d) => {
            if (!event.active && simulationRef.current) {
              simulationRef.current
                .alphaTarget(0.1) // Lower target for smoother transitions
                .restart();
            }
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
            // Update only the dragged node's position during drag
            d3.select(event.sourceEvent.target.parentNode)
              .attr("transform", `translate(${event.x},${event.y})`);
          })
          .on("end", (event, d) => {
            if (!event.active && simulationRef.current) {
              simulationRef.current.alphaTarget(0);
            }
            d.fx = null;
            d.fy = null;
          });

        // Optimize force simulation
        simulationRef.current = d3
          .forceSimulation<NodeData>(initialNodes)
          .force(
            "link",
            d3
              .forceLink<NodeData, LinkData>(initialLinks)
              .id((d) => d.id)
              .distance(NODE_RADIUS * 4)
              .strength(0.3) // Reduced strength for smoother motion
          )
          .force(
            "charge",
            d3
              .forceManyBody()
              .strength(-300) // Reduced strength
              .distanceMax(width / 2) // Limit force application range
              .distanceMin(NODE_RADIUS * 2)
          )
          .force(
            "collision",
            d3
              .forceCollide()
              .radius(NODE_RADIUS * 1.2)
              .strength(0.7)
              .iterations(1)
          )
          .force("center", d3.forceCenter(width / 2, height / 2))
          .alphaDecay(0.02) // Faster convergence
          .velocityDecay(0.4) // Smoother motion
          .alpha(0.3) // Lower initial energy
          .stop(); // Don't start immediately

        // Add nodes with optimized rendering
        const nodeGroup = nodesGroup
          .selectAll("g")
          .data(initialNodes)
          .join("g")
          .call(drag as any)
          .on("click", handleNodeClick);

        // Add circle with glow - use CSS transform for better performance
        nodeGroup
          .append("circle")
          .attr("r", NODE_RADIUS)
          .attr("fill", "#4CAF50")
          .style("filter", "url(#glow)")
          .style("will-change", "transform"); // Optimize for animations

        // Add text labels with better performance
        nodeGroup
          .append("text")
          .text((d) => d.name)
          .attr("text-anchor", "middle")
          .attr("dy", "0.3em")
          .attr("fill", "white")
          .attr("font-size", "12px")
          .style("pointer-events", "none")
          .style("will-change", "transform");

        // Add glow effect definition
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

        // Add links
        const link = linksGroup
          .selectAll("path")
          .data(initialLinks)
          .join("path")
          .attr("stroke", "#ff8c00")
          .attr("stroke-opacity", 0.6)
          .attr("stroke-width", 2)
          .attr("fill", "none");

        // Optimize tick function for better performance
        simulationRef.current.on("tick", () => {
          // Use transform attribute for better performance
          nodeGroup.attr("transform", d => `translate(${d.x},${d.y})`);
          
          // Update links with optimized path calculation
          link.attr("d", (d: any) => {
            const dx = d.target.x - d.source.x;
            const dy = d.target.y - d.source.y;
            const dr = Math.sqrt(dx * dx + dy * dy);
            return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
          });
        });

        // Start simulation with optimized settings
        simulationRef.current.restart();

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

        zoomRef.current = zoom;

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
        <AnimatePresence>
          {selectedCurve && !isTransitioning && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            >
              <div className="bg-gray-900 rounded-lg p-6 max-w-4xl w-full relative">
                <button
                  onClick={() => {
                    setSelectedCurve(null);
                    setSelectedNode(null);
                  }}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                  ✕
                </button>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {selectedCurve.name}
                </h2>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "300px" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="bg-gray-800 rounded-lg overflow-hidden"
                >
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
                </motion.div>
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
            </motion.div>
          )}
          {showLearningPanel && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            >
              <div className="bg-gray-900 rounded-lg p-6 max-w-4xl w-full relative">
                <button
                  onClick={() => {
                    setShowLearningPanel(false);
                  }}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                  ✕
                </button>
                <LearningPanel node={selectedNode} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
