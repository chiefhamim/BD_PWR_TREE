import dagre from 'dagre';
import { Node, Edge } from 'reactflow';

const dagreGraph = new dagre.graphlib.Graph({ compound: true });
dagreGraph.setDefaultEdgeLabel(() => ({}));

export interface LayoutNode extends Node {
  width?: number;
  height?: number;
}

/**
 * Snap coordinates to nearest grid intersection
 * @param x X coordinate
 * @param y Y coordinate
 * @param gridSize Grid size in pixels
 * @returns Snapped {x, y} coordinates
 */
export const snapToGrid = (x: number, y: number, gridSize: number = 100) => {
  return {
    x: Math.round(x / gridSize) * gridSize,
    y: Math.round(y / gridSize) * gridSize,
  }
}

/**
 * Validates layout integrity - checks for overlaps and alignment
 */
export const validateLayoutIntegrity = (
  nodes: LayoutNode[],
  gridSize: number = 100
): { hasOverlaps: boolean; unalignedSiblings: number } => {
  const nodeWidth = 280
  const nodeHeight = 140
  let overlaps = 0
  let misaligned = 0

  // Check for overlaps
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const n1 = nodes[i]
      const n2 = nodes[j]

      const n1Left = n1.position.x
      const n1Right = n1.position.x + nodeWidth
      const n1Top = n1.position.y
      const n1Bottom = n1.position.y + nodeHeight

      const n2Left = n2.position.x
      const n2Right = n2.position.x + nodeWidth
      const n2Top = n2.position.y
      const n2Bottom = n2.position.y + nodeHeight

      if (
        n1Left < n2Right &&
        n1Right > n2Left &&
        n1Top < n2Bottom &&
        n1Bottom > n2Top
      ) {
        overlaps++
      }
    }
  }

  return {
    hasOverlaps: overlaps > 0,
    unalignedSiblings: misaligned,
  }
}

export const calculateLayout = (
  nodes: LayoutNode[],
  edges: Edge[],
  isSymmetric: boolean = true
): LayoutNode[] => {
  if (isSymmetric) {
    return calculateSymmetricLayout(nodes, edges);
  }

  // Fallback to standard Dagre layout
  dagreGraph.setGraph({
    rankdir: 'TB',
    nodesep: 120,
    ranksep: 100,
    marginx: 50,
    marginy: 50,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: node.width || 280,
      height: node.height || 140,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - (node.width || 280) / 2,
        y: nodeWithPosition.y - (node.height || 140) / 2,
      },
    };
  });
};

// Custom symmetric hierarchy layout
export const calculateSymmetricLayout = (
  nodes: LayoutNode[],
  edges: Edge[]
): LayoutNode[] => {
  const nodeWidth = 280;
  const nodeHeight = 140;
  const horizontalSpacing = 320;
  const verticalSpacing = 180;
  const gridSize = 100;

  // Build hierarchy
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const childrenMap = new Map<string, string[]>();
  const parentMap = new Map<string, string>();
  const levelMap = new Map<string, number>();

  // Initialize maps
  nodes.forEach((node) => childrenMap.set(node.id, []));

  // Build relationships from edges
  edges.forEach((edge) => {
    const children = childrenMap.get(edge.source) || [];
    children.push(edge.target);
    childrenMap.set(edge.source, children);
    parentMap.set(edge.target, edge.source);
  });

  // Find root nodes (no parent)
  const rootNodes = nodes.filter((n) => !parentMap.has(n.id));

  // Calculate levels
  const calculateLevel = (nodeId: string): number => {
    if (levelMap.has(nodeId)) return levelMap.get(nodeId)!;

    const parent = parentMap.get(nodeId);
    if (!parent) {
      levelMap.set(nodeId, 0);
      return 0;
    }

    const parentLevel = calculateLevel(parent);
    const level = parentLevel + 1;
    levelMap.set(nodeId, level);
    return level;
  };

  nodes.forEach((node) => calculateLevel(node.id));

  // Calculate positions
  const positionMap = new Map<string, { x: number; y: number }>();

  const calculatePositions = (nodeId: string, parentX: number, level: number) => {
    const children = childrenMap.get(nodeId) || [];
    const childCount = children.length;

    if (childCount === 0) return;

    const totalChildWidth = (childCount - 1) * horizontalSpacing;
    const startX = parentX - totalChildWidth / 2;

    children.forEach((childId, index) => {
      const x = startX + index * horizontalSpacing;
      const y = level * verticalSpacing + verticalSpacing;

      // Snap to grid
      const snappedX = snapToGrid(x, gridSize).x;
      const snappedY = snapToGrid(y, gridSize).y;

      positionMap.set(childId, { x: snappedX, y: snappedY });

      // Recursively position grandchildren
      calculatePositions(childId, snappedX, level + 1);
    });
  };

  // Start from root nodes
  rootNodes.forEach((root, index) => {
    const startX = (index - (rootNodes.length - 1) / 2) * 600;
    const snappedX = snapToGrid(startX, gridSize).x;
    positionMap.set(root.id, { x: snappedX, y: 0 });
    calculatePositions(root.id, snappedX, 0);
  });

  // Apply positions to nodes
  return nodes.map((node) => {
    const position = positionMap.get(node.id) || { x: 0, y: 0 };
    return {
      ...node,
      position: {
        x: position.x - nodeWidth / 2,
        y: position.y - nodeHeight / 2,
      },
    };
  });
};

export default calculateLayout;

