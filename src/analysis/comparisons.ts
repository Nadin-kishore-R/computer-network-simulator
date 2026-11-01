import { Graph } from '../algorithms/graph';
import { BreadthFirstSearch } from '../algorithms/bfs';
import { Dijkstra } from '../algorithms/dijkstra';
import { Prim } from '../algorithms/prim';
import { Kruskal } from '../algorithms/kruskal';
import { BinarySearchTree } from '../trees/bst';
import { AVLTree } from '../trees/avl';

export interface ComparisonItem {
  attribute: string;
  itemA: string;
  itemB: string;
  explanation: string;
}

export interface ComparisonData {
  title: string;
  subtitle: string;
  subjectA: string;
  subjectB: string;
  summary: string;
  table: ComparisonItem[];
}

export class AlgorithmComparisons {
  /**
   * BFS vs Dijkstra Comparative Analysis
   */
  public static getBFSvsDijkstra(): ComparisonData {
    return {
      title: 'Breadth-First Search (BFS) vs. Dijkstra\'s Algorithm',
      subtitle: 'Minimum Hop Count Routing vs. Minimum Latency / Cost Path Routing',
      subjectA: 'Breadth-First Search (BFS)',
      subjectB: 'Dijkstra\'s Shortest Path',
      summary:
        'BFS treats all communication links as having equal cost (1 hop), finding the path with the fewest network intermediate devices. Dijkstra incorporates link weights (latency, link congestion, or cost), finding the path with the lowest cumulative metric even if it traverses more intermediate hops.',
      table: [
        {
          attribute: 'Primary Purpose',
          itemA: 'Shortest path in unweighted networks (minimum hop count).',
          itemB: 'Shortest path in non-negative weighted networks (minimum total cost/delay).',
          explanation: 'BFS optimizes purely for hop count; Dijkstra optimizes for cumulative link metric.',
        },
        {
          attribute: 'Input Constraints',
          itemA: 'Unweighted graphs (or graphs with uniform edge weights).',
          itemB: 'Non-negative weighted graphs (w(e) ≥ 0).',
          explanation: 'Negative weights violate Dijkstra\'s greedy choice property.',
        },
        {
          attribute: 'Working Principle',
          itemA: 'Level-by-level exploration using FIFO Queue.',
          itemB: 'Greedy frontier exploration using Min-Priority Queue (Binary Heap).',
          explanation: 'BFS enqueues neighbors in arrival order; Dijkstra pulls the globally closest unvisited node.',
        },
        {
          attribute: 'Time Complexity',
          itemA: 'O(V + E)',
          itemB: 'O((V + E) log V) with Binary Heap; O(V² + E) with naive array.',
          explanation: 'Dijkstra incurs priority queue rebalancing overhead for each edge relaxation.',
        },
        {
          attribute: 'Space Complexity',
          itemA: 'O(V) for FIFO queue, visited set, and parent pointers.',
          itemB: 'O(V) for Min-Heap, distance table, and previous pointers.',
          explanation: 'Both algorithms store state proportional to vertex count.',
        },
        {
          attribute: 'Output',
          itemA: 'Fewest-hop path and distance measured in number of edges.',
          itemB: 'Minimum-cost path and exact cumulative numerical metric.',
          explanation: 'In weighted topologies, the fewest-hop path may have significantly higher latency than a multi-hop fiber route.',
        },
        {
          attribute: 'Networking Applications',
          itemA: 'Broadcast storms, spanning tree discovery, subnet flooding, hop-limited traceroute.',
          itemB: 'OSPF (Open Shortest Path First), IS-IS routing, QoS traffic engineering, link-state routing.',
          explanation: 'Enterprise routing protocols use link metrics rather than raw hop counts.',
        },
      ],
    };
  }

