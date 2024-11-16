import React from 'react';
import { motion } from 'framer-motion';

interface LearningPanelProps {
  isOpen: boolean;
  onClose: () => void;
  concept?: {
    id: string;
    name: string;
  };
}

export const LearningPanel: React.FC<LearningPanelProps> = ({ isOpen, onClose, concept }) => {
  if (!isOpen || !concept) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ duration: 0.3 }}
      className="fixed right-0 top-0 h-full w-1/3 bg-white shadow-lg p-6 overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{concept.name}</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Add learning content sections here */}
        <section>
          <h3 className="text-xl font-semibold mb-3">Overview</h3>
          <p className="text-gray-700">
            Content for {concept.name} will be displayed here.
          </p>
        </section>
      </div>
    </motion.div>
  );
};
