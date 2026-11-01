import { describe, it, expect, beforeEach } from 'vitest';
import { Graph } from '../algorithms/graph';
import { BreadthFirstSearch } from '../algorithms/bfs';
import { DepthFirstSearch } from '../algorithms/dfs';
import { Dijkstra } from '../algorithms/dijkstra';
import { Prim } from '../algorithms/prim';
import { Kruskal } from '../algorithms/kruskal';
import { ConnectedComponents } from '../algorithms/components';
import { TopologicalSort } from '../algorithms/topologicalSort';

describe('Network Topology: Graph Model', () => {
  let g: Graph;

  beforeEach(() => {
    g = new Graph(false, true);
  });

  it('should add vertices and reject duplicate IDs', () => {
    g.addVertex({ id: 'A', label: 'Router A' });
    g.addVertex({ id: 'B', label: 'Router B' });
    expect(g.getAllVertices().length).toBe(2);
    expect(() => g.addVertex({ id: 'A', label: 'Duplicate' })).toThrow(/already exists/);
  });

  it('should add and remove edges properly', () => {
    g.addVertex({ id: 'A', label: 'A' });
    g.addVertex({ id: 'B', label: 'B' });
    const edge = g.addEdge({ source: 'A', target: 'B', weight: 10 });

    expect(edge.weight).toBe(10);
    expect(g.getAllEdges().length).toBe(1);

    const removed = g.removeEdge('A', 'B');
    expect(removed).toBe(true);
    expect(g.getAllEdges().length).toBe(0);
  });

  it('should generate adjacency matrix and adjacency list correctly', () => {
    g.addVertex({ id: 'A', label: 'A' });
    g.addVertex({ id: 'B', label: 'B' });
    g.addEdge({ source: 'A', target: 'B', weight: 5 });

    const matrixData = g.getAdjacencyMatrix();
    expect(matrixData.vertexOrder).toEqual(['A', 'B']);
    expect(matrixData.matrix[0][1]).toBe(5);
    expect(matrixData.matrix[1][0]).toBe(5);

    const listMap = g.getAdjacencyListMap();
    expect(listMap['A'][0].target).toBe('B');
    expect(listMap['B'][0].target).toBe('A');
  });
});

describe('Routing Traversal: Breadth-First Search (BFS)', () => {
  it('should calculate correct hop-distances and traversal order', () => {
    const g = new Graph(false, true);
    ['A', 'B', 'C', 'D'].forEach((id) => g.addVertex({ id, label: id }));
    g.addEdge({ source: 'A', target: 'B', weight: 1 });
    g.addEdge({ source: 'A', target: 'C', weight: 1 });
    g.addEdge({ source: 'B', target: 'D', weight: 1 });

    const res = BreadthFirstSearch.traverse(g, 'A');
    expect(res.traversalOrder[0]).toBe('A');
    expect(res.distances['A']).toBe(0);
    expect(res.distances['B']).toBe(1);
    expect(res.distances['C']).toBe(1);
    expect(res.distances['D']).toBe(2);
  });

  it('should handle disconnected vertices gracefully', () => {
    const g = new Graph(false, true);
    ['A', 'B', 'Disconnected'].forEach((id) => g.addVertex({ id, label: id }));
    g.addEdge({ source: 'A', target: 'B', weight: 1 });

    const res = BreadthFirstSearch.traverse(g, 'A');
    expect(res.unreachableVertices).toContain('Disconnected');
    expect(res.distances['Disconnected']).toBe(Infinity);
  });
});

describe('Network Exploration: Depth-First Search (DFS)', () => {
  it('should execute recursive DFS and compute timestamps', () => {
    const g = new Graph(true, true);
    ['A', 'B', 'C'].forEach((id) => g.addVertex({ id, label: id }));
    g.addEdge({ source: 'A', target: 'B', weight: 1 });
    g.addEdge({ source: 'B', target: 'C', weight: 1 });

    const res = DepthFirstSearch.traverseRecursive(g, 'A');
    expect(res.traversalOrder).toEqual(['A', 'B', 'C']);
    expect(res.discoveryTimes['A']).toBeLessThan(res.discoveryTimes['B']);
    expect(res.finishingTimes['C']).toBeLessThan(res.finishingTimes['B']);
    expect(res.finishingTimes['B']).toBeLessThan(res.finishingTimes['A']);
  });

  it('should detect cycles and classify back edges in directed graph', () => {
    const g = new Graph(true, true);
    ['A', 'B', 'C'].forEach((id) => g.addVertex({ id, label: id }));
    g.addEdge({ source: 'A', target: 'B', weight: 1 });
    g.addEdge({ source: 'B', target: 'C', weight: 1 });
    g.addEdge({ source: 'C', target: 'A', weight: 1 }); // Directed cycle

    const res = DepthFirstSearch.traverseRecursive(g, 'A');
    expect(res.hasCycle).toBe(true);
    expect(res.classifiedEdges.some((e) => e.type === 'back')).toBe(true);
  });

  it('should execute iterative DFS correctly', () => {
    const g = new Graph(false, true);
    ['A', 'B', 'C'].forEach((id) => g.addVertex({ id, label: id }));
    g.addEdge({ source: 'A', target: 'B', weight: 1 });
    g.addEdge({ source: 'B', target: 'C', weight: 1 });

    const res = DepthFirstSearch.traverseIterative(g, 'A');
    expect(res.traversalOrder.length).toBe(3);
    expect(res.mode).toBe('iterative');
  });
});

