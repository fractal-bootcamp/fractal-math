"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface LearningModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  width?: string;
  height?: string;
  className?: string;
}

export const LearningModal: React.FC<LearningModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  width = 'max-w-4xl',
  height = 'h-[80vh]',
  className = '',
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            className={`${width} ${height} w-full bg-gray-900 rounded-xl shadow-2xl overflow-hidden relative ${className}`}
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 bg-gray-800/50 backdrop-blur-sm p-4 flex items-center justify-between border-b border-gray-700/50">
              {title && (
                <h2 className="text-xl font-semibold text-white">{title}</h2>
              )}
              <button
                onClick={onClose}
                className="ml-auto p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50"
                aria-label="Close modal"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="h-full overflow-auto pt-16 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
