import { Graph } from './graph';
import { DisjointSetUnion } from './dsu';
import { GraphEdge, MSTResult, MSTStep } from '../types/graph';

export class Kruskal {
  public static compute(graph: Graph): MSTResult {
    const vertices = graph.getAllVertices();
    const vertexIds = vertices.map((v) => v.id);

    if (vertices.length === 0) {
      return {
        algorithm: 'kruskal',
        mstEdges: [],
        rejectedEdges: [],
        totalWeight: 0,
        steps: [],
        isConnected: true,
        componentCount: 0,
      };
    }

    // Deduplicate edges for undirected graph
    const rawEdges = graph.getAllEdges();
    const uniqueEdgesMap = new Map<string, GraphEdge>();

    for (const e of rawEdges) {
      const key = graph.getIsDirected()
        ? `${e.source}->${e.target}`
        : [e.source, e.target].sort().join('--');

      if (!uniqueEdgesMap.has(key)) {
        uniqueEdgesMap.set(key, e);
      }
    }

    // 1. Sort all unique edges in non-decreasing order of weight
    const sortedEdges = Array.from(uniqueEdgesMap.values()).sort((a, b) => a.weight - b.weight);

    // 2. Initialize DSU
    const dsu = new DisjointSetUnion(vertexIds);
    const mstEdges: GraphEdge[] = [];
    const rejectedEdges: { edge: GraphEdge; reason: string }[] = [];
    const steps: MSTStep[] = [];
    let totalWeight = 0;
    let stepCount = 0;

    // 3. Greedily process each edge
    for (const edge of sortedEdges) {
      const rootU = dsu.find(edge.source);
      const rootV = dsu.find(edge.target);

      if (rootU !== rootV) {
        // Safe to include without creating cycle
        dsu.union(edge.source, edge.target);
        mstEdges.push(edge);
        totalWeight += edge.weight;

        steps.push({
          step: ++stepCount,
          edgeConsidered: edge,
          action: 'selected',
          reason: `Selected edge (${edge.source} - ${edge.target}, wt: ${edge.weight}). Vertices were in distinct components (${rootU} ≠ ${rootV}). Union performed.`,
          currentTotalWeight: totalWeight,
          currentEdgesInMST: [...mstEdges],
        });

        // Optimization: If tree has (V - 1) edges, MST is complete for connected component
        if (mstEdges.length === vertices.length - 1) {
          break;
        }
      } else {
        // Cycle-forming edge rejected!
        const reason = `Rejected edge (${edge.source} - ${edge.target}, wt: ${edge.weight}). Both vertices already belong to component "${rootU}". Adding would create a cycle.`;
        rejectedEdges.push({ edge, reason });

        steps.push({
          step: ++stepCount,
          edgeConsidered: edge,
          action: 'rejected',
          reason,
          currentTotalWeight: totalWeight,
          currentEdgesInMST: [...mstEdges],
        });
      }
    }

    // Check connectivity: A connected graph has exactly (V - 1) edges in its MST
    const isConnected = mstEdges.length === vertices.length - 1;
    const componentCount = dsu.getCount();

    return {
      algorithm: 'kruskal',
      mstEdges,
      rejectedEdges,
      totalWeight,
      steps,
      isConnected,
      componentCount,
    };
  }
}
