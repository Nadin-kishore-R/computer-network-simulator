export interface AlgorithmComplexityProfile {
  name: string;
  category: 'Tree' | 'Graph' | 'General';
  bestTime: string;
  averageTime: string;
  worstTime: string;
  spaceComplexity: string;
  recurrenceRelation?: string;
  amortizedNote?: string;
  explanation: string;
}

export interface AsymptoticDefinition {
  notation: string;
  name: string;
  mathematicalDefinition: string;
  intuitiveMeaning: string;
  networkingAnalogy: string;
}

export class ComplexityTheory {
  public static getAsymptoticNotations(): AsymptoticDefinition[] {
    return [
      {
        notation: 'O(g(n))',
        name: 'Big-O (Asymptotic Upper Bound)',
        mathematicalDefinition: 'f(n) ∈ O(g(n)) iff ∃ constants c > 0 and n₀ ≥ 0 such that 0 ≤ f(n) ≤ c · g(n) for all n ≥ n₀.',
        intuitiveMeaning: 'Guarantees the algorithm will never run slower than this bound for large inputs (Worst-case ceiling).',
        networkingAnalogy: 'Maximum peak SLA latency: your network packet transmission time will never exceed this threshold.',
      },
      {
        notation: 'Ω(g(n))',
        name: 'Big-Omega (Asymptotic Lower Bound)',
        mathematicalDefinition: 'f(n) ∈ Ω(g(n)) iff ∃ constants c > 0 and n₀ ≥ 0 such that 0 ≤ c · g(n) ≤ f(n) for all n ≥ n₀.',
        intuitiveMeaning: 'Represents the fundamental minimum work an algorithm must perform (Best-case floor).',
        networkingAnalogy: 'Physical speed of light in fiber optic cables: minimum baseline propagation delay.',
      },
      {
        notation: 'Θ(g(n))',
        name: 'Big-Theta (Asymptotically Tight Bound)',
        mathematicalDefinition: 'f(n) ∈ Θ(g(n)) iff f(n) ∈ O(g(n)) and f(n) ∈ Ω(g(n)); ∃ c₁, c₂ > 0 such that c₁·g(n) ≤ f(n) ≤ c₂·g(n).',
        intuitiveMeaning: 'The algorithm grows at exactly the same rate as g(n) within constant multiplicative factors.',
        networkingAnalogy: 'Fixed wire clock rate in Synchronous Optical Networking (SONET/SDH).',
      },
    ];
  }

