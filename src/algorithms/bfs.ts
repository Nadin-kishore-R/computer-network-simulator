import { Graph } from './graph';
import { BFSResult, BFSStep } from '../types/graph';

export class BreadthFirstSearch {
  /**
   * Run BFS from a specified starting vertex
   */
  public static traverse(graph: Graph, startVertexId: string): BFSResult {
    const vertices = graph.getAllVertices();
    const vertexIds = vertices.map((v) => v.id);

    if (!vertexIds.includes(startVertexId)) {
      throw new Error(`Start vertex "${startVertexId}" does not exist in graph.`);
    }

    const traversalOrder: string[] = [];
    const distances: Record<string, number> = {};
    const parents: Record<string, string | null> = {};
    const visitedSet = new Set<string>();
    const steps: BFSStep[] = [];

    // Initialize all distances to Infinity, parents to null
    for (const v of vertexIds) {
      distances[v] = Infinity;
      parents[v] = null;
    }

    const queue: string[] = [];
    distances[startVertexId] = 0;
    visitedSet.add(startVertexId);
    queue.push(startVertexId);

    let stepCount = 0;
    steps.push({
      step: ++stepCount,
      currentVertex: startVertexId,
      queue: [...queue],
      visited: Array.from(visitedSet),
      distances: { ...distances },
      parents: { ...parents },
      description: `Initialized BFS at root vertex "${startVertexId}". Distance set to 0. Enqueued "${startVertexId}".`,
    });

    while (queue.length > 0) {
      const u = queue.shift()!;
      traversalOrder.push(u);

      const neighbors = graph.getNeighbors(u);

      for (const edge of neighbors) {
        const v = edge.target;
        if (!visitedSet.has(v)) {
          visitedSet.add(v);
          distances[v] = distances[u] + 1; // 1 hop
          parents[v] = u;
          queue.push(v);

          steps.push({
            step: ++stepCount,
            currentVertex: u,
            queue: [...queue],
            visited: Array.from(visitedSet),
            distances: { ...distances },
            parents: { ...parents },
            description: `From "${u}", visited unvisited neighbor "${v}". Hop distance: ${distances[v]}, parent set to "${u}".`,
          });
        }
      }
    }

    const unreachable = vertexIds.filter((v) => !visitedSet.has(v));

    return {
      traversalOrder,
      distances,
      parents,
      visited: Array.from(visitedSet),
      steps,
      reachableCount: visitedSet.size,
      unreachableVertices: unreachable,
    };
  }

  /**
   * Full multi-component BFS covering all disconnected sub-networks
   */
  public static traverseAll(graph: Graph): {
    components: BFSResult[];
    fullTraversalOrder: string[];
  } {
    const vertices = graph.getAllVertices();
    const visitedGlobal = new Set<string>();
    const results: BFSResult[] = [];
    const fullOrder: string[] = [];

    for (const v of vertices) {
      if (!visitedGlobal.has(v.id)) {
        const componentResult = BreadthFirstSearch.traverse(graph, v.id);
        componentResult.traversalOrder.forEach((id) => {
          visitedGlobal.add(id);
          fullOrder.push(id);
        });
        results.push(componentResult);
      }
    }

    return { components: results, fullTraversalOrder: fullOrder };
  }
}
