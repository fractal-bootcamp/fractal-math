"use client";

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import type { ConceptNode, Edge } from '@/types/conceptTypes';

const DynamicMathVisualization = dynamic(() => import('./MathConceptVisualization'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
    </div>
  )
});

interface ConceptExplorerProps {
  initialConcept: string;
  nodes: ConceptNode[];
  edges: Edge[];
  onClose?: () => void;
}

export default function ConceptExplorer({
  initialConcept,
  nodes,
  edges,
  onClose
}: ConceptExplorerProps) {
  const [selectedConcept, setSelectedConcept] = useState(initialConcept);
  
  const handleLearnMore = useCallback((conceptId: string) => {
    setSelectedConcept(conceptId);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gray-900 bg-opacity-95"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
      >
        ✕
      </button>
      
      <div className="w-full h-full p-8">
        <DynamicMathVisualization
          conceptId={selectedConcept}
          conceptName={nodes.find(n => n.id === selectedConcept)?.name || ''}
          nodes={nodes}
          edges={edges}
          onLearnMore={handleLearnMore}
        />
      </div>
    </motion.div>
  );
}
