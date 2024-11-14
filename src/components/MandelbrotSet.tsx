"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const FractalLanding = () => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const generateFractalPoints = () => {
    const points = [];
    const maxIterations = 225;

    // Oscillate scale between 80 and 100
    const baseScale = 90 + Math.sin(time * 0.02) * 10; // This will oscillate between 80 and 100

    for (let i = 0; i < maxIterations; i++) {
      const angle = (i * 137.5 + time * 0.5) * (Math.PI / 180);
      const radius = Math.sqrt(i) * baseScale * 0.2; // Reduced multiplier for better spread

      // Create more fluid spread using sine waves
      const x =
        Math.cos(angle) * radius * (1 + Math.sin(time * 0.03 + i * 0.1) * 0.3);
      const y =
        Math.sin(angle) * radius * (1 + Math.cos(time * 0.03 + i * 0.1) * 0.3);
      const z = radius * 0.5 * Math.sin(time * 0.02 + i * 0.05); // More dynamic z movement

      // Apply Z rotation
      const zRotation = time * 0.02;
      const newX = x * Math.cos(zRotation) - y * Math.sin(zRotation);
      const newY = x * Math.sin(zRotation) + y * Math.cos(zRotation);

      // Enhanced perspective effect
      const perspective = 1200;
      const scale3d = perspective / (perspective + z);

      points.push({
        x: newX * scale3d,
        y: newY * scale3d,
        z: z,
      });
    }
    return points;
  };

  const getColor = (index: number) => {
    const hue = (time * 0.5 + index) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  const points = generateFractalPoints();
  const centerX = 415;
  const centerY = 300;

  return (
    <div className="h-screen w-full bg-black text-white overflow-y-auto">
      <div className="w-full">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Dive Deep Into Geometry
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Learn about the beauty of geometry and the power of mathematics
            </p>
          </div>
        </div>

        {/* Fractal Visualization */}
        <div className="flex justify-center items-center mb-16">
          <div className="relative w-full max-w-3xl aspect-[4/3]">
            <svg
              className="w-full h-full"
              viewBox="0 0 800 600"
              preserveAspectRatio="xMidYMid slice"
            >
              {points.map((point, index) => (
                <circle
                  key={index}
                  cx={centerX + point.x}
                  cy={centerY + point.y}
                  r={3 + Math.sin(time * 0.05 + index * 0.1) * 1.5}
                  fill={getColor(index)}
                  className="transition-all duration-500 ease-in-out"
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Complex Patterns",
                description:
                  "Witness how simple mathematical rules create infinite complexity",
              },
              {
                title: "Mathematical Beauty",
                description:
                  "Experience the convergence of art and mathematics in the Mandelbrot Set",
              },
              {
                title: "Infinite Detail",
                description:
                  "Explore endless levels of self-similar patterns at every scale",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-6 border border-gray-700 hover:bg-gray-800/70 transition-colors duration-300"
              >
                <h3 className="text-xl font-bold mb-3 text-blue-400">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="container mx-auto px-4 py-16 text-center space-x-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300">
            Begin Your Journey
          </button>
          <Link
            href="/about"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 inline-block"
          >
            About Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FractalLanding;
