import { Graph } from './graph';
import { DFSResult, DFSStep, ClassifiedEdge, GraphEdgeType } from '../types/graph';

export class DepthFirstSearch {
  /**
   * Recursive DFS with timestamps, edge classification, and step tracking
   */
  public static traverseRecursive(graph: Graph, startVertexId?: string): DFSResult {
    const vertices = graph.getAllVertices();
    const isDirected = graph.getIsDirected();

    const traversalOrder: string[] = [];
    const discoveryTimes: Record<string, number> = {};
    const finishingTimes: Record<string, number> = {};
    const parents: Record<string, string | null> = {};
    const color: Record<string, 'white' | 'gray' | 'black'> = {};
    const classifiedEdges: ClassifiedEdge[] = [];
    const steps: DFSStep[] = [];

    for (const v of vertices) {
      color[v.id] = 'white';
      parents[v.id] = null;
      discoveryTimes[v.id] = 0;
      finishingTimes[v.id] = 0;
    }

    let time = 0;
    let stepCount = 0;
    let hasCycle = false;
    const activeStack: string[] = [];

    const dfsVisit = (u: string) => {
      time++;
      discoveryTimes[u] = time;
      color[u] = 'gray';
      activeStack.push(u);
      traversalOrder.push(u);

      steps.push({
        step: ++stepCount,
        type: 'discover',
        vertex: u,
        discoveryTimes: { ...discoveryTimes },
        finishingTimes: { ...finishingTimes },
        activeStack: [...activeStack],
        visited: Array.from(Object.keys(color)).filter((k) => color[k] !== 'white'),
        parents: { ...parents },
        description: `Discovered vertex "${u}" at timestamp t=${time}. Marked gray (in progress).`,
      });

      const neighbors = graph.getNeighbors(u);
      for (const edge of neighbors) {
        const v = edge.target;

        // Skip the immediate parent edge in an undirected graph
        if (!isDirected && parents[u] === v) {
          continue;
        }

        if (color[v] === 'white') {
          // Tree Edge
          parents[v] = u;
          classifiedEdges.push({
            edge: { id: edge.edgeId, source: u, target: v, weight: edge.weight },
            type: 'tree',
            description: `Tree Edge (${u} -> ${v}): Explores unvisited vertex "${v}".`,
          });

          steps.push({
            step: ++stepCount,
            type: 'explore_edge',
            vertex: u,
            targetVertex: v,
            edgeType: 'tree',
            discoveryTimes: { ...discoveryTimes },
            finishingTimes: { ...finishingTimes },
            activeStack: [...activeStack],
            visited: Array.from(Object.keys(color)).filter((k) => color[k] !== 'white'),
            parents: { ...parents },
            description: `Tree Edge (${u} -> ${v}): Advancing DFS into unvisited neighbor "${v}".`,
          });

          dfsVisit(v);
        } else if (color[v] === 'gray') {
          // Back Edge (forms cycle)
          hasCycle = true;
          classifiedEdges.push({
            edge: { id: edge.edgeId, source: u, target: v, weight: edge.weight },
            type: 'back',
            description: `Back Edge (${u} -> ${v}): Connects to active ancestor "${v}". Cycle detected!`,
          });

          steps.push({
            step: ++stepCount,
            type: 'explore_edge',
            vertex: u,
            targetVertex: v,
            edgeType: 'back',
            discoveryTimes: { ...discoveryTimes },
            finishingTimes: { ...finishingTimes },
            activeStack: [...activeStack],
            visited: Array.from(Object.keys(color)).filter((k) => color[k] !== 'white'),
            parents: { ...parents },
            description: `Back Edge (${u} -> ${v}): Points to ancestor "${v}" currently on the stack. Cycle detected!`,
          });
        } else if (color[v] === 'black') {
          if (isDirected) {
            if (discoveryTimes[u] < discoveryTimes[v]) {
              // Forward Edge
              classifiedEdges.push({
                edge: { id: edge.edgeId, source: u, target: v, weight: edge.weight },
                type: 'forward',
                description: `Forward Edge (${u} -> ${v}): Connects to finished descendant "${v}".`,
              });
            } else {
              // Cross Edge
              classifiedEdges.push({
                edge: { id: edge.edgeId, source: u, target: v, weight: edge.weight },
                type: 'cross',
                description: `Cross Edge (${u} -> ${v}): Connects between independent branches/components.`,
              });
            }
          }
        }
      }

      time++;
      finishingTimes[u] = time;
      color[u] = 'black';
      activeStack.pop();

      steps.push({
        step: ++stepCount,
        type: 'finish',
        vertex: u,
        discoveryTimes: { ...discoveryTimes },
        finishingTimes: { ...finishingTimes },
        activeStack: [...activeStack],
        visited: Array.from(Object.keys(color)).filter((k) => color[k] !== 'white'),
        parents: { ...parents },
        description: `Finished vertex "${u}" at timestamp t=${time}. Marked black (completed).`,
      });
    };

    // If start vertex specified, visit it first
    if (startVertexId && color[startVertexId] === 'white') {
      dfsVisit(startVertexId);
    }

    // Traverse all remaining vertices to guarantee complete coverage of disconnected graphs
    for (const v of vertices) {
      if (color[v.id] === 'white') {
        dfsVisit(v.id);
      }
    }

    return {
      mode: 'recursive',
      traversalOrder,
      discoveryTimes,
      finishingTimes,
      parents,
      classifiedEdges,
      steps,
      hasCycle,
    };
  }

