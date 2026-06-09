import dagre from 'dagre';
import { Node, Edge } from 'reactflow';

const dagreGraph = new dagre.graphlib.Graph({ compound: true });
dagreGraph.setDefaultEdgeLabel(() => ({}));

export interface LayoutNode extends Node {
  width?: number;
  height?: number;
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

// Custom symmetric pyramid layout
const calculateSymmetricLayout = (
  nodes: LayoutNode[],
  edges: Edge[]
): LayoutNode[] => {
  const nodeWidth = 280;
  const nodeHeight = 140;
  const horizontalSpacing = 320;
  const verticalSpacing = 180;

  // Build hierarchy
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const childrenMap = new Map<string, string[]>();
  const parentMap = new Map<string, string>();
  const levelMap = new Map<string, number>();

  // Initialize maps
  nodes.forEach((node) => childrenMap.set(node.id, []));

  // Build relationships
  edges.forEach((edge) => {
    const children = childrenMap.get(edge.source) || [];
    children.push(edge.target);
    childrenMap.set(edge.source, children);
    parentMap.set(edge.target, edge.source);
  });

  // Find root node (no parent)
  let rootId = '';
  for (const node of nodes) {
    if (!parentMap.has(node.id)) {
      rootId = node.id;
      break;
    }
  }

  // Calculate levels and positions
  const levelOffsets = new Map<number, number>();

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

  // Calculate all levels
  nodes.forEach((node) => calculateLevel(node.id));

  // Count nodes at each level
  const levelCounts = new Map<number, number>();
  levelMap.forEach((level) => {
    levelCounts.set(level, (levelCounts.get(level) || 0) + 1);
  });

  // Calculate positions
  const positionMap = new Map<string, { x: number; y: number }>();

  const calculatePositions = (nodeId: string, parentX: number, level: number) => {
    const children = childrenMap.get(nodeId) || [];
    const childCount = children.length;

    // Center children horizontally around parent
    const totalChildWidth = (childCount - 1) * horizontalSpacing;
    const startX = parentX - totalChildWidth / 2;

    children.forEach((childId, index) => {
      const x = startX + index * horizontalSpacing;
      const y = level * verticalSpacing + verticalSpacing;

      positionMap.set(childId, { x, y });

      // Recursively position grandchildren
      calculatePositions(childId, x, level + 1);
    });
  };

  // Start positioning from root
  positionMap.set(rootId, { x: 0, y: 0 });
  calculatePositions(rootId, 0, 0);

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

export { calculateSymmetricLayout };
export default calculateLayout;
