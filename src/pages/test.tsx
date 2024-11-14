"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CurveInfo, Parameter, Equation } from "@/types/curveTypes";

function formatEquation(eq: Equation[]) {
  return (
    <div>
      {eq.map((equation, index) => (
        <div key={index}>
          {equation.cartesian && (
            <div>
              <strong>Cartesian:</strong> {equation.cartesian}
            </div>
          )}
          {equation.parametric && (
            <div>
              <strong>Parametric:</strong>x = {equation.parametric.x}, y ={" "}
              {equation.parametric.y}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function formatParameters(params: Record<string, Parameter>) {
  return (
    <div className="space-y-2">
      {Object.entries(params).map(([key, value]) => {
        const param = value as Parameter;
        return (
          <div key={key}>
            <strong>{param.name}</strong> ({param.symbol}): {param.defaultValue}
            {param.range && <span> Range: [{param.range.join(" to ")}]</span>}
          </div>
        );
      })}
    </div>
  );
}

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
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Equations:</h3>
                  {formatEquation(curve.equations)}
                </div>
                <div>
                  <h3 className="font-semibold">Parameters:</h3>
                  {formatParameters(curve.parameters)}
                </div>
                <div>
                  <h3 className="font-semibold">Category:</h3>
                  <p>{curve.categoryId}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