  /**
   * Iterative DFS using an explicit LIFO call stack
   */
  public static traverseIterative(graph: Graph, startVertexId?: string): DFSResult {
    const vertices = graph.getAllVertices();
    const isDirected = graph.getIsDirected();

    const traversalOrder: string[] = [];
    const discoveryTimes: Record<string, number> = {};
    const finishingTimes: Record<string, number> = {};
    const parents: Record<string, string | null> = {};
    const visited = new Set<string>();
    const finished = new Set<string>();
    const classifiedEdges: ClassifiedEdge[] = [];
    const steps: DFSStep[] = [];

    for (const v of vertices) {
      parents[v.id] = null;
      discoveryTimes[v.id] = 0;
      finishingTimes[v.id] = 0;
    }

    let time = 0;
    let stepCount = 0;
    let hasCycle = false;

    // Stack holds { vertexId, neighborIndex }
    const vertexOrder = startVertexId
      ? [startVertexId, ...vertices.map((v) => v.id).filter((id) => id !== startVertexId)]
      : vertices.map((v) => v.id);

    for (const rootId of vertexOrder) {
      if (visited.has(rootId)) continue;

      const stack: { u: string; nextNeighborIdx: number }[] = [];
      visited.add(rootId);
      time++;
      discoveryTimes[rootId] = time;
      traversalOrder.push(rootId);
      stack.push({ u: rootId, nextNeighborIdx: 0 });

      steps.push({
        step: ++stepCount,
        type: 'discover',
        vertex: rootId,
        discoveryTimes: { ...discoveryTimes },
        finishingTimes: { ...finishingTimes },
        activeStack: stack.map((s) => s.u),
        visited: Array.from(visited),
        parents: { ...parents },
        description: `[Iterative DFS] Pushed and discovered "${rootId}" at t=${time}.`,
      });

      while (stack.length > 0) {
        const top = stack[stack.length - 1];
        const u = top.u;
        const neighbors = graph.getNeighbors(u);

        if (top.nextNeighborIdx < neighbors.length) {
          const edge = neighbors[top.nextNeighborIdx];
          top.nextNeighborIdx++;
          const v = edge.target;

          if (!isDirected && parents[u] === v) {
            continue;
          }

          if (!visited.has(v)) {
            visited.add(v);
            parents[v] = u;
            time++;
            discoveryTimes[v] = time;
            traversalOrder.push(v);

            classifiedEdges.push({
              edge: { id: edge.edgeId, source: u, target: v, weight: edge.weight },
              type: 'tree',
              description: `Tree Edge (${u} -> ${v})`,
            });

            stack.push({ u: v, nextNeighborIdx: 0 });

            steps.push({
              step: ++stepCount,
              type: 'discover',
              vertex: v,
              discoveryTimes: { ...discoveryTimes },
              finishingTimes: { ...finishingTimes },
              activeStack: stack.map((s) => s.u),
              visited: Array.from(visited),
              parents: { ...parents },
              description: `[Iterative DFS] Explored Tree Edge to "${v}". Discovered at t=${time}.`,
            });
          } else if (!finished.has(v)) {
            hasCycle = true;
            classifiedEdges.push({
              edge: { id: edge.edgeId, source: u, target: v, weight: edge.weight },
              type: 'back',
              description: `Back Edge (${u} -> ${v}): Cycle detected.`,
            });
          }
        } else {
          // All neighbors of u explored
          stack.pop();
          time++;
          finishingTimes[u] = time;
          finished.add(u);

          steps.push({
            step: ++stepCount,
            type: 'finish',
            vertex: u,
            discoveryTimes: { ...discoveryTimes },
            finishingTimes: { ...finishingTimes },
            activeStack: stack.map((s) => s.u),
            visited: Array.from(visited),
            parents: { ...parents },
            description: `[Iterative DFS] Popped "${u}". Finished at t=${time}.`,
          });
        }
      }
    }

    return {
      mode: 'iterative',
      traversalOrder,
      discoveryTimes,
      finishingTimes,
      parents,
      classifiedEdges,
      steps,
      hasCycle,
    };
  }
}
