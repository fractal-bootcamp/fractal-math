import { motion, AnimatePresence } from "framer-motion";
import { ConceptElement } from "@/types/concept";

interface LearningPanelProps {
  concept: ConceptElement | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LearningPanel({ concept, isOpen, onClose }: LearningPanelProps) {
  if (!concept) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: "100%" }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 120 }}
          className="fixed top-0 right-0 w-1/3 h-full bg-gray-900 shadow-xl overflow-y-auto"
        >
          <div className="p-6">
            {/* Concept Title with Animation */}
            <motion.div
              initial={{ x: 0, y: 0 }}
              animate={{ x: "calc(100% - 2rem)", y: "-1rem" }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-2xl font-bold text-white mb-6"
            >
              {concept.name}
            </motion.div>

            {/* Learn More Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full px-4 py-2 mb-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Learn More
            </motion.button>

            {/* Build Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="w-full px-4 py-2 mb-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Build Your Own Implementation
            </motion.button>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-gray-300"
            >
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p>{concept.description}</p>
            </motion.div>

            {/* Prerequisites */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-6"
            >
              <h3 className="text-lg font-semibold mb-2 text-white">Prerequisites</h3>
              <ul className="list-disc list-inside text-gray-300">
                {/* Add prerequisites here */}
              </ul>
            </motion.div>

            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
