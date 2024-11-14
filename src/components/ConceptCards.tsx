import { useState, useEffect } from "react";
// import { XMarkIcon } from "@heroicons/react/24/outline";

interface ConceptCardProps {
  conceptId: string;
  onComplete: () => void;
}

export default function ConceptCards({ conceptId }: ConceptCardProps) {
  const [curveData, setCurveData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurveData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/curves/${conceptId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCurveData(data);
      } catch (error) {
        console.error("Error fetching curve data:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (conceptId) {
      fetchCurveData();
    }
  }, [conceptId]);

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!curveData) {
    return <div className="text-white">No data available</div>;
  }

  return (
    <div className="bg-gray-900 p-6 rounded-lg max-w-2xl w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">{curveData.name}</h2>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
          <p className="text-gray-300">{curveData.description}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Examples</h3>
          <ul className="list-disc list-inside text-gray-300">
            {curveData.examples.map((example: string, index: number) => (
              <li key={index}>{example}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Properties</h3>
          <ul className="list-disc list-inside text-gray-300">
            {curveData.properties.map((property: string, index: number) => (
              <li key={index}>{property}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
