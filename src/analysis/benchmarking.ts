import { BinarySearchTree } from '../trees/bst';
import { AVLTree } from '../trees/avl';
import { Graph } from '../algorithms/graph';
import { BreadthFirstSearch } from '../algorithms/bfs';
import { DepthFirstSearch } from '../algorithms/dfs';
import { Dijkstra } from '../algorithms/dijkstra';
import { Prim } from '../algorithms/prim';
import { Kruskal } from '../algorithms/kruskal';

export interface BenchmarkResult {
  algorithm: string;
  category: 'Tree' | 'Graph';
  inputSize: number;
  timeMs: number;
  operationsCount?: number;
  theoreticalComplexity: string;
  details?: string;
}

/**
 * Deterministic Pseudo-Random Number Generator (LCG)
 * Guarantees identical random datasets for reproducible benchmarks.
 */
export class SeededRandom {
  private seed: number;

  constructor(seed = 1337) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }

  public next(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }

  public nextInt(min: number, max: number): number {
    return Math.floor(min + this.next() * (max - min + 1));
  }

  public shuffle<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}

export class BenchmarkRunner {
  /**
   * Run benchmark on Hierarchical Directories (BST vs AVL)
   */
  public static benchmarkTrees(size: number, seed = 42): BenchmarkResult[] {
    const rng = new SeededRandom(seed);
    const results: BenchmarkResult[] = [];

    // Generate random distinct keys
    const keysSet = new Set<number>();
    while (keysSet.size < size) {
      keysSet.add(rng.nextInt(1, size * 10));
    }
    const randomKeys = Array.from(keysSet);
    const sortedKeys = [...randomKeys].sort((a, b) => a - b);
    const searchKeys = randomKeys.slice(0, Math.min(500, size));

    // 1. BST with Random Keys
    {
      const bst = new BinarySearchTree();
      const start = performance.now();
      for (let i = 0; i < randomKeys.length; i++) {
        const k = randomKeys[i];
        bst.insert({
          key: k,
          id: `dev-${k}`,
          name: `Dev ${k}`,
          ip: `10.0.${Math.floor(k / 256)}.${k % 256}`,
          deviceType: 'workstation',
          status: 'online',
        });
      }
      for (const k of searchKeys) {
        bst.search(k);
      }
      const end = performance.now();
      results.push({
        algorithm: 'BST (Random Insertion)',
        category: 'Tree',
        inputSize: size,
        timeMs: Math.round((end - start) * 100) / 100,
        operationsCount: size + searchKeys.length,
        theoreticalComplexity: 'O(log n) avg, O(n) worst',
        details: `Height achieved: ${bst.calculateHeight()}`,
      });
    }

    // 2. AVL with Random Keys
    {
      const avl = new AVLTree();
      const start = performance.now();
      for (let i = 0; i < randomKeys.length; i++) {
        const k = randomKeys[i];
        avl.insert({
          key: k,
          id: `dev-${k}`,
          name: `Dev ${k}`,
          ip: `10.0.${Math.floor(k / 256)}.${k % 256}`,
          deviceType: 'workstation',
          status: 'online',
        });
      }
      for (const k of searchKeys) {
        avl.search(k);
      }
      const end = performance.now();
      results.push({
        algorithm: 'AVL (Random Insertion)',
        category: 'Tree',
        inputSize: size,
        timeMs: Math.round((end - start) * 100) / 100,
        operationsCount: size + searchKeys.length,
        theoreticalComplexity: 'O(log n) guaranteed',
        details: `Height achieved: ${avl.getHeight(avl.getRoot())}`,
      });
    }

    // 3. AVL with Sorted Keys (Worst Case for BST, perfectly handled by AVL)
    // Only run on moderate size to prevent call-stack overflow on BST
    if (size <= 5000) {
      const avlSorted = new AVLTree();
      const start = performance.now();
      for (let i = 0; i < sortedKeys.length; i++) {
        const k = sortedKeys[i];
        avlSorted.insert({
          key: k,
          id: `dev-${k}`,
          name: `Dev ${k}`,
          ip: `10.0.${Math.floor(k / 256)}.${k % 256}`,
          deviceType: 'workstation',
          status: 'online',
        });
      }
      for (const k of searchKeys) {
        avlSorted.search(k);
      }
      const end = performance.now();
      results.push({
        algorithm: 'AVL (Sorted Insertion - Auto Balanced)',
        category: 'Tree',
        inputSize: size,
        timeMs: Math.round((end - start) * 100) / 100,
        operationsCount: size + searchKeys.length,
        theoreticalComplexity: 'O(log n) guaranteed',
        details: `Height achieved: ${avlSorted.getHeight(avlSorted.getRoot())} (log₂(${size}) ≈ ${Math.ceil(Math.log2(size))})`,
      });
    }

    return results;
  }

