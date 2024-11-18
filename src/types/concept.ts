export type ConceptElementType = 'concept' | 'theorem' | 'problem';

export interface ConceptElement {
  id: string;
  type: ConceptElementType;
  name: string;
  description?: string;
  parentConceptId?: string;
  isPrerequisite?: boolean;
  difficulty?: 'basic' | 'intermediate' | 'advanced';
  status?: 'locked' | 'available' | 'completed';
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface ConceptRelation {
  source: string;
  target: string;
  type: 'prerequisite' | 'component' | 'related';
  strength?: number;
}

export interface ConceptGraphData {
  nodes: ConceptElement[];
  edges: ConceptRelation[];
}

// Color schemes for different node types and states
export const CONCEPT_COLORS = {
  concept: {
    default: '#4CAF50',
    active: '#2196F3',
    prerequisite: '#FFC107',
    locked: '#9E9E9E',
  },
  theorem: {
    default: '#7E57C2',
    active: '#5E35B1',
    prerequisite: '#B39DDB',
  },
  problem: {
    default: '#F44336',
    active: '#D32F2F',
    prerequisite: '#FFCDD2',
  },
} as const;

export const EDGE_COLORS = {
  prerequisite: '#FFC107',
  component: '#2196F3',
  related: '#9E9E9E',
} as const;

// Mock data for testing
export const MOCK_CONCEPT_DATA: ConceptGraphData = {
  nodes: [
    {
      id: 'quadratic',
      type: 'concept',
      name: 'Quadratic Functions',
      description: 'Understanding quadratic equations and their graphs',
      status: 'available',
    },
    {
      id: 'vertex-form',
      type: 'theorem',
      name: 'Vertex Form',
      parentConceptId: 'quadratic',
      description: 'Converting quadratic equations to vertex form',
    },
    {
      id: 'completing-square',
      type: 'problem',
      name: 'Completing the Square',
      parentConceptId: 'quadratic',
      description: 'Practice completing the square method',
    },
    {
      id: 'linear',
      type: 'concept',
      name: 'Linear Functions',
      status: 'completed',
      isPrerequisite: true,
    },
  ],
  edges: [
    {
      source: 'linear',
      target: 'quadratic',
      type: 'prerequisite',
      strength: 1,
    },
    {
      source: 'quadratic',
      target: 'vertex-form',
      type: 'component',
      strength: 0.7,
    },
    {
      source: 'vertex-form',
      target: 'completing-square',
      type: 'component',
      strength: 0.5,
    },
  ],
};
