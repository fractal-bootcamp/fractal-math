export interface Category {
  id: string;
  name: string;
  description: string;
  subcategories?: string[];
  curves: CurveInfo[];
}

export interface CurveInfo {
  id: string;
  name: string;
  wolframeId: string;
  description: string;
  categoryId: string;
  parameters: Parameter[];
  equations: Equation[];
}

export interface Parameter {
  name: string;
  symbol: string;
  defaultValue: string;
  range: [number, number];
}

export interface Equation {
  type: "cartesian" | "parametric" | "polar";
  expression: string;
}

// Simple response type for API
export interface CurveResponse extends CurveInfo {
  wolframData?: unknown; // This is temporary for now
}