  /**
   * Generates a concrete network example where BFS (min-hop) chooses a different route
   * than Dijkstra (min-weight/min-latency).
   *
   * Network:
   * Client -> Gateway: Direct 1-hop link, but congested / slow satellite link (weight 100).
   * Client -> Router1 (weight 10) -> Router2 (weight 10) -> Gateway (weight 10): 3 hops, but total weight 30.
   */
  public static createDivergentRouteNetwork(): {
    graph: Graph;
    bfsPath: string[];
    bfsCost: number;
    dijkstraPath: string[];
    dijkstraCost: number;
    explanation: string;
  } {
    const g = new Graph(false, true);

    g.addVertex({ id: 'Client', label: 'Client Workstation', x: 100, y: 200 });
    g.addVertex({ id: 'Gateway', label: 'Cloud Gateway', x: 600, y: 200 });
    g.addVertex({ id: 'Router-1', label: 'Fiber Router 1', x: 300, y: 100 });
    g.addVertex({ id: 'Router-2', label: 'Fiber Router 2', x: 450, y: 100 });

    // High latency direct satellite link (1 hop, weight 100)
    g.addEdge({ source: 'Client', target: 'Gateway', weight: 100, label: 'Satellite Link (100ms)' });

    // High speed multi-hop fiber link (3 hops, total weight 30)
    g.addEdge({ source: 'Client', target: 'Router-1', weight: 10, label: '10G Fiber (10ms)' });
    g.addEdge({ source: 'Router-1', target: 'Router-2', weight: 10, label: '10G Fiber (10ms)' });
    g.addEdge({ source: 'Router-2', target: 'Gateway', weight: 10, label: '10G Fiber (10ms)' });

    const bfs = BreadthFirstSearch.traverse(g, 'Client');
    const dijkstra = Dijkstra.compute(g, 'Client', 'Gateway');

    // Reconstruct BFS path from parents
    const bfsPath: string[] = [];
    let curr: string | null = 'Gateway';
    while (curr !== null) {
      bfsPath.unshift(curr);
      curr = bfs.parents[curr];
    }

    // Calculate actual cost of BFS path
    let bfsCost = 0;
    for (let i = 0; i < bfsPath.length - 1; i++) {
      const u = bfsPath[i];
      const v = bfsPath[i + 1];
      const edge = g.getAllEdges().find(
        (e) => (e.source === u && e.target === v) || (e.source === v && e.target === u)
      );
      if (edge) bfsCost += edge.weight;
    }

    return {
      graph: g,
      bfsPath,
      bfsCost,
      dijkstraPath: dijkstra.shortestPath,
      dijkstraCost: dijkstra.shortestDistance,
      explanation: `BFS selected the direct 1-hop path [${bfsPath.join(' -> ')}] with cumulative latency of ${bfsCost}ms because it minimizes hops. In contrast, Dijkstra selected the 3-hop high-speed path [${dijkstra.shortestPath.join(' -> ')}] with cumulative latency of only ${dijkstra.shortestDistance}ms. This clearly demonstrates why link-state routing protocols like OSPF rely on Dijkstra rather than unweighted BFS.`,
    };
  }

  /**
   * Prim vs Kruskal Comparative Analysis
   */
  public static getPrimVsKruskal(): ComparisonData {
    return {
      title: 'Prim\'s Algorithm vs. Kruskal\'s Algorithm',
      subtitle: 'Vertex-Growing Cut Property vs. Global Edge-Sorting Cycle Avoidance',
      subjectA: 'Prim\'s Algorithm',
      subjectB: 'Kruskal\'s Algorithm',
      summary:
        'Both algorithms construct a Minimum Spanning Tree (MST) for connected weighted graphs, yielding the exact same minimum total weight. However, their structural strategies differ: Prim grows a single tree vertex-by-vertex across graph cuts, whereas Kruskal sorts all edges globally and maintains a forest of subtrees using Disjoint Set Union (DSU).',
      table: [
        {
          attribute: 'Working Principle',
          itemA: 'Grows a single connected tree from a starting vertex by greedily adding the cheapest cut-edge.',
          itemB: 'Examines edges in global ascending order of weight, adding edges that do not form cycles.',
          explanation: 'Prim maintains 1 growing tree component; Kruskal merges a forest of independent trees.',
        },
        {
          attribute: 'Core Data Structures',
          itemA: 'Priority Queue / Min-Heap of vertices and adjacent cut-edges.',
          itemB: 'Sorted Edge Array + Disjoint Set Union (DSU) with Path Compression and Union by Rank.',
          explanation: 'DSU enables nearly O(1) cycle detection for Kruskal.',
        },
        {
          attribute: 'Time Complexity',
          itemA: 'O(E log V) with Binary Heap; O(E + V log V) with Fibonacci Heap.',
          itemB: 'O(E log E) or O(E log V) dominated by sorting edges.',
          explanation: 'Since E ≤ V², log E is at most 2 log V, making both O(E log V).',
        },
        {
          attribute: 'Space Complexity',
          itemA: 'O(V) for heap and visited array.',
          itemB: 'O(E + V) to store edge list and DSU parent/rank arrays.',
          explanation: 'Kruskal requires explicit storage and sorting of all edges.',
        },
        {
          attribute: 'Best Suited Graph Topology',
          itemA: 'Dense graphs (where E approaches V²).',
          itemB: 'Sparse graphs (where E << V²) or when edges are already pre-sorted.',
          explanation: 'Prim processes fewer total items when edges are heavily clustered.',
        },
        {
          attribute: 'Handling Disconnected Graphs',
          itemA: 'Finds MST only for the starting vertex\'s component unless outer loop restarts.',
          itemB: 'Naturally discovers Minimum Spanning Forest (MSF) across all disconnected subnets.',
          explanation: 'Kruskal\'s edge-first approach spans all components without special cases.',
        },
        {
          attribute: 'Networking Applications',
          itemA: 'Centralized network cabling from core data center switch.',
          itemB: 'Distributed WAN cabling, LAN fiber topology planning, Spanning Tree Protocol (STP).',
          explanation: 'Both optimize physical cabling costs to eliminate broadcast loops.',
        },
      ],
    };
  }

