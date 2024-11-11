"use client";
import React, { useEffect, useRef } from 'react';

const MandelbrotSet = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const drawMandelbrot = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        const maxIterations = 100;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let a = (x - width / 2) * 4 / width;
                let b = (y - height / 2) * 4 / height;
                const ca = a;
                const cb = b;
                let n = 0;
                while (n < maxIterations) {
                    const aa = a * a - b * b;
                    const bb = 2 * a * b;
                    a = aa + ca;
                    b = bb + cb;
                    if (a * a + b * b > 16) {
                        break;
                    }
                    n++;
                }
                const hue = n === maxIterations ? 0 : (n * 360 / maxIterations);
                ctx.fillStyle = n === maxIterations ? 'black' : `hsl(${hue}, 100%, 50%)`;
                ctx.fillRect(x, y, 1, 1);
            }
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const size = Math.min(window.innerWidth * 0.8, window.innerHeight * 0.8);
        canvas.width = size;
        canvas.height = size;
        drawMandelbrot(ctx, size, size);
    }, []);

    return <canvas ref={canvasRef} className="rounded-lg shadow-lg" />;
};

const FractalLandingPage = () => {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <div className="container mx-auto px-4 pt-8 pb-16">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                        Dive Deep Into Geometry
                    </h1>
                    <p className="text-xl text-gray-300 mb-8">
                        Learn about the beauty of geometry and the power of mathematics
                    </p>
                </div>
            </div>

            {/* Mandelbrot Visualization */}
            <div className="flex justify-center items-center mb-16">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg filter blur-xl"></div>
                    <MandelbrotSet />
                </div>
            </div>

            {/* Feature Cards */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Complex Patterns",
                            description: "Witness how simple mathematical rules create infinite complexity"
                        },
                        {
                            title: "Mathematical Beauty",
                            description: "Experience the convergence of art and mathematics in the Mandelbrot Set"
                        },
                        {
                            title: "Infinite Detail",
                            description: "Explore endless levels of self-similar patterns at every scale"
                        }
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-6 border border-gray-700 hover:bg-gray-800/70 transition-colors duration-300"
                        >
                            <h3 className="text-xl font-bold mb-3 text-blue-400">{feature.title}</h3>
                            <p className="text-gray-400">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Call to Action */}
            <div className="container mx-auto px-4 py-16 text-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300">
                    Begin Your Journey
                </button>
            </div>
        </div>
    );
};

export default FractalLandingPage;