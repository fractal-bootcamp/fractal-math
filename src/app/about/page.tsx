"use client";

import Link from "next/link";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            About Us
          </h1>
        </div>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">
              Our Mission
            </h2>
            <p className="text-gray-300 mb-6">
              We make complex mathematical concepts accessible and beautiful
              through interactive visualizations. Our platform helps users
              explore the fascinating world of fractals and geometric patterns.
            </p>

            <h2 className="text-2xl font-bold mb-4 text-blue-400">
              Our Vision
            </h2>
            <p className="text-gray-300">
              We believe in making mathematical beauty accessible to everyone,
              inspiring the next generation of mathematicians and artists
              through interactive exploration.
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 inline-block"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