  /**
   * BST vs AVL Comparative Analysis
   */
  public static getBSTvsAVL(): ComparisonData {
    return {
      title: 'Binary Search Tree (BST) vs. Self-Balancing AVL Tree',
      subtitle: 'Unconstrained Search Trees vs. Height-Balanced Guaranteed Search Trees',
      subjectA: 'Binary Search Tree (BST)',
      subjectB: 'AVL Tree (Adelson-Velsky & Landis)',
      summary:
        'A standard BST provides O(log n) performance under random insertions, but degrades to a degenerate linked-list O(n) under sequential or sorted inputs. An AVL tree strictly enforces that the balance factor for every node is within {-1, 0, 1}, guaranteeing a maximum height of ~1.44 log₂(n) and strict O(log n) worst-case time for all operations.',
      table: [
        {
          attribute: 'Balance Guarantee',
          itemA: 'No self-balancing mechanism. Shape depends entirely on insertion order.',
          itemB: 'Strict balance guarantee: |height(left) - height(right)| ≤ 1 for all nodes.',
          explanation: 'AVL enforces balance through automatic LL, RR, LR, and RL rotations.',
        },
        {
          attribute: 'Worst-Case Search Time',
          itemA: 'O(n) — degrades to a linear chain when inserting sorted keys (e.g. 10, 20, 30, 40).',
          itemB: 'O(log n) — guaranteed bound regardless of insertion order.',
          explanation: 'AVL height never exceeds 1.44 log₂(n).',
        },
        {
          attribute: 'Worst-Case Insertion Time',
          itemA: 'O(n) on degenerate trees.',
          itemB: 'O(log n) — traversal takes O(log n) plus at most one rotation sequence.',
          explanation: 'Insertion requires at most one single or double rotation to restore AVL property.',
        },
        {
          attribute: 'Worst-Case Deletion Time',
          itemA: 'O(n) on degenerate trees.',
          itemB: 'O(log n) — traversal takes O(log n) plus at most O(log n) rotations up to the root.',
          explanation: 'Deletion may trigger successive rotations along the ancestor path.',
        },
        {
          attribute: 'Memory Overhead per Node',
          itemA: '2 pointers (left, right) + data payload.',
          itemB: '2 pointers + height field (or balance factor) + data payload.',
          explanation: 'AVL requires an integer or 2-bit field to store node height.',
        },
        {
          attribute: 'Balancing Overhead',
          itemA: 'None. Zero CPU overhead during insertions or deletions.',
          itemB: 'Rotations and height recalculations during tree modifications.',
          explanation: 'AVL spends extra CPU cycles during write operations to guarantee fast read operations.',
        },
        {
          attribute: 'Ideal Networking Scenario',
          itemA: 'Temporary buffers or uniformly distributed random hash lookups.',
          itemB: 'Core IP routing tables, port forwarding databases, high-throughput DNS caches.',
          explanation: 'Lookup-heavy systems where worst-case latency guarantees are safety-critical.',
        },
      ],
    };
  }
}
