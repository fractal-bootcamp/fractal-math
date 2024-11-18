"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as d3 from 'd3';
import { LearningPanel } from "@/modules/LearningPanel";
import type { ConceptNode, Edge } from "@/types/conceptTypes";

interface MathConceptVisualizationProps {
  conceptId: string;
  conceptName: string;
  initialParameters?: Record<string, number>;
  nodes?: ConceptNode[];
  edges?: Edge[];
  onLearnMore?: (nodeId: string) => void;
  onBuild?: (nodeId: string) => void;
}

interface SimulationNode extends d3.SimulationNodeDatum {
  id: string;
  x?: number;
  y?: number;
}

const MathConceptVisualization = ({
  conceptId,
  conceptName,
  initialParameters,
  nodes = [],
  edges = [],
  onLearnMore,
  onBuild
}: MathConceptVisualizationProps) => {
  const [parameters, setParameters] = useState<Record<string, number>>(initialParameters || {});
  const [zoom, setZoom] = useState(1);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});
  const [showLearningPanel, setShowLearningPanel] = useState(false);
  const [selectedNode, setSelectedNode] = useState<ConceptNode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<SimulationNode, undefined> | null>(null);

  // Initialize force simulation
  useEffect(() => {
    if (!containerRef.current || nodes.length === 0) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const simulation = d3.forceSimulation<SimulationNode>(nodes.map(node => ({ ...node })))
      .force('charge', d3.forceManyBody().strength(-1000))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(60))
      .force('link', d3.forceLink<SimulationNode, d3.SimulationLinkDatum<SimulationNode>>(edges)
        .id(d => d.id)
        .distance(150));

    simulation.on('tick', () => {
      const newPositions: Record<string, { x: number; y: number }> = {};
      simulation.nodes().forEach((node) => {
        if (typeof node.x === 'number' && typeof node.y === 'number') {
          newPositions[node.id] = {
            x: Math.max(60, Math.min(width - 60, node.x)),
            y: Math.max(60, Math.min(height - 60, node.y))
          };
        }
      });
      setNodePositions(newPositions);
    });

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
    };
  }, [nodes, edges]);

  // Handle node click
  const handleNodeClick = useCallback((nodeId: string) => {
    const clickedNode = nodes.find(node => node.id === nodeId);
    if (!clickedNode) return;

    if (activeNode === nodeId) {
      setActiveNode(null);
      return;
    }

    setActiveNode(nodeId);
    setSelectedNode(clickedNode);
    setShowLearningPanel(true);
  }, [activeNode, nodes]);

  // Get node color based on state
  const getNodeColor = useCallback((node: ConceptNode) => {
    if (node.id === activeNode) return '#FFD700';
    if ((node.prerequisites || []).length > 0) return '#FF7F50';
    if (nodes.some(n => (n.prerequisites || []).includes(node.id))) return '#98FB98';
    return '#87CEEB';
  }, [activeNode, nodes]);

  return (
    <div className="w-full h-full relative" ref={containerRef}>
      {/* Render edges */}
      {Object.keys(nodePositions).length > 0 && edges.map((edge, index) => {
        const sourcePos = nodePositions[edge.source];
        const targetPos = nodePositions[edge.target];
        if (!sourcePos || !targetPos) return null;

        return (
          <motion.div
            key={`edge-${index}`}
            className="absolute"
            style={{
              left: sourcePos.x,
              top: sourcePos.y,
              width: Math.sqrt(
                Math.pow(targetPos.x - sourcePos.x, 2) + 
                Math.pow(targetPos.y - sourcePos.y, 2)
              ),
              height: 2,
              backgroundColor: '#666',
              transformOrigin: '0 50%',
              transform: `rotate(${Math.atan2(
                targetPos.y - sourcePos.y,
                targetPos.x - sourcePos.x
              )}rad)`,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          />
        );
      })}

      {/* Render nodes */}
      {Object.entries(nodePositions).map(([id, position]) => {
        const node = nodes.find(n => n.id === id);
        if (!node) return null;

        return (
          <motion.div
            key={id}
            className="absolute cursor-pointer"
            style={{
              left: position.x - 30,
              top: position.y - 30,
              width: 60,
              height: 60,
              backgroundColor: getNodeColor(node),
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '12px',
              textAlign: 'center',
              padding: '4px',
              boxShadow: node.id === activeNode ? '0 0 15px rgba(255, 215, 0, 0.5)' : undefined,
            }}
            onClick={() => handleNodeClick(node.id)}
            whileHover={{ scale: 1.1 }}
          >
            {node.name}
          </motion.div>
        );
      })}

      {/* Learning Panel */}
      <AnimatePresence>
        {showLearningPanel && selectedNode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <div className="relative w-full max-w-4xl">
              <LearningPanel
                isOpen={showLearningPanel}
                onClose={() => {
                  setShowLearningPanel(false);
                  setSelectedNode(null);
                }}
                concept={{
                  id: selectedNode.id,
                  name: selectedNode.name
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

MathConceptVisualization.displayName = 'MathConceptVisualization';

export default MathConceptVisualization;
