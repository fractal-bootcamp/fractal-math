// types.d.ts
export interface MathConcept {
  id: string;
  name: string;
  wolframId: string;
  description: string;
  latexFormula: string;
  difficulty: DifficultyLevel;
  prerequisites: string[]; // Array of concept IDs
  childConcepts: string[]; // Array of concept IDs
  visualRepresentation: {
    x: number;
    y: number;
    radius: number;
    level: number;
  };
}

export interface UserProgress {
  id: string;
  userId: string;
  conceptId: string;
  status: LearningStatus;
  confidence: number;
  lastAccessed: Date;
  completedExercises: number;
  codeSnippets: CodeSnippet[];
}

export interface CodeSnippet {
  id: string;
  userId: string;
  conceptId: string;
  title: string;
  code: string;
  language: 'typescript';
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export interface LearningPath {
  id: string;
  userId: string;
  name: string;
  concepts: string[]; // Array of concept IDs in learning order
  currentConceptId: string;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum DifficultyLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT'
}

export enum LearningStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  MASTERED = 'MASTERED'
}

export interface User {
  id: string;
  email: string;
  name: string;
  skillLevel: DifficultyLevel;
  learningPaths: LearningPath[];
  progress: UserProgress[];
  codeSnippets: CodeSnippet[];
  createdAt: Date;
  updatedAt: Date;
}