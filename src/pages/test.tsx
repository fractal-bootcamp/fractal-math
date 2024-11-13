import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { CurveInfo, CurveResponse } from "../types/curveTypes";

export default function TestCurves() {
  const [curves, setCurves] = useState<CurveInfo[]>([]);
  const [selectedCurve, setSelectedCurve] = useState<CurveResponse | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch a specific curve
  const fetchCurve = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/curves/${id}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setSelectedCurve(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  // When the component mounts, fetch all curves
  useEffect(() => {
    const fetchCurves = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/curves");
        const data = await response.json();
        setCurves(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchCurves();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Curve Testing Page</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      {loading && <div>Loading...</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* List of curves */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Available Curves</h2>
          <div className="space-y-4">
            {curves.map((curve) => (
              <Card
                key={curve.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => fetchCurve(curve.id)}
              >
                <CardHeader>
                  <CardTitle>{curve.name}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Selected curve details */}
        {selectedCurve && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Curve Details</h2>
            <Card>
              <CardHeader>
                <CardTitle>{selectedCurve.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Description:</h3>
                    <p>{selectedCurve.description}</p>
                  </div>

                  <div>
                    <h3 className="font-medium">Equations:</h3>
                    {selectedCurve.equations.map((eq, i) => (
                      <div key={i} className="bg-gray-50 p-2 rounded">
                        {eq.type}: {eq.expression}
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="font-medium">Parameters:</h3>
                    {selectedCurve.parameters.map((param, i) => (
                      <div key={i}>
                        {param.name} ({param.symbol}): {param.defaultValue}
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="font-medium">Wolfram Data:</h3>
                    <pre className="bg-gray-50 p-2 rounded overflow-auto">
                      {JSON.stringify(selectedCurve.wolframData, null, 2)}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
