"use client";
import { useEffect, useState, use } from "react";
import { CurveVisualization } from "../../../components/CurveVisualization";

interface Curve {
  id: string;
  name: string;
  equation: string | null;
  imageUrl: string | null;
  animationData: any | null;
}

export default function CurvePage({ params }: { params: { id: string } }) {
  const id = use(params).id;
  const [curve, setCurve] = useState<Curve | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCurve() {
      try {
        console.log("Fetching curve with ID:", id); // Debug log
        const response = await fetch(`/api/curves/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Received data:", data); // Debug log
        setCurve(data);
      } catch (err) {
        console.error("Error fetching curve:", err); // Debug log
        setError(err instanceof Error ? err.message : "Failed to fetch curve");
      } finally {
        setLoading(false);
      }
    }

    fetchCurve();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!curve) return <div>No curve found with ID: {id}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{curve.name}</h1>
      {curve.equation && (
        <CurveVisualization
          name={curve.name}
          equation={curve.equation}
          imageUrl={curve.imageUrl || ""}
          animationData={curve.animationData}
        />
      )}
      <pre className="mt-4 p-2 bg-gray-100 rounded">
        {JSON.stringify(curve, null, 2)}
      </pre>
    </div>
  );
}
