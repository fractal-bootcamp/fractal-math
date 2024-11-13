// src/data/curves.ts
import { CurveInfo } from "../types/curveTypes";

export const circle: CurveInfo = {
  id: "circle",
  name: "Circle",
  description: "A set of points equidistant from a center point",
  categoryId: "conic-sections",
  parameters: {
    radius: {
      name: "radius",
      symbol: "r",
      defaultValue: "1",
      range: [0.1, 10],
    },
  },
  equations: [
    {
      type: "cartesian",
      expression: "x² + y² = r²",
    },
  ],
};
