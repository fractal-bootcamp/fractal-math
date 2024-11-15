"use client";

import { useEffect, useState, Suspense } from "react";
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  Node,
  Edge,
  NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";
import dynamic from "next/dynamic";
import CustomNode from "./CustomNode";

const CurveVisualization = dynamic(() => import("./CurveVisualization"), {
  ssr: false,
  loading: () => <div>Loading visualization...</div>,
});

interface CurveInfo {
  id: string;
  name: string;
  description: string;
  examples: string[];
  properties: string[];
  equations?: string[];
  parameters?: string[];
  categoryId?: string;
}

export default function ConceptFlow() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCurve, setSelectedCurve] = useState<CurveInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Define nodeTypes
  const nodeTypes: NodeTypes = {
    default: CustomNode,
  };

  // Fetch curves and create nodes
  useEffect(() => {
    const fetchCurves = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/curves");
        if (!response.ok) throw new Error("Failed to fetch curves");
        const data = await response.json();

        // Create nodes from curve data
        const newNodes = Object.entries(data).map(
          ([id, curve]: [string, any], index) => ({
            id,
            type: "default",
            data: { label: curve.name },
            position: {
              x: (index % 4) * 200,
              y: Math.floor(index / 4) * 100,
            },
          })
        );

        setNodes(newNodes);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching curves:", error);
        setLoading(false);
      }
    };

    fetchCurves();
  }, []);

  const onNodeClick = async (_, node: Node) => {
    try {
      const response = await fetch(`/api/curves/${node.id}`);
      if (!response.ok) throw new Error("Failed to fetch curve data");
      const data = await response.json();
      setSelectedCurve(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching curve data:", error);
    }
  };

  if (loading) return <div>Loading curves...</div>;

  return (
    <ReactFlowProvider>
      <div className="h-screen w-full bg-gray-900 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>

        {isModalOpen && selectedCurve && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-lg p-6 max-w-4xl w-full relative">
              <button
                onClick={() => setIsModalOpen(false)}
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
                    h: 0, // center x for translated curves
                    k: 0, // center y for translated curves
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
    </ReactFlowProvider>
  );
}
