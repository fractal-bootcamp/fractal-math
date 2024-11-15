"use client";

import { Mafs, Coordinates, Plot, Theme, useStopwatch } from "mafs";
import "mafs/core.css";
import { useState, useEffect, useCallback } from "react";
import { ControlPanel } from "./ControlPanel";

interface CurveVisualizationProps {
  equation: string;
  initialParameters?: Record<string, number>;
  curveName: string;
}

export default function CurveVisualization({
  equation,
  initialParameters = { a: 1, b: 0, c: 0 },
  curveName,
}: CurveVisualizationProps) {
  const [parameters, setParameters] = useState(initialParameters);
  const [zoom, setZoom] = useState(5);
  const minZoom = 0.1;
  const maxZoom = 20;

  // Handle mouse wheel zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    setZoom((prevZoom) => {
      const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
      const newZoom = prevZoom * zoomFactor;
      return Math.min(Math.max(newZoom, minZoom), maxZoom);
    });
  }, []);

  // Add wheel event listener
  useEffect(() => {
    const graphElement = document.getElementById("graph-container");
    if (graphElement) {
      graphElement.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (graphElement) {
        graphElement.removeEventListener("wheel", handleWheel);
      }
    };
  }, [handleWheel]);

  // Helper function for parametric curves
  const generateParametricPoints = (
    xFunc: (t: number) => number,
    yFunc: (t: number) => number,
    tStart: number,
    tEnd: number,
    steps: number
  ) => {
    const points: [number, number][] = [];
    for (let i = 0; i <= steps; i++) {
      const t = tStart + (i / steps) * (tEnd - tStart);
      points.push([xFunc(t), yFunc(t)]);
    }
    return points;
  };

  const evaluateEquation = (x: number) => {
    switch (curveName.toLowerCase()) {
      case "line":
        return parameters.a * x + parameters.b;

      case "circle":
        const r = Math.abs(parameters.a);
        const term = r * r - x * x;
        return term >= 0 ? Math.sqrt(term) : NaN;

      case "parabola":
        return parameters.a * x * x + parameters.b * x + parameters.c;

      case "ellipse":
        const a = Math.abs(parameters.a);
        const b = Math.abs(parameters.b || a);
        const termE = b * b * (1 - (x * x) / (a * a));
        return termE >= 0 ? Math.sqrt(termE) : NaN;

      case "hyperbola":
        const aH = Math.abs(parameters.a);
        const bH = Math.abs(parameters.b || aH);
        const termH = (bH * bH * x * x) / (aH * aH) - bH * bH;
        return termH >= 0 ? Math.sqrt(termH) : NaN;

      case "sine curve":
        return parameters.a * Math.sin(parameters.b * x + parameters.c);

      default:
        return 0;
    }
  };

  // Add parametric curve handling
  const renderParametricCurve = () => {
    if (
      !["cycloid", "cardioid", "butterfly"].includes(curveName.toLowerCase())
    ) {
      return null;
    }

    const points: [number, number][] = [];
    const numPoints = 100;

    for (let i = 0; i <= numPoints; i++) {
      const t = (i / numPoints) * Math.PI * 2;
      let x, y;

      switch (curveName.toLowerCase()) {
        case "cycloid":
          x = parameters.a * (t - Math.sin(t));
          y = parameters.a * (1 - Math.cos(t));
          break;

        case "cardioid":
          x = parameters.a * (2 * Math.cos(t) - Math.cos(2 * t));
          y = parameters.a * (2 * Math.sin(t) - Math.sin(2 * t));
          break;

        case "butterfly":
          x = Math.sin(t) * (Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t));
          y = Math.cos(t) * (Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t));
          break;

        default:
          x = 0;
          y = 0;
      }
      points.push([x, y]);
    }

    return (
      <Plot.Parametric
        xy={(t) => points[Math.floor(t * points.length)]}
        t={[0, 1]}
      />
    );
  };

  // Add polar curve handling
  const renderPolarCurve = () => {
    if (
      !["lemniscate", "rose", "maltese cross"].includes(curveName.toLowerCase())
    ) {
      return null;
    }

    const points: [number, number][] = [];
    const numPoints = 100;

    for (let i = 0; i <= numPoints; i++) {
      const theta = (i / numPoints) * Math.PI * 2;
      let r;

      switch (curveName.toLowerCase()) {
        case "lemniscate":
          r = parameters.a * Math.sqrt(Math.abs(Math.cos(2 * theta)));
          break;

        case "rose":
          r = parameters.a * Math.cos(parameters.b * theta);
          break;

        case "maltese cross":
          r = parameters.a * Math.sqrt(Math.abs(Math.cos(2 * theta)));
          break;

        default:
          r = 0;
      }

      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      points.push([x, y]);
    }

    return (
      <Plot.Parametric
        xy={(t) => points[Math.floor(t * points.length)]}
        t={[0, 1]}
      />
    );
  };

  const getParameterDescriptions = () => {
    switch (curveName.toLowerCase()) {
      case "line":
        return {
          a: "Adjust slope",
          b: "Move up/down",
        };
      case "parabola":
        return {
          a: "Change curve width",
          b: "Move left/right",
          c: "Move up/down",
        };
      case "circle":
        return {
          a: "Adjust radius",
        };
      case "sine curve":
        return {
          a: "Change height",
          b: "Adjust frequency",
          c: "Shift phase",
        };
      // Add more descriptions for other curves
      default:
        return Object.fromEntries(
          Object.keys(parameters).map((param) => [param, `Adjust ${param}`])
        );
    }
  };

  return (
    <div className="relative w-full h-screen">
      <div id="graph-container" className="absolute inset-0 bg-white">
        <Mafs
          width={window.innerWidth}
          height={window.innerHeight}
          viewBox={{ x: [-zoom, zoom], y: [-zoom, zoom] }}
        >
          <Coordinates.Cartesian />
          {renderParametricCurve() || renderPolarCurve() || (
            <>
              <Plot.OfX y={evaluateEquation} />
              {["circle", "ellipse", "hyperbola"].includes(
                curveName.toLowerCase()
              ) && <Plot.OfX y={(x) => -evaluateEquation(x)} />}
            </>
          )}
        </Mafs>
      </div>

      <ControlPanel
        title={`${curveName} Controls`}
        parameters={parameters}
        onParameterChange={(param, value) =>
          setParameters((prev) => ({ ...prev, [param]: value }))
        }
        parameterDescriptions={getParameterDescriptions()}
      />

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => setZoom((prev) => Math.max(prev / 1.5, minZoom))}
          className="bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/70"
        >
          +
        </button>
        <button
          onClick={() => setZoom((prev) => Math.min(prev * 1.5, maxZoom))}
          className="bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/70"
        >
          -
        </button>
      </div>
    </div>
  );
}
