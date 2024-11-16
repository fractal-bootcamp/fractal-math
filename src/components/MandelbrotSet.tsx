"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface FractalLandingProps {
  onConceptClick?: (conceptId: string) => void;
}

const FractalLanding: React.FC<FractalLandingProps> = ({ onConceptClick }) => {
  const [time, setTime] = useState(0);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const generateFractalPoints = () => {
    const points = [];
    const maxIterations = 225;
    const baseScale = 90 + Math.sin(time * 0.02) * 10;

    for (let i = 0; i < maxIterations; i++) {
      const angle = (i * 137.5 + time * 0.5) * (Math.PI / 180);
      const radius = Math.sqrt(i) * baseScale * 0.2;

      const x =
        Math.cos(angle) * radius * (1 + Math.sin(time * 0.03 + i * 0.1) * 0.3);
      const y =
        Math.sin(angle) * radius * (1 + Math.cos(time * 0.03 + i * 0.1) * 0.3);
      const z = radius * 0.5 * Math.sin(time * 0.02 + i * 0.05);

      const zRotation = time * 0.02;
      const newX = x * Math.cos(zRotation) - y * Math.sin(zRotation);
      const newY = x * Math.sin(zRotation) + y * Math.cos(zRotation);

      const perspective = 1200;
      const scale3d = perspective / (perspective + z);

      points.push({
        x: newX * scale3d,
        y: newY * scale3d,
        z: z,
        conceptId: i < 3 ? ["mandelbrot", "julia", "escape-time"][i] : undefined,
      });
    }
    return points;
  };

  const getColor = (index: number, isHovered: boolean) => {
    const baseHue = (index * 0.5 + time) % 360;
    const saturation = isHovered ? "100%" : "80%";
    const lightness = isHovered ? "60%" : "50%";
    return `hsl(${baseHue}, ${saturation}, ${lightness})`;
  };

  const handlePointClick = (index: number, point: { conceptId?: string }) => {
    if (point.conceptId && onConceptClick) {
      onConceptClick(point.conceptId);
    }
  };

  const points = generateFractalPoints();

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence>
          {points.map((point, index) => (
            <motion.div
              key={index}
              className={`absolute rounded-full cursor-pointer
                ${point.conceptId ? 'w-4 h-4 border-2 border-white' : 'w-2 h-2'}`}
              style={{
                backgroundColor: getColor(index, hoveredPoint === index),
                zIndex: point.conceptId ? 10 : 1,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: hoveredPoint === index ? 1.5 : 1,
                opacity: 1,
                x: point.x,
                y: point.y,
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                mass: 0.5,
              }}
              onClick={() => handlePointClick(index, point)}
              onHoverStart={() => setHoveredPoint(index)}
              onHoverEnd={() => setHoveredPoint(null)}
              whileHover={{ scale: 1.5 }}
            />
          ))}
        </AnimatePresence>
      </div>

      <motion.div
        className="absolute top-4 left-4 text-white text-xl font-bold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Fractal Mathematics Explorer
      </motion.div>

      <AnimatePresence>
        {hoveredPoint !== null && points[hoveredPoint].conceptId && (
          <motion.div
            className="absolute bg-white bg-opacity-90 px-4 py-2 rounded-lg text-black"
            style={{
              x: points[hoveredPoint].x + 20,
              y: points[hoveredPoint].y,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {points[hoveredPoint].conceptId === "mandelbrot"
              ? "Explore Mandelbrot Set"
              : points[hoveredPoint].conceptId === "julia"
              ? "Discover Julia Sets"
              : "Learn Escape Time Algorithm"}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FractalLanding;
