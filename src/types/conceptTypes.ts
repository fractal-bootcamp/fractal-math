export interface ConceptNode {
  id: string;
  name: string;
  type: 'concept' | 'theorem' | 'problem';
  prerequisites: string[];
  subConcepts: string[];
  description: string;
  equation?: string;
  theorems?: string[];
  problems?: string[];
  parameters?: {
    name: string;
    default: number;
    min?: number;
    max?: number;
    step?: number;
  }[];
  color?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  resources?: {
    type: 'video' | 'article' | 'interactive';
    url: string;
    title: string;
  }[];
  visualizationType?: 'curve' | 'parametric' | 'polar';
  domain?: [number, number];
  range?: [number, number];
}

export interface Edge {
  source: string;
  target: string;
  type: 'prerequisite' | 'subconcept' | 'related';
  strength?: number;
}

export interface GraphData {
  nodes: ConceptNode[];
  edges: Edge[];
}

export interface VisualizationState {
  activeNodeId: string | null;
  viewType: 'graph' | 'visualization';
  parameters: Record<string, number>;
  zoom: number;
}
