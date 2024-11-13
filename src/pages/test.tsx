"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CurveInfo, CurveResponse } from "@/types/curveTypes";

export default function TestCurves() {
  const [curves, setCurves] = useState<CurveInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCurves();
  }, []);

  const fetchCurves = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/curves");
      if (!response.ok) throw new Error("Failed to fetch curves");
      const data = await response.json();
      console.log("Fetched curves:", data); // Debug log
      setCurves(data);
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch curves");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!curves.length) return <div>No curves found</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Mathematical Curves</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {curves.map((curve) => (
          <Card key={curve.id} className="cursor-pointer hover:shadow-lg">
            <CardHeader>
              <CardTitle>{curve.name}</CardTitle>
              <p className="text-sm text-gray-600">{curve.description}</p>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-gray-50 p-2 rounded">
                {JSON.stringify(curve, null, 2)}
              </pre>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
