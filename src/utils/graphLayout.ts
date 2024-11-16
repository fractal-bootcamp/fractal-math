import { ConceptNode } from '../types/conceptTypes';

interface Point {
  x: number;
  y: number;
}

interface NodePosition extends Point {
  id: string;
}

interface Edge {
  source: string;
  target: string;
}

export function calculateGraphLayout(
  nodes: ConceptNode[],
  edges: Edge[],
  width: number,
  height: number,
  centerNodeId?: string,
  focusedNodeId?: string
): NodePosition[] {
  const positions: NodePosition[] = [];
  const centerX = width / 2;
  const centerY = height / 2;
  let radius = Math.min(width, height) * 0.4;

  // If we have a focused node, adjust the layout
  if (focusedNodeId) {
    const focusedNode = nodes.find(n => n.id === focusedNodeId);
    if (focusedNode) {
      // Position focused node in center
      positions.push({ id: focusedNodeId, x: centerX, y: centerY });

      // Get related nodes (prerequisites and sub-concepts)
      const relatedNodes = nodes.filter(n => 
        n.id !== focusedNodeId && (
          n.prerequisites.includes(focusedNodeId) ||
          focusedNode.prerequisites.includes(n.id) ||
          n.subConcepts.includes(focusedNodeId) ||
          focusedNode.subConcepts.includes(n.id)
        )
      );

      // Increase radius for sub-elements
      radius *= 1.5;

      // Position related nodes in a star pattern
      relatedNodes.forEach((node, index) => {
        const angle = (2 * Math.PI * index) / relatedNodes.length;
        const nodeRadius = radius * (node.prerequisites.includes(focusedNodeId) ? 0.8 : 1.2);
        
        positions.push({
          id: node.id,
          x: centerX + nodeRadius * Math.cos(angle),
          y: centerY + nodeRadius * Math.sin(angle)
        });
      });

      // Add sub-elements (theorems, problems) in an inner circle
      const subElements = [
        ...(focusedNode.theorems || []).map(id => ({ id, type: 'theorem' })),
        ...(focusedNode.problems || []).map(id => ({ id, type: 'problem' }))
      ];

      const innerRadius = radius * 0.5;
      subElements.forEach((element, index) => {
        const angle = (2 * Math.PI * index) / subElements.length;
        positions.push({
          id: element.id,
          x: centerX + innerRadius * Math.cos(angle),
          y: centerY + innerRadius * Math.sin(angle)
        });
      });
    }
  } else {
    // Default force-directed layout for unfocused view
    if (centerNodeId) {
      // Position center node
      const centerNode = nodes.find(n => n.id === centerNodeId);
      if (centerNode) {
        positions.push({ id: centerNodeId, x: centerX, y: centerY });

        // Get related nodes
        const relatedNodes = nodes.filter(n => 
          n.id !== centerNodeId && (
            n.prerequisites.includes(centerNodeId) ||
            centerNode.prerequisites.includes(n.id) ||
            n.subConcepts.includes(centerNodeId) ||
            centerNode.subConcepts.includes(n.id)
          )
        );

        // Position related nodes in a circle around the center
        relatedNodes.forEach((node, index) => {
          const angle = (2 * Math.PI * index) / relatedNodes.length;
          positions.push({
            id: node.id,
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
          });
        });
      }
    } else {
      // Position all nodes in a force-directed layout
      nodes.forEach((node, index) => {
        const angle = (2 * Math.PI * index) / nodes.length;
        positions.push({
          id: node.id,
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        });
      });
    }

    // Apply force-directed layout iterations
    const iterations = 50;
    const k = 0.1; // Spring constant
    const repulsion = 500; // Repulsion constant

    for (let i = 0; i < iterations; i++) {
      // Calculate forces
      positions.forEach(pos1 => {
        let fx = 0;
        let fy = 0;

        // Repulsion between all nodes
        positions.forEach(pos2 => {
          if (pos1.id !== pos2.id) {
            const dx = pos1.x - pos2.x;
            const dy = pos1.y - pos2.y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;
            fx += (repulsion / (distance * distance)) * (dx / distance);
            fy += (repulsion / (distance * distance)) * (dy / distance);
          }
        });

        // Spring forces along edges
        edges.forEach(edge => {
          if (pos1.id === edge.source || pos1.id === edge.target) {
            const other = positions.find(p => 
              p.id === (pos1.id === edge.source ? edge.target : edge.source)
            );
            if (other) {
              const dx = pos1.x - other.x;
              const dy = pos1.y - other.y;
              const distance = Math.sqrt(dx * dx + dy * dy) || 1;
              fx -= k * dx;
              fy -= k * dy;
            }
          }
        });

        // Update positions
        pos1.x += fx * 0.1;
        pos1.y += fy * 0.1;

        // Keep nodes within bounds
        pos1.x = Math.max(0, Math.min(width, pos1.x));
        pos1.y = Math.max(0, Math.min(height, pos1.y));
      });
    }
  }

  return positions;
}

// Helper function to determine if a node should be visible
export function shouldShowNode(
  node: ConceptNode,
  focusedNodeId: string | null,
  nodes: ConceptNode[]
): boolean {
  if (!focusedNodeId) return true;
  if (node.id === focusedNodeId) return true;

  const focusedNode = nodes.find(n => n.id === focusedNodeId);
  if (!focusedNode) return true;

  return (
    node.prerequisites.includes(focusedNodeId) ||
    focusedNode.prerequisites.includes(node.id) ||
    node.subConcepts.includes(focusedNodeId) ||
    focusedNode.subConcepts.includes(node.id) ||
    (focusedNode.theorems || []).includes(node.id) ||
    (focusedNode.problems || []).includes(node.id)
  );
}