  public static getAlgorithmProfiles(): AlgorithmComplexityProfile[] {
    return [
      {
        name: 'General Tree (Multi-Way Network Hierarchy)',
        category: 'Tree',
        bestTime: 'O(1) [Root / Direct Child Add]',
        averageTime: 'O(n) [Depth-First Search / Traversals]',
        worstTime: 'O(n) [Unindexed Subtree Search]',
        spaceComplexity: 'O(n) auxiliary memory for tree references and recursion stack.',
        recurrenceRelation: 'T(n) = ∑ T(cᵢ) + O(1) across all children cᵢ.',
        explanation: 'Multi-way trees store arbitrary child lists. Traversing, height calculating, and deep searching requires inspecting all n network nodes.',
      },
      {
        name: 'Binary Search Tree (BST)',
        category: 'Tree',
        bestTime: 'O(1) [Root Match]',
        averageTime: 'O(log n) [Random Uniform Insertions]',
        worstTime: 'O(n) [Degenerate Skewed Line]',
        spaceComplexity: 'O(n) storage; O(h) recursion stack space where h ∈ [log n, n].',
        recurrenceRelation: 'T(n) = T(k) + T(n - k - 1) + O(1). When balanced (k = n/2): T(n) = 2T(n/2) + O(1) ⇒ Θ(log n).',
        amortizedNote: 'Standard BST has no balance guarantee; sorted keys collapse the tree to a linked list.',
        explanation: 'BST property: Left < Node < Right. Fast lookups on balanced trees, but vulnerable to sequential network IP inserts.',
      },
      {
        name: 'AVL Tree (Self-Balancing Binary Search Tree)',
        category: 'Tree',
        bestTime: 'O(1) [Root Match]',
        averageTime: 'O(log n) [Search, Insert, Delete]',
        worstTime: 'O(log n) [Guaranteed Bound]',
        spaceComplexity: 'O(n) storage with height fields; O(log n) call stack.',
        recurrenceRelation: 'N(h) = N(h - 1) + N(h - 2) + 1 (Fibonacci minimal nodes). Height h < 1.4404 log₂(n + 2) - 0.328.',
        amortizedNote: 'At most 1 single or double rotation per insertion. At most O(log n) rotations per deletion.',
        explanation: 'Strictly enforces |BF| ≤ 1. Rotations (LL, RR, LR, RL) guarantee sub-millisecond worst-case lookup for core IP routing.',
      },
      {
        name: 'Expression Tree (Bandwidth Formula Calculator)',
        category: 'Tree',
        bestTime: 'O(m) where m is token count',
        averageTime: 'O(m)',
        worstTime: 'O(m)',
        spaceComplexity: 'O(m) for operand stack and tree nodes.',
        recurrenceRelation: 'T(m) = T(m_left) + T(m_right) + O(1) ⇒ Θ(m).',
        explanation: 'Constructing from postfix takes linear time using a single operand stack. Evaluation recursively evaluates subtrees.',
      },
      {
        name: 'Breadth-First Search (BFS)',
        category: 'Graph',
        bestTime: 'O(V + E)',
        averageTime: 'O(V + E)',
        worstTime: 'O(V + E)',
        spaceComplexity: 'O(V) for FIFO queue, visited set, and distance array.',
        explanation: 'Every vertex is enqueued once and every incident edge is examined once. Ideal for minimum-hop network discoveries.',
      },
      {
        name: 'Depth-First Search (DFS - Recursive & Iterative)',
        category: 'Graph',
        bestTime: 'O(V + E)',
        averageTime: 'O(V + E)',
        worstTime: 'O(V + E)',
        spaceComplexity: 'O(V) for recursion stack / explicit LIFO stack and timestamps.',
        explanation: 'Explores deeply before backtracking. Classifies edges into tree, back (cycle), forward, and cross edges in directed topologies.',
      },
      {
        name: 'Dijkstra\'s Shortest Path Algorithm',
        category: 'Graph',
        bestTime: 'O((V + E) log V) with Binary Min-Heap',
        averageTime: 'O((V + E) log V)',
        worstTime: 'O((V + E) log V) [O(V² + E) with flat array]',
        spaceComplexity: 'O(V) for heap and distance/previous tables.',
        amortizedNote: 'Fibonacci Heap improves theoretical decrease-key to O(1) amortized, yielding O(E + V log V).',
        explanation: 'Greedy single-source shortest path. Non-negative edge weights strictly required. Guarantees minimum cumulative latency.',
      },
      {
        name: 'Prim\'s Minimum Spanning Tree',
        category: 'Graph',
        bestTime: 'O(E log V)',
        averageTime: 'O(E log V)',
        worstTime: 'O(E log V)',
        spaceComplexity: 'O(V) for priority queue and visited cut set.',
        explanation: 'Vertex-centric cut expansion. Greedily bridges minimum cut edge. Highly efficient on dense network fabrics.',
      },
      {
        name: 'Kruskal\'s Minimum Spanning Tree with DSU',
        category: 'Graph',
        bestTime: 'O(E log E) sorting',
        averageTime: 'O(E log E) ≈ O(E log V)',
        worstTime: 'O(E log E)',
        spaceComplexity: 'O(E + V) for edge storage and DSU parent/rank arrays.',
        amortizedNote: 'DSU with Path Compression + Union by Rank operates in O(α(V)) amortized time per operation, where α is the inverse Ackermann function (α(n) < 5 for all practical universe sizes).',
        explanation: 'Edge-centric greedy selection with DSU cycle rejection. Optimal for sparse WAN cabling topologies.',
      },
      {
        name: 'Tarjan\'s Strongly Connected Components (SCC)',
        category: 'Graph',
        bestTime: 'O(V + E)',
        averageTime: 'O(V + E)',
        worstTime: 'O(V + E)',
        spaceComplexity: 'O(V) for DFS call stack, low-link array, and active SCC stack.',
        explanation: 'Discovers all maximal strongly connected subgraphs in a single DFS pass by tracking discovery and low-link values.',
      },
      {
        name: 'Topological Sorting (Kahn & DFS)',
        category: 'Graph',
        bestTime: 'O(V + E)',
        averageTime: 'O(V + E)',
        worstTime: 'O(V + E)',
        spaceComplexity: 'O(V) for in-degree array, queue, and order list.',
        explanation: 'Orders directed dependencies in linear time. Cycle detection immediately identifies recursive dependency deadlocks.',
      },
    ];
  }
}
