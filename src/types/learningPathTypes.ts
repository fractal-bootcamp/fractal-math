import { MathConcept, LearningPath } from './types';

export type MathematicianPath = {
  id: string;
  name: string;
  mathematician: {
    name: string;
    era: string;
    biography: string;
    keyContributions: string[];
  };
  concepts: MathConcept[];
  prerequisites: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: string; // e.g., "6 weeks"
};

export interface AlgebraicCurveConcept extends MathConcept {
  historicalContext?: {
    discovery: string;
    significance: string;
    relatedMathematicians: string[];
  };
  visualizations: {
    type: 'graph' | 'interactive' | 'animation';
    url: string;
  }[];
  practicalApplications: {
    field: string;
    description: string;
  }[];
}

export interface AlgebraicCurvePath extends LearningPath {
  pathType: 'historical' | 'modern' | 'applied';
  concepts: AlgebraicCurveConcept[];
  progression: {
    stage: string;
    objectives: string[];
    keyInsights: string[];
  }[];
  recommendedResources: {
    type: 'paper' | 'book' | 'video' | 'interactive';
    title: string;
    url: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  }[];
}
