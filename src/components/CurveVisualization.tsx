"use client";

import { Mafs, Coordinates, Plot } from "mafs";
import "mafs/core.css";
import { useState, useEffect, useCallback } from "react";
import { ControlPanel } from "./ControlPanel";

// Types
interface CurveVisualizationProps {
  equation: string;
  initialParameters?: Record<string, number>;
  curveName: string;
}

// Constants
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 20;
const ZOOM_IN_FACTOR = 0.9;
const ZOOM_OUT_FACTOR = 1.1;
const DEFAULT_STEPS = 100; // default number of steps for parametric and polar rendering
const FULL_ROTATION = Math.PI * 2;

// Parameter description mapping
const PARAMETER_DESCRIPTIONS: Record<string, Record<string, string>> = {
  line: { a: "Adjust slope", b: "Move up/down" },
  parabola: { a: "Change curve width", b: "Move left/right", c: "Move up/down" },
  circle: { a: "Adjust radius" },
  "sine curve": { a: "Change height", b: "Adjust frequency", c: "Shift phase" },
};

// Evaluate a Cartesian (y = f(x)) curve
function evaluateEquation(
  curveName: string,
  params: Record<string, number>,
  x: number
) {
  const { a, b, c } = params;

  switch (curveName.toLowerCase()) {
    case "line":
      return a * x + b;

    case "circle": {
      const r = Math.abs(a);
      const term = r * r - x * x;
      return term >= 0 ? Math.sqrt(term) : NaN;
    }

    case "parabola":
      return a * x * x + b * x + c;

    case "ellipse": {
      const major = Math.abs(a);
      const minor = Math.abs(b || major);
      const term = minor * minor * (1 - (x * x) / (major * major));
      return term >= 0 ? Math.sqrt(term) : NaN;
    }

    case "hyperbola": {
      const major = Math.abs(a);
      const minor = Math.abs(b || major);
      const term = (minor * minor * x * x) / (major * major) - minor * minor;
      return term >= 0 ? Math.sqrt(term) : NaN;
    }

    case "sine curve":
      return a * Math.sin(b * x + c);

    default:
      return 0;
  }
}

// Generate points for parametric curves (like cycloid, cardioid, butterfly)
function getParametricCurvePoints(
  curveName: string,
  params: Record<string, number>,
  steps = DEFAULT_STEPS
): [number, number][] {
  const { a } = params;
  const points: [number, number][] = [];

  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * FULL_ROTATION;
    let x = 0;
    let y = 0;

    switch (curveName.toLowerCase()) {
      case "cycloid":
        x = a * (t - Math.sin(t));
        y = a * (1 - Math.cos(t));
        break;
      case "cardioid":
        x = a * (2 * Math.cos(t) - Math.cos(2 * t));
        y = a * (2 * Math.sin(t) - Math.sin(2 * t));
        break;
      case "butterfly":
        x = Math.sin(t) * (Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t));
        y = Math.cos(t) * (Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t));
        break;
      default:
        break;
    }

    points.push([x, y]);
  }

  return points;
}

// Generate points for polar curves (like lemniscate, rose, maltese cross)
function getPolarCurvePoints(
  curveName: string,
  params: Record<string, number>,
  steps = DEFAULT_STEPS
): [number, number][] {
  const { a, b } = params;
  const points: [number, number][] = [];

  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * FULL_ROTATION;
    let r = 0;

    switch (curveName.toLowerCase()) {
      case "lemniscate":
      case "maltese cross":
        r = a * Math.sqrt(Math.abs(Math.cos(2 * theta)));
        break;
      case "rose":
        r = a * Math.cos((b ?? 1) * theta);
        break;
      default:
        break;
    }

    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);
    points.push([x, y]);
  }

  return points;
}

// Check if the given curve is parametric
function isParametricCurve(curveName: string): boolean {
  return ["cycloid", "cardioid", "butterfly"].includes(curveName.toLowerCase());
}

// Check if the given curve is polar
function isPolarCurve(curveName: string): boolean {
  return ["lemniscate", "rose", "maltese cross"].includes(curveName.toLowerCase());
}

// Get parameter descriptions for the control panel
function getParameterDescriptions(
  curveName: string,
  parameters: Record<string, number>
): Record<string, string> {
  const name = curveName.toLowerCase();
  return PARAMETER_DESCRIPTIONS[name] ||
    Object.fromEntries(
      Object.keys(parameters).map((param) => [param, `Adjust ${param}`])
    );
}

export default function CurveVisualization({
  equation,
  initialParameters = { a: 1, b: 0, c: 0 },
  curveName,
}: CurveVisualizationProps) {
  const [parameters, setParameters] = useState(initialParameters);
  const [zoom, setZoom] = useState(5);

  // Handle mouse wheel zoom
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      setZoom((prevZoom) => {
        const zoomFactor = e.deltaY > 0 ? ZOOM_OUT_FACTOR : ZOOM_IN_FACTOR;
        const newZoom = prevZoom * zoomFactor;
        return Math.min(Math.max(newZoom, MIN_ZOOM), MAX_ZOOM);
      });
    },
    []
  );

  // Add wheel event listener for zoom on mount
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

  // Render a parametric curve if applicable
  function renderParametricCurve() {
    if (!isParametricCurve(curveName)) return null;
    const points = getParametricCurvePoints(curveName, parameters);
    return <Plot.Parametric xy={(t) => points[Math.floor(t * points.length)]} t={[0, 1]} />;
  }

  // Render a polar curve if applicable
  function renderPolarCurve() {
    if (!isPolarCurve(curveName)) return null;
    const points = getPolarCurvePoints(curveName, parameters);
    return <Plot.Parametric xy={(t) => points[Math.floor(t * points.length)]} t={[0, 1]} />;
  }

  // Render a standard Cartesian curve if neither parametric nor polar
  function renderCartesianCurve() {
    if (isParametricCurve(curveName) || isPolarCurve(curveName)) return null;

    const yFunc = (x: number) => evaluateEquation(curveName, parameters, x);
    const isSymmetricCurve = ["circle", "ellipse", "hyperbola"].includes(curveName.toLowerCase());

    return (
      <>
        <Plot.OfX y={yFunc} />
        {isSymmetricCurve && <Plot.OfX y={(x) => -yFunc(x)} />}
      </>
    );
  }

  return (
    <div className="relative w-full h-[800px]">
      {/* Graph Container */}
      <div id="graph-container" className="absolute inset-0 bg-white">
        <Mafs
          width={window.innerWidth}
          height={800}
          viewBox={{ x: [-zoom, zoom], y: [-zoom, zoom] }}
        >
          <Coordinates.Cartesian />
          {renderParametricCurve() || renderPolarCurve() || renderCartesianCurve()}
        </Mafs>
      </div>

      {/* Control Panel */}
      <ControlPanel
        title={`${curveName} Controls`}
        parameters={parameters}
        onParameterChange={(param, value) =>
          setParameters((prev) => ({ ...prev, [param]: value }))
        }
        parameterDescriptions={getParameterDescriptions(curveName, parameters)}
      />

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => setZoom((prev) => Math.max(prev / 1.5, MIN_ZOOM))}
          className="bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/70"
        >
          +
        </button>
        <button
          onClick={() => setZoom((prev) => Math.min(prev * 1.5, MAX_ZOOM))}
          className="bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/70"
        >
          -
        </button>
      </div>
    </div>
  );
}
