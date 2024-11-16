"use client";

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MathConceptVisualization from './MathConceptVisualization';
import { Mafs, Coordinates, Plot } from "mafs";
import "mafs/core.css";
import { ConceptNode, Edge } from '../types/conceptTypes';

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
  const [viewState, setViewState] = useState<'graph' | 'visualization'>('graph');
  const [activeConceptId, setActiveConceptId] = useState(initialConcept);
  const [parameters, setParameters] = useState({ a: 1, b: 0, c: 0 });

  const handleLearnMore = useCallback((nodeId: string) => {
    setActiveConceptId(nodeId);
    setViewState('visualization');
  }, []);

  const handleBack = useCallback(() => {
    if (viewState === 'visualization') {
      setViewState('graph');
    } else {
      onClose?.();
    }
  }, [viewState, onClose]);

  const activeConcept = nodes.find(node => node.id === activeConceptId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div 
        className="bg-white rounded-lg w-[90vw] h-[90vh] p-6 relative"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 rounded-full p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <AnimatePresence mode="wait">
          {viewState === 'graph' ? (
            <motion.div
              key="graph"
              className="w-full h-full"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-center">
                Explore {activeConcept?.name || 'Concept'}
              </h2>
              <MathConceptVisualization
                conceptId={activeConceptId}
                conceptName={activeConcept?.name || ''}
                type="graph"
                nodes={nodes}
                edges={edges}
                onLearnMore={handleLearnMore}
                onBuild={(nodeId) => {
                  // Handle build action
                  console.log('Build:', nodeId);
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="visualization"
              className="w-full h-full"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-center">
                {activeConcept?.name || 'Visualization'}
              </h2>
              <div className="w-full h-[calc(100%-4rem)]">
                <Mafs
                  viewBox={{ x: [-5, 5], y: [-5, 5] }}
                  preserveAspectRatio={false}
                >
                  <Coordinates />
                  {activeConcept?.equation && (
                    <Plot.OfX y={(x) => {
                      try {
                        // Safely evaluate the equation with parameters
                        const { a, b, c } = parameters;
                        return eval(activeConcept.equation);
                      } catch (e) {
                        return 0;
                      }
                    }} />
                  )}
                </Mafs>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
