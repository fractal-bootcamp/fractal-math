"use client";

import ConceptFlow from "@/components/ConceptFlow";

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-black p-4">
      <h1 className="text-2xl font-bold text-white mb-4">Concept Flow</h1>
      <div className="w-full h-[600px]">
        <ConceptFlow />
      </div>
    </div>
  );
}