  /**
   * Run benchmark on Graph Algorithms (BFS, DFS, Dijkstra, Prim, Kruskal)
   */
  public static benchmarkGraphs(verticesCount: number, seed = 99): BenchmarkResult[] {
    const rng = new SeededRandom(seed);
    const results: BenchmarkResult[] = [];

    // Construct random connected network topology
    const graph = new Graph(false, true);

    for (let i = 0; i < verticesCount; i++) {
      graph.addVertex({
        id: `V${i}`,
        label: `Node V${i}`,
        type: i % 5 === 0 ? 'router' : 'switch',
      });
    }

    // Create spanning backbone to guarantee connectivity
    for (let i = 0; i < verticesCount - 1; i++) {
      graph.addEdge({
        source: `V${i}`,
        target: `V${i + 1}`,
        weight: rng.nextInt(1, 20),
      });
    }

    // Add extra random edges for density (avg degree ~4)
    const extraEdges = Math.min(verticesCount * 2, 5000);
    for (let e = 0; e < extraEdges; e++) {
      const u = `V${rng.nextInt(0, verticesCount - 1)}`;
      const v = `V${rng.nextInt(0, verticesCount - 1)}`;
      if (u !== v) {
        try {
          graph.addEdge({
            source: u,
            target: v,
            weight: rng.nextInt(1, 50),
          });
        } catch {
          // Ignore parallel edge collision
        }
      }
    }

    const totalEdges = graph.getAllEdges().length;
    const startVertex = 'V0';
    const targetVertex = `V${verticesCount - 1}`;

    // 1. BFS Benchmark
    {
      const start = performance.now();
      const bfsRes = BreadthFirstSearch.traverse(graph, startVertex);
      const end = performance.now();
      results.push({
        algorithm: 'Breadth-First Search (BFS)',
        category: 'Graph',
        inputSize: verticesCount,
        timeMs: Math.round((end - start) * 100) / 100,
        operationsCount: bfsRes.visited.length,
        theoreticalComplexity: 'O(V + E)',
        details: `Visited ${bfsRes.visited.length} vertices across ${totalEdges} links`,
      });
    }

    // 2. DFS Recursive Benchmark
    {
      const start = performance.now();
      const dfsRes = DepthFirstSearch.traverseRecursive(graph, startVertex);
      const end = performance.now();
      results.push({
        algorithm: 'Depth-First Search (Recursive)',
        category: 'Graph',
        inputSize: verticesCount,
        timeMs: Math.round((end - start) * 100) / 100,
        operationsCount: dfsRes.traversalOrder.length,
        theoreticalComplexity: 'O(V + E)',
        details: `Discovered all ${dfsRes.traversalOrder.length} vertices`,
      });
    }

    // 3. Dijkstra Shortest Path Benchmark
    {
      const start = performance.now();
      const dijkstraRes = Dijkstra.compute(graph, startVertex, targetVertex);
      const end = performance.now();
      results.push({
        algorithm: 'Dijkstra Shortest Path',
        category: 'Graph',
        inputSize: verticesCount,
        timeMs: Math.round((end - start) * 100) / 100,
        operationsCount: dijkstraRes.settledOrder.length,
        theoreticalComplexity: 'O((V + E) log V)',
        details: `Shortest cost to target: ${dijkstraRes.shortestDistance}`,
      });
    }

    // 4. Prim MST Benchmark
    {
      const start = performance.now();
      const primRes = Prim.compute(graph, startVertex);
      const end = performance.now();
      results.push({
        algorithm: 'Prim Minimum Spanning Tree',
        category: 'Graph',
        inputSize: verticesCount,
        timeMs: Math.round((end - start) * 100) / 100,
        operationsCount: primRes.mstEdges.length,
        theoreticalComplexity: 'O(E log V)',
        details: `MST edges: ${primRes.mstEdges.length}, Total weight: ${primRes.totalWeight}`,
      });
    }

    // 5. Kruskal MST Benchmark
    {
      const start = performance.now();
      const kruskalRes = Kruskal.compute(graph);
      const end = performance.now();
      results.push({
        algorithm: 'Kruskal Minimum Spanning Tree',
        category: 'Graph',
        inputSize: verticesCount,
        timeMs: Math.round((end - start) * 100) / 100,
        operationsCount: kruskalRes.mstEdges.length,
        theoreticalComplexity: 'O(E log E) / O(E α(V))',
        details: `MST edges: ${kruskalRes.mstEdges.length}, Total weight: ${kruskalRes.totalWeight}`,
      });
    }

    return results;
  }
}
