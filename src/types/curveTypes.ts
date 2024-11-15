// src/types/curves.ts

export interface Parameter {
  name: string;
  symbol: string;
  defaultValue: string;
  range: [number, number];
}

export interface Point {
  x: number;
  y: number;
}

export interface Equation {
  cartesian?: string;
  parametric?: {
    x: string;
    y: string;
  };
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface CurveInfo {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  parameters: Record<string, Parameter>;
  equations: Equation[];
  visualizationPoints?: [number, number, number][];
}

export interface CurveResponse {
  name: string;
  description: string;
  equations: Array<{
    type: string;
    expression: string;
  }>;
  parameters: Array<{
    name: string;
    symbol: string;
    defaultValue: number;
  }>;
  wolframData: any; // You might want to type this more specifically
}
