// Graph ADT and Algorithm Types for Unit IV

export type GraphEdgeType = 'tree' | 'back' | 'forward' | 'cross';

export interface GraphVertex {
  id: string;
  label: string;
  type?: 'router' | 'switch' | 'server' | 'firewall' | 'workstation' | 'gateway';
  ip?: string;
  x?: number; // Coordinates for visual rendering
  y?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
  label?: string;
  bandwidthMbps?: number;
  latencyMs?: number;
}

export interface GraphData {
  vertices: GraphVertex[];
  edges: GraphEdge[];
  isDirected: boolean;
  isWeighted: boolean;
}

export interface BFSStep {
  step: number;
  currentVertex: string;
  queue: string[];
  visited: string[];
  distances: Record<string, number>;
  parents: Record<string, string | null>;
  description: string;
}

export interface BFSResult {
  traversalOrder: string[];
  distances: Record<string, number>;
  parents: Record<string, string | null>;
  visited: string[];
  steps: BFSStep[];
  reachableCount: number;
  unreachableVertices: string[];
}

export interface DFSStep {
  step: number;
  type: 'discover' | 'finish' | 'explore_edge';
  vertex: string;
  targetVertex?: string;
  edgeType?: GraphEdgeType;
  discoveryTimes: Record<string, number>;
  finishingTimes: Record<string, number>;
  activeStack: string[];
  visited: string[];
  parents: Record<string, string | null>;
  description: string;
}

export interface ClassifiedEdge {
  edge: GraphEdge;
  type: GraphEdgeType;
  description: string;
}

export interface DFSResult {
  mode: 'recursive' | 'iterative';
  traversalOrder: string[];
  discoveryTimes: Record<string, number>;
  finishingTimes: Record<string, number>;
  parents: Record<string, string | null>;
  classifiedEdges: ClassifiedEdge[];
  steps: DFSStep[];
  hasCycle: boolean;
}

export interface DijkstraStep {
  step: number;
  currentVertex: string;
  evaluatedNeighbor?: string;
  currentDistanceTable: Record<string, number>;
  previousTable: Record<string, string | null>;
  settled: string[];
  unsettled: string[];
  edgeRelaxed?: { from: string; to: string; oldDist: number; newDist: number };
  description: string;
}

export interface DijkstraResult {
  source: string;
  destination?: string;
  distances: Record<string, number>;
  previous: Record<string, string | null>;
  shortestPath: string[];
  shortestDistance: number;
  isReachable: boolean;
  steps: DijkstraStep[];
  settledOrder: string[];
}

export interface MSTStep {
  step: number;
  edgeConsidered: GraphEdge;
  action: 'selected' | 'rejected';
  reason: string;
  currentTotalWeight: number;
  currentEdgesInMST: GraphEdge[];
}

export interface MSTResult {
  algorithm: 'prim' | 'kruskal';
  mstEdges: GraphEdge[];
  rejectedEdges: { edge: GraphEdge; reason: string }[];
  totalWeight: number;
  steps: MSTStep[];
  isConnected: boolean;
  componentCount: number;
}

export interface ComponentResult {
  isDirected: boolean;
  componentCount: number;
  components: {
    id: number;
    vertices: string[];
    label: string;
  }[];
  vertexComponentMap: Record<string, number>;
}

export interface TopologicalSortResult {
  isDAG: boolean;
  algorithm: 'kahn' | 'dfs';
  order: string[];
  cycle?: string[]; // Vertices in cycle if DAG is false
  inDegreesAtStart?: Record<string, number>;
  steps: {
    step: number;
    description: string;
    readyQueue?: string[];
    currentOrder: string[];
  }[];
}
