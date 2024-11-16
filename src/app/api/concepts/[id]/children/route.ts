import { NextResponse } from 'next/server';

// Mock data structure for concepts and their relationships
const conceptsData = {
  'algebra': {
    children: [
      {
        id: 'linear-equations',
        name: 'Linear Equations',
        type: 'concept',
        description: 'Equations that form straight lines when graphed',
        prerequisites: ['algebra'],
        subConcepts: ['slope', 'y-intercept']
      },
      {
        id: 'quadratic-equations',
        name: 'Quadratic Equations',
        type: 'concept',
        description: 'Equations that form parabolas when graphed',
        prerequisites: ['algebra'],
        subConcepts: ['vertex', 'roots']
      }
    ]
  },
  'calculus': {
    children: [
      {
        id: 'derivatives',
        name: 'Derivatives',
        type: 'concept',
        description: 'Rate of change of a function',
        prerequisites: ['calculus'],
        subConcepts: ['power-rule', 'chain-rule']
      },
      {
        id: 'integrals',
        name: 'Integrals',
        type: 'concept',
        description: 'Area under a curve',
        prerequisites: ['calculus'],
        subConcepts: ['definite-integral', 'indefinite-integral']
      }
    ]
  },
  // Add more concept relationships as needed
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const conceptId = params.id;
    const concept = conceptsData[conceptId];

    if (!concept) {
      // If concept not found, return empty children array
      return NextResponse.json([]);
    }

    return NextResponse.json(concept.children);
  } catch (error) {
    console.error('Error fetching concept children:', error);
    return NextResponse.json({ error: 'Failed to fetch concept children' }, { status: 500 });
  }
}