describe('Shortest Path Routing: Dijkstra Algorithm', () => {
  it('should calculate shortest paths accurately', () => {
    const g = new Graph(false, true);
    ['A', 'B', 'C', 'D'].forEach((id) => g.addVertex({ id, label: id }));
    g.addEdge({ source: 'A', target: 'B', weight: 1 });
    g.addEdge({ source: 'B', target: 'D', weight: 1 });
    g.addEdge({ source: 'A', target: 'C', weight: 5 });
    g.addEdge({ source: 'C', target: 'D', weight: 1 });

    const res = Dijkstra.compute(g, 'A', 'D');
    expect(res.shortestDistance).toBe(2);
    expect(res.shortestPath).toEqual(['A', 'B', 'D']);
  });

  it('should reject negative edge weights', () => {
    const g = new Graph(false, true);
    ['A', 'B'].forEach((id) => g.addVertex({ id, label: id }));
    g.addEdge({ source: 'A', target: 'B', weight: -5 });

    expect(() => Dijkstra.compute(g, 'A', 'B')).toThrow(/Negative edge weight/);
  });

  it('should handle identical source and destination', () => {
    const g = new Graph(false, true);
    ['A', 'B'].forEach((id) => g.addVertex({ id, label: id }));
    g.addEdge({ source: 'A', target: 'B', weight: 3 });

    const res = Dijkstra.compute(g, 'A', 'A');
    expect(res.shortestDistance).toBe(0);
    expect(res.shortestPath).toEqual(['A']);
  });

  it('should report unreachable destination cleanly', () => {
    const g = new Graph(false, true);
    ['A', 'B', 'Island'].forEach((id) => g.addVertex({ id, label: id }));
    g.addEdge({ source: 'A', target: 'B', weight: 2 });

    const res = Dijkstra.compute(g, 'A', 'Island');
    expect(res.isReachable).toBe(false);
    expect(res.shortestDistance).toBe(Infinity);
    expect(res.shortestPath).toEqual([]);
  });
});

describe('Cabling Optimization: Minimum Spanning Tree (Prim & Kruskal)', () => {
  it('should produce identical MST total weight for Prim and Kruskal', () => {
    const g = new Graph(false, true);
    ['A', 'B', 'C', 'D', 'E'].forEach((id) => g.addVertex({ id, label: id }));

    g.addEdge({ source: 'A', target: 'B', weight: 4 });
    g.addEdge({ source: 'A', target: 'C', weight: 2 });
    g.addEdge({ source: 'B', target: 'C', weight: 1 });
    g.addEdge({ source: 'B', target: 'D', weight: 5 });
    g.addEdge({ source: 'C', target: 'D', weight: 8 });
    g.addEdge({ source: 'C', target: 'E', weight: 10 });
    g.addEdge({ source: 'D', target: 'E', weight: 2 });

    const primRes = Prim.compute(g, 'A');
    const kruskalRes = Kruskal.compute(g);

    expect(primRes.totalWeight).toBe(kruskalRes.totalWeight);
    expect(primRes.mstEdges.length).toBe(4); // V - 1 edges
    expect(kruskalRes.mstEdges.length).toBe(4);
    expect(kruskalRes.rejectedEdges.length).toBeGreaterThan(0);
  });
});

describe('Network Partitioning: Connected Components & SCC', () => {
  it('should identify undirected connected components', () => {
    const g = new Graph(false, true);
    ['A', 'B', 'C', 'X', 'Y'].forEach((id) => g.addVertex({ id, label: id }));
    g.addEdge({ source: 'A', target: 'B', weight: 1 });
    g.addEdge({ source: 'B', target: 'C', weight: 1 });
    g.addEdge({ source: 'X', target: 'Y', weight: 1 });

    const res = ConnectedComponents.findUndirectedComponents(g);
    expect(res.componentCount).toBe(2);
    expect(res.vertexComponentMap['A']).toBe(res.vertexComponentMap['C']);
    expect(res.vertexComponentMap['X']).toBe(res.vertexComponentMap['Y']);
    expect(res.vertexComponentMap['A']).not.toBe(res.vertexComponentMap['X']);
  });

  it('should identify Strongly Connected Components via Tarjan', () => {
    const g = new Graph(true, true);
    ['A', 'B', 'C', 'D'].forEach((id) => g.addVertex({ id, label: id }));
    // SCC 1: A -> B -> C -> A
    g.addEdge({ source: 'A', target: 'B', weight: 1 });
    g.addEdge({ source: 'B', target: 'C', weight: 1 });
    g.addEdge({ source: 'C', target: 'A', weight: 1 });
    // D is separate sink
    g.addEdge({ source: 'C', target: 'D', weight: 1 });

    const res = ConnectedComponents.findStronglyConnectedComponents(g);
    expect(res.componentCount).toBe(2);
  });
});

describe('Service Dependency Pipeline: Topological Sorting & Cycle Detection', () => {
  it('should sort DAG with Kahn and DFS and verify edge ordering', () => {
    const dag = Graph.createSampleDAG();

    const kahnRes = TopologicalSort.kahn(dag);
    expect(kahnRes.isDAG).toBe(true);
    expect(TopologicalSort.verifyTopologicalOrder(dag, kahnRes.order)).toBe(true);

    const dfsRes = TopologicalSort.dfsBased(dag);
    expect(dfsRes.isDAG).toBe(true);
    expect(TopologicalSort.verifyTopologicalOrder(dag, dfsRes.order)).toBe(true);
  });

  it('should detect cycles and report impossible topological ordering', () => {
    const cyclicGraph = Graph.createSampleCyclicGraph();

    const kahnRes = TopologicalSort.kahn(cyclicGraph);
    expect(kahnRes.isDAG).toBe(false);
    expect(kahnRes.cycle?.length).toBeGreaterThan(0);

    const dfsRes = TopologicalSort.dfsBased(cyclicGraph);
    expect(dfsRes.isDAG).toBe(false);
  });
});
