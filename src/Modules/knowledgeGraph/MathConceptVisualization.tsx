"use client";

import { Mafs, Coordinates, Plot, Theme } from "mafs";
import "mafs/core.css";
import { useState, useEffect, useCallback, useRef } from "react";
import { ControlPanel } from "@/components/ControlPanel";
import { motion, AnimatePresence } from "framer-motion";
import { LearningPanel } from "@/modules/LearningPanel";


interface ConceptNode {
  id: string;
  name: string;
  type: 'concept' | 'theorem' | 'problem';
  prerequisites: string[];
  subConcepts: string[];
  description: string;
  color?: string;
  theorems?: string[];
  problems?: string[];
}

interface Edge {
  source: string;
  target: string;
  type: string;
}

interface MathConceptVisualizationProps {
  conceptId: string;
  initialParameters?: Record<string, number>;
  conceptName: string;
  type: 'curve' | 'graph';
  nodes?: ConceptNode[];
  edges?: Edge[];
  onLearnMore?: (nodeId: string) => void;
  onBuild?: (nodeId: string) => void;
}

export function MathConceptVisualization({
  conceptId,
  initialParameters = { a: 1, b: 0, c: 0 },
  conceptName,
  type = 'graph',
  nodes = [],
  edges = [],
  onLearnMore,
  onBuild,
}: MathConceptVisualizationProps) {
  const [parameters, setParameters] = useState(initialParameters);
  const [zoom, setZoom] = useState(1);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [subGraph, setSubGraph] = useState<ConceptNode[]>([]);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});
  const [focusScale, setFocusScale] = useState(1);
  const [showLearningPanel, setShowLearningPanel] = useState(false);
  const [selectedNode, setSelectedNode] = useState<ConceptNode | null>(null);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [expandedNode, setExpandedNode] = useState<ConceptNode | null>(null);
  const [childNodes, setChildNodes] = useState<ConceptNode[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate if a node is a prerequisite or has prerequisites
  const getNodeColor = useCallback((node: ConceptNode) => {
    if (node.id === activeNode) return '#FFD700'; // Gold for active node
    if (node.prerequisites.length > 0) return '#FF7F50'; // Coral for nodes with prerequisites
    if (nodes.some(n => n.prerequisites.includes(node.id))) return '#98FB98'; // Pale green for prerequisite nodes
    return '#87CEEB'; // Sky blue for neutral nodes
  }, [activeNode, nodes]);

  // Get sub-element color
  const getSubElementColor = useCallback((type: string) => {
    switch (type) {
      case 'concept': return '#4169E1'; // Royal Blue
      case 'theorem': return '#FF8C00'; // Dark Orange
      case 'problem': return '#20B2AA'; // Light Sea Green
      default: return '#87CEEB';
    }
  }, []);

  // Handle node click with double-click detection
  const handleNodeClick = useCallback(async (nodeId: string) => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTime;
    setLastClickTime(now);

    const clickedNode = nodes.find(node => node.id === nodeId);
    if (!clickedNode) return;

    if (timeSinceLastClick < 300) {
      // Double click - show learning panel
      setSelectedNode(clickedNode);
      setShowLearningPanel(true);
      return;
    }

    // Single click - expand/collapse node
    if (activeNode === nodeId) {
      setActiveNode(null);
      setFocusScale(1);
      setSubGraph([]);
      return;
    }

    setActiveNode(nodeId);
    setFocusScale(1.2);

    // If there's already an expanded node, collapse it first
    if (expandedNode && expandedNode.id !== nodeId) {
      setChildNodes([]);
      setExpandedNode(null);
    }

    // Toggle child nodes
    if (expandedNode?.id === nodeId) {
      setChildNodes([]);
      setExpandedNode(null);
    } else {
      try {
        const response = await fetch(`/api/concepts/${encodeURIComponent(nodeId)}/children`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const childData = await response.json();
        
        if (Array.isArray(childData) && childData.length > 0) {
          // Create child nodes in a circular arrangement
          const numChildren = childData.length;
          const radius = 150;
          const angleStep = (2 * Math.PI) / numChildren;
          const newPositions: Record<string, { x: number; y: number }> = {};

          const childNodes: ConceptNode[] = childData.map((child: any, index: number) => {
            const angle = angleStep * index;
            const position = {
              x: (clickedNode.x || 0) + radius * Math.cos(angle),
              y: (clickedNode.y || 0) + radius * Math.sin(angle)
            };
            newPositions[child.id] = position;
            
            return {
              id: child.id,
              name: child.name,
              type: child.type,
              prerequisites: child.prerequisites || [],
              subConcepts: child.subConcepts || [],
              description: child.description || '',
              ...position
            };
          });

          setNodePositions(prev => ({ ...prev, ...newPositions }));
          setChildNodes(childNodes);
          setExpandedNode(clickedNode);
        } else {
          // No children found - could show a message to the user
          console.log('No child concepts found for:', nodeId);
        }
      } catch (error) {
        console.error("Error fetching child concepts:", error);
        // Could show an error message to the user here
      }
    }
  }, [activeNode, expandedNode, lastClickTime, nodes]);

  const renderNode = useCallback((node: ConceptNode, position: { x: number; y: number }) => {
    const isActive = node.id === activeNode;
    const scale = isActive ? focusScale : 1;
    const baseSize = 60;

    return (
      <motion.div
        key={node.id}
        className={`absolute rounded-lg cursor-pointer shadow-lg overflow-hidden
          ${isActive ? 'z-10' : 'z-0'}`}
        style={{
          width: baseSize * scale,
          height: baseSize * scale,
          backgroundColor: getNodeColor(node),
        }}
        initial={{ scale: 0 }}
        animate={{
          scale,
          x: position.x - (baseSize * scale) / 2,
          y: position.y - (baseSize * scale) / 2,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={() => handleNodeClick(node.id)}
      >
        <div className="w-full h-full p-2 flex flex-col items-center justify-center">
          <span className="text-sm font-bold text-center text-white">{node.name}</span>
          {isActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 flex flex-col gap-1"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLearnMore?.(node.id);
                }}
                className="bg-white text-blue-500 px-2 py-1 rounded text-xs"
              >
                Learn More
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBuild?.(node.id);
                }}
                className="bg-white text-green-500 px-2 py-1 rounded text-xs"
              >
                Build
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  }, [activeNode, focusScale, getNodeColor, onLearnMore, onBuild]);

  const renderEdge = useCallback((source: { x: number; y: number }, target: { x: number; y: number }, type: string) => {
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const length = Math.sqrt(dx * dx + dy * dy);

    return (
      <motion.div
        className="absolute origin-left"
        style={{
          left: source.x,
          top: source.y,
          width: length,
          height: 2,
          backgroundColor: type === 'prerequisite' ? '#FFA500' : '#20B2AA',
          transform: `rotate(${angle}deg)`,
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
    );
  }, []);

  return (
    <div className="w-full h-full relative" ref={containerRef}>
      {/* Render edges */}
      {edges.map((edge, index) => {
        const sourcePos = nodePositions[edge.source];
        const targetPos = nodePositions[edge.target];
        if (sourcePos && targetPos) {
          return (
            <div key={`edge-${index}`}>
              {renderEdge(sourcePos, targetPos, edge.type)}
            </div>
          );
        }
        return null;
      })}

      {/* Render nodes */}
      {nodes.map((node) => {
        const position = nodePositions[node.id];
        if (position) {
          return renderNode(node, position);
        }
        return null;
      })}
      
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
                content={{
                  id: selectedNode.id,
                  title: selectedNode.name,
                  description: selectedNode.description,
                  prerequisites: selectedNode.prerequisites,
                  nextConcepts: selectedNode.subConcepts,
                  type: selectedNode.type
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
