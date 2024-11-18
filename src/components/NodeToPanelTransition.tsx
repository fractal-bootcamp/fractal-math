import { motion } from "framer-motion";
import { NodeData } from "@/types/concept";

interface NodeToPanelTransitionProps {
  nodePosition: { x: number; y: number };
  nodeRadius: number;
  nodeColor: string;
  isActive: boolean;
  onAnimationComplete?: () => void;
}

export function NodeToPanelTransition({
  nodePosition,
  nodeRadius,
  nodeColor,
  isActive,
  onAnimationComplete,
}: NodeToPanelTransitionProps) {
  return (
    <motion.div
      initial={{
        position: "fixed",
        top: nodePosition.y,
        left: nodePosition.x,
        width: nodeRadius * 2,
        height: nodeRadius * 2,
        borderRadius: "50%",
        backgroundColor: nodeColor,
        zIndex: 50,
      }}
      animate={{
        top: 0,
        left: "66.67%",
        width: "33.33vw",
        height: "100vh",
        borderRadius: "0",
        backgroundColor: "#1a1a1a",
      }}
      exit={{
        top: nodePosition.y,
        left: nodePosition.x,
        width: nodeRadius * 2,
        height: nodeRadius * 2,
        borderRadius: "50%",
        backgroundColor: nodeColor,
      }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 120,
      }}
      onAnimationComplete={onAnimationComplete}
    >
      {/* Optional content during transition */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full h-full flex items-center justify-center"
      >
        <div className="text-white text-xl font-bold">
          Loading concept details...
        </div>
      </motion.div>
    </motion.div>
  );
}
