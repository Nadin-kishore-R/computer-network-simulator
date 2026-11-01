import { Graph } from './graph';
import { TopologicalSortResult } from '../types/graph';

export class TopologicalSort {
  /**
   * Kahn's Algorithm (In-degree BFS)
   */
  public static kahn(graph: Graph): TopologicalSortResult {
    const vertices = graph.getAllVertices();
    const vertexIds = vertices.map((v) => v.id);

    if (vertices.length === 0) {
      return {
        isDAG: true,
        algorithm: 'kahn',
        order: [],
        steps: [],
      };
    }

    // 1. Calculate in-degrees
    const inDegrees: Record<string, number> = {};
    for (const v of vertexIds) {
      inDegrees[v] = 0;
    }

    const edges = graph.getAllEdges();
    for (const edge of edges) {
      inDegrees[edge.target] = (inDegrees[edge.target] || 0) + 1;
    }

    const inDegreesAtStart = { ...inDegrees };

    // 2. Initialize Queue with all vertices having in-degree 0
    const queue: string[] = [];
    for (const v of vertexIds) {
      if (inDegrees[v] === 0) {
        queue.push(v);
      }
    }

    const order: string[] = [];
    const steps: { step: number; description: string; readyQueue?: string[]; currentOrder: string[] }[] = [];
    let stepCount = 0;

    steps.push({
      step: ++stepCount,
      description: `Computed in-degrees. Enqueued vertices with 0 in-degree: [${queue.join(', ')}].`,
      readyQueue: [...queue],
      currentOrder: [],
    });

    // 3. Process queue
    while (queue.length > 0) {
      const u = queue.shift()!;
      order.push(u);

      const neighbors = graph.getNeighbors(u);
      for (const edge of neighbors) {
        const v = edge.target;
        inDegrees[v]--;
        if (inDegrees[v] === 0) {
          queue.push(v);
        }
      }

      steps.push({
        step: ++stepCount,
        description: `Dispatched service "${u}" to topological sequence. Decremented dependency counts for neighbors. Ready queue: [${queue.join(', ')}].`,
        readyQueue: [...queue],
        currentOrder: [...order],
      });
    }

    // 4. Cycle Detection: If order length < total vertices, a cycle prevented resolution
    if (order.length < vertexIds.length) {
      const cycleCandidates = vertexIds.filter((v) => !order.includes(v));
      return {
        isDAG: false,
        algorithm: 'kahn',
        order: [],
        cycle: cycleCandidates,
        inDegreesAtStart,
        steps,
      };
    }

    return {
      isDAG: true,
      algorithm: 'kahn',
      order,
      inDegreesAtStart,
      steps,
    };
  }

  /**
   * DFS-based Topological Sort (Reverse Postorder of Finishing Times)
   */
  public static dfsBased(graph: Graph): TopologicalSortResult {
    const vertices = graph.getAllVertices();
    const color: Record<string, 'white' | 'gray' | 'black'> = {};
    const reversedOrder: string[] = [];
    let cycleFound = false;
    let cycleVertices: string[] = [];

    for (const v of vertices) {
      color[v.id] = 'white';
    }

    const currentPath: string[] = [];

    const dfs = (u: string) => {
      color[u] = 'gray';
      currentPath.push(u);

      const neighbors = graph.getNeighbors(u);
      for (const edge of neighbors) {
        const v = edge.target;
        if (color[v] === 'gray') {
          cycleFound = true;
          const cycleStartIdx = currentPath.indexOf(v);
          cycleVertices = currentPath.slice(cycleStartIdx);
          return;
        }
        if (color[v] === 'white') {
          dfs(v);
          if (cycleFound) return;
        }
      }

      color[u] = 'black';
      currentPath.pop();
      reversedOrder.unshift(u); // Insert at head to achieve reverse postorder
    };

    for (const v of vertices) {
      if (color[v.id] === 'white') {
        dfs(v.id);
        if (cycleFound) break;
      }
    }

    if (cycleFound) {
      return {
        isDAG: false,
        algorithm: 'dfs',
        order: [],
        cycle: cycleVertices,
        steps: [
          {
            step: 1,
            description: `Directed cycle detected via back-edge into [${cycleVertices.join(' -> ')}]. Topological sorting impossible.`,
            currentOrder: [],
          },
        ],
      };
    }

    return {
      isDAG: true,
      algorithm: 'dfs',
      order: reversedOrder,
      steps: [
        {
          step: 1,
          description: `Completed DFS reverse-postorder traversal. Valid topological order: [${reversedOrder.join(' -> ')}].`,
          currentOrder: reversedOrder,
        },
      ],
    };
  }

  /**
   * Formally verify that every directed edge (u -> v) has u appearing before v in topological order
   */
  public static verifyTopologicalOrder(graph: Graph, order: string[]): boolean {
    if (!graph.getIsDirected()) return false;
    const indexMap = new Map<string, number>();
    order.forEach((id, idx) => indexMap.set(id, idx));

    const edges = graph.getAllEdges();
    for (const edge of edges) {
      const uIdx = indexMap.get(edge.source);
      const vIdx = indexMap.get(edge.target);
      if (uIdx === undefined || vIdx === undefined || uIdx >= vIdx) {
        return false;
      }
    }
    return true;
  }
}
