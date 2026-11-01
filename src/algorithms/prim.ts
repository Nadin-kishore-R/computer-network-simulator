import { Graph } from './graph';
import { GraphEdge, MSTResult, MSTStep } from '../types/graph';

export interface PrimEdgeCandidate {
  source: string;
  target: string;
  weight: number;
  edgeId: string;
}

export class Prim {
  public static compute(graph: Graph, startVertexId?: string): MSTResult {
    const vertices = graph.getAllVertices();
    const vertexIds = vertices.map((v) => v.id);

    if (vertices.length === 0) {
      return {
        algorithm: 'prim',
        mstEdges: [],
        rejectedEdges: [],
        totalWeight: 0,
        steps: [],
        isConnected: true,
        componentCount: 0,
      };
    }

    const start = startVertexId && vertexIds.includes(startVertexId) ? startVertexId : vertexIds[0];

    const inMST = new Set<string>();
    const mstEdges: GraphEdge[] = [];
    const steps: MSTStep[] = [];
    let totalWeight = 0;
    let stepCount = 0;

    // Start with the initial vertex
    inMST.add(start);

    // Continue until all reachable vertices are included or no cut-crossing edges remain
    while (inMST.size < vertices.length) {
      let minEdge: PrimEdgeCandidate | null = null;

      // Find the minimum weight edge with one endpoint in inMST and one outside
      for (const u of inMST) {
        const neighbors = graph.getNeighbors(u);
        for (const edge of neighbors) {
          const v = edge.target;
          if (!inMST.has(v)) {
            if (minEdge === null || edge.weight < minEdge.weight) {
              minEdge = {
                source: u,
                target: v,
                weight: edge.weight,
                edgeId: edge.edgeId,
              };
            }
          }
        }
      }

      // If no crossing edge found, the remaining graph is disconnected from start
      if (minEdge === null) {
        break;
      }

      // Add minimum edge to MST
      inMST.add(minEdge.target);
      const edgeObj: GraphEdge = {
        id: minEdge.edgeId,
        source: minEdge.source,
        target: minEdge.target,
        weight: minEdge.weight,
      };
      mstEdges.push(edgeObj);
      totalWeight += minEdge.weight;

      steps.push({
        step: ++stepCount,
        edgeConsidered: edgeObj,
        action: 'selected',
        reason: `Selected cut edge (${minEdge.source} -> ${minEdge.target}, wt: ${minEdge.weight}). Added new vertex "${minEdge.target}" to Spanning Tree.`,
        currentTotalWeight: totalWeight,
        currentEdgesInMST: [...mstEdges],
      });
    }

    const isConnected = mstEdges.length === vertices.length - 1;

    return {
      algorithm: 'prim',
      mstEdges,
      rejectedEdges: [], // Prim never considers cycle edges across the cut
      totalWeight,
      steps,
      isConnected,
      componentCount: isConnected ? 1 : vertices.length - mstEdges.length,
    };
  }
}
