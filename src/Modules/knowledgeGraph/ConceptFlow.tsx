"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';
import * as d3 from "d3";
import type { ConceptNode, Edge } from "@/types/conceptTypes";

const DynamicMathVisualization = dynamic(() => import('./MathConceptVisualization'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
    </div>
  )
});

interface SimulationNodeDatum extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: 'concept' | 'theorem' | 'problem';
}

interface SimulationLinkDatum extends d3.SimulationLinkDatum<SimulationNodeDatum> {
  source: string;
  target: string;
  strength?: number;
}

interface ConceptFlowProps {
  onLearnMore?: (conceptId: string) => void;
  onBuild?: (conceptId: string) => void;
  nodes?: ConceptNode[];
  edges?: Edge[];
}

export default function ConceptFlow({
  onLearnMore,
  onBuild,
  nodes = [],
  edges = []
}: ConceptFlowProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<ConceptNode | null>(null);
  const [showVisualization, setShowVisualization] = useState(false);

  useEffect(() => {
    if (!svgRef.current || !Array.isArray(nodes) || nodes.length === 0) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const simulation = d3.forceSimulation<SimulationNodeDatum>()
      .force("link", d3.forceLink<SimulationNodeDatum, SimulationLinkDatum>()
        .id(d => d.id)
        .distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const initialNodes = nodes.map(node => ({
      id: node.id,
      name: node.name,
      type: node.type || 'concept',
      x: width / 2 + (Math.random() - 0.5) * 100,
      y: height / 2 + (Math.random() - 0.5) * 100,
    }));

    const initialLinks = Array.isArray(edges) ? edges.map(edge => ({
      source: edge.source,
      target: edge.target,
      strength: edge.strength,
    })) : [];

    simulation.nodes(initialNodes);
    const linkForce = simulation.force<d3.ForceLink<SimulationNodeDatum, SimulationLinkDatum>>("link");
    if (linkForce) {
      linkForce.links(initialLinks);
    }

    const linksGroup = d3.select(svgRef.current).select(".links");
    const nodesGroup = d3.select(svgRef.current).select(".nodes");

    const link = linksGroup
      .selectAll("path")
      .data(initialLinks)
      .join("path")
      .attr("stroke", "white")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2)
      .attr("fill", "none");

    const node = nodesGroup
      .selectAll("g")
      .data(initialNodes)
      .join("g")
      .on("click", (event, d) => {
        const selectedNode = nodes.find(node => node.id === d.id);
        if (selectedNode) {
          setSelectedNode(selectedNode);
          setShowVisualization(true);
        }
      });

    node.append("circle")
      .attr("r", 10)
      .attr("fill", "white");

    node.append("text")
      .text(d => d.name)
      .attr("text-anchor", "middle")
      .attr("dy", "0.3em")
      .attr("fill", "white")
      .attr("font-size", "12px");

    simulation.on("tick", () => {
      link.attr("d", (d: any) => {
        if (!d.source.x || !d.source.y || !d.target.x || !d.target.y) return "";
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy);
        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
      });

      node.attr("transform", d => {
        if (!d.x || !d.y) return "";
        return `translate(${d.x},${d.y})`;
      });
    });

    simulation.alpha(0.3).restart();

    return () => {
      simulation.stop();
    };
  }, [nodes, edges]);

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ background: 'rgb(17, 24, 39)' }}
      >
        <g className="links" />
        <g className="nodes" />
      </svg>

      <AnimatePresence>
        {showVisualization && selectedNode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0"
          >
            <DynamicMathVisualization
              conceptId={selectedNode.id}
              conceptName={selectedNode.name}
              nodes={nodes}
              edges={edges}
              onLearnMore={onLearnMore}
              onBuild={onBuild}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
