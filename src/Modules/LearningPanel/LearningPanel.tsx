"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LearningModal } from './LearningModal';
import dynamic from 'next/dynamic';

const CurveVisualization = dynamic(() => import('@/components/CurveVisualization'), {
  ssr: false,
  loading: () => <div>Loading visualization...</div>,
});

export interface LearningContent {
  id: string;
  title: string;
  description: string;
  equation?: string;
  examples?: string[];
  visualizationParams?: {
    equation: string;
    parameters: {
      a: number;
      b: number;
      c: number;
      h: number;
      k: number;
    };
  };
  prerequisites?: string[];
  nextConcepts?: string[];
}

interface LearningPanelProps {
  isOpen: boolean;
  onClose: () => void;
  content: LearningContent;
}

export const LearningPanel: React.FC<LearningPanelProps> = ({
  isOpen,
  onClose,
  content,
}) => {
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'explore'>('learn');

  const renderVisualization = () => {
    if (!content.visualizationParams) return null;

    return (
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: 300 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800 rounded-lg overflow-hidden mb-6"
      >
        <CurveVisualization
          equation={content.visualizationParams.equation}
          initialParameters={content.visualizationParams.parameters}
          curveName={content.title}
        />
      </motion.div>
    );
  };

  const renderTabs = () => (
    <div className="flex space-x-2 mb-6 px-6">
      {(['learn', 'practice', 'explore'] as const).map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors
            ${activeTab === tab
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'learn':
        return (
          <div className="space-y-6 px-6">
            {renderVisualization()}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
              <p className="text-gray-300">{content.description}</p>
            </div>
            {content.equation && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Equation</h3>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <code className="text-green-400">{content.equation}</code>
                </div>
              </div>
            )}
            {content.examples && content.examples.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Examples</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  {content.examples.map((example, index) => (
                    <li key={index}>{example}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      case 'practice':
        return (
          <div className="p-6">
            <div className="bg-gray-800/50 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-white mb-2">Practice Mode</h3>
              <p className="text-gray-400">Interactive practice exercises coming soon!</p>
            </div>
          </div>
        );
      case 'explore':
        return (
          <div className="p-6">
            <div className="space-y-6">
              {content.prerequisites && content.prerequisites.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Prerequisites</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {content.prerequisites.map((prereq) => (
                      <button
                        key={prereq}
                        className="p-4 bg-gray-800/50 rounded-lg text-left hover:bg-gray-700/50 transition-colors"
                      >
                        <span className="text-blue-400">→</span> {prereq}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {content.nextConcepts && content.nextConcepts.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Next Concepts</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {content.nextConcepts.map((concept) => (
                      <button
                        key={concept}
                        className="p-4 bg-gray-800/50 rounded-lg text-left hover:bg-gray-700/50 transition-colors"
                      >
                        <span className="text-green-400">↗</span> {concept}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <LearningModal
      isOpen={isOpen}
      onClose={onClose}
      title={content.title}
      className="bg-gray-900"
    >
      {renderTabs()}
      {renderContent()}
    </LearningModal>
  );
};
