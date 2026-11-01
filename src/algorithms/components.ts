import { Graph } from './graph';
import { ComponentResult } from '../types/graph';

export class ConnectedComponents {
  /**
   * Identifies connected components for undirected graphs,
   * or Strongly Connected Components (SCCs) via Tarjan's algorithm for directed graphs.
   */
  public static analyze(graph: Graph): ComponentResult {
    if (graph.getIsDirected()) {
      return ConnectedComponents.findStronglyConnectedComponents(graph);
    } else {
      return ConnectedComponents.findUndirectedComponents(graph);
    }
  }

  /**
   * Undirected Graph Connected Components via Breadth-First Traversal
   */
  public static findUndirectedComponents(graph: Graph): ComponentResult {
    const vertices = graph.getAllVertices();
    const visited = new Set<string>();
    const vertexComponentMap: Record<string, number> = {};
    const components: { id: number; vertices: string[]; label: string }[] = [];
    let componentId = 0;

    for (const v of vertices) {
      if (!visited.has(v.id)) {
        componentId++;
        const currentGroup: string[] = [];
        const queue: string[] = [v.id];
        visited.add(v.id);

        while (queue.length > 0) {
          const curr = queue.shift()!;
          currentGroup.push(curr);
          vertexComponentMap[curr] = componentId;

          const neighbors = graph.getNeighbors(curr);
          for (const edge of neighbors) {
            if (!visited.has(edge.target)) {
              visited.add(edge.target);
              queue.push(edge.target);
            }
          }
        }

        components.push({
          id: componentId,
          vertices: currentGroup,
          label: `Subnet Partition ${componentId} (${currentGroup.length} node${currentGroup.length > 1 ? 's' : ''})`,
        });
      }
    }

    return {
      isDirected: false,
      componentCount: components.length,
      components,
      vertexComponentMap,
    };
  }

  /**
   * Directed Graph Strongly Connected Components (SCC) via Tarjan's Algorithm
   * Time Complexity: O(V + E)
   */
  public static findStronglyConnectedComponents(graph: Graph): ComponentResult {
    const vertices = graph.getAllVertices();
    const indices: Record<string, number> = {};
    const lowLinks: Record<string, number> = {};
    const onStack: Record<string, boolean> = {};
    const stack: string[] = [];
    const components: { id: number; vertices: string[]; label: string }[] = [];
    const vertexComponentMap: Record<string, number> = {};

    let index = 0;
    let componentId = 0;

    const strongConnect = (u: string) => {
      indices[u] = index;
      lowLinks[u] = index;
      index++;
      stack.push(u);
      onStack[u] = true;

      const neighbors = graph.getNeighbors(u);
      for (const edge of neighbors) {
        const v = edge.target;
        if (indices[v] === undefined) {
          // Successor v has not yet been visited; recurse
          strongConnect(v);
          lowLinks[u] = Math.min(lowLinks[u], lowLinks[v]);
        } else if (onStack[v]) {
          // Successor v is on stack and hence in the current SCC
          lowLinks[u] = Math.min(lowLinks[u], indices[v]);
        }
      }

      // If u is a root node, pop the stack and generate an SCC
      if (lowLinks[u] === indices[u]) {
        componentId++;
        const sccVertices: string[] = [];
        let w: string;
        do {
          w = stack.pop()!;
          onStack[w] = false;
          sccVertices.push(w);
          vertexComponentMap[w] = componentId;
        } while (w !== u);

        components.push({
          id: componentId,
          vertices: sccVertices,
          label: `SCC ${componentId}: [${sccVertices.join(', ')}]`,
        });
      }
    };

    for (const v of vertices) {
      if (indices[v.id] === undefined) {
        strongConnect(v.id);
      }
    }

    return {
      isDirected: true,
      componentCount: components.length,
      components,
      vertexComponentMap,
    };
  }
}
