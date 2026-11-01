import { describe, it, expect } from 'vitest';
import { AlgorithmComparisons } from '../analysis/comparisons';
import { BenchmarkRunner, SeededRandom } from '../analysis/benchmarking';
import { ComplexityTheory } from '../analysis/complexity';

describe('Algorithm Comparative Studies', () => {
  it('should return complete comparison data for BFS vs Dijkstra', () => {
    const data = AlgorithmComparisons.getBFSvsDijkstra();
    expect(data.table.length).toBeGreaterThanOrEqual(6);
    expect(data.subjectA).toContain('BFS');
    expect(data.subjectB).toContain('Dijkstra');
  });

  it('should demonstrate route divergence between BFS (min-hop) and Dijkstra (min-cost)', () => {
    const divergent = AlgorithmComparisons.createDivergentRouteNetwork();
    expect(divergent.bfsPath.length).toBeLessThan(divergent.dijkstraPath.length); // Fewer hops in BFS
    expect(divergent.dijkstraCost).toBeLessThan(divergent.bfsCost); // Lower cost in Dijkstra
    expect(divergent.bfsCost).toBe(100);
    expect(divergent.dijkstraCost).toBe(30);
  });

  it('should return comparison data for Prim vs Kruskal', () => {
    const data = AlgorithmComparisons.getPrimVsKruskal();
    expect(data.table.length).toBeGreaterThanOrEqual(6);
    expect(data.subjectA).toContain('Prim');
    expect(data.subjectB).toContain('Kruskal');
  });

  it('should return comparison data for BST vs AVL', () => {
    const data = AlgorithmComparisons.getBSTvsAVL();
    expect(data.table.length).toBeGreaterThanOrEqual(6);
    expect(data.subjectA).toContain('BST');
    expect(data.subjectB).toContain('AVL');
  });
});

describe('Performance Benchmarking Laboratory', () => {
  it('should provide reproducible random sequences using SeededRandom', () => {
    const rng1 = new SeededRandom(12345);
    const seq1 = [rng1.nextInt(1, 100), rng1.nextInt(1, 100), rng1.nextInt(1, 100)];

    const rng2 = new SeededRandom(12345);
    const seq2 = [rng2.nextInt(1, 100), rng2.nextInt(1, 100), rng2.nextInt(1, 100)];

    expect(seq1).toEqual(seq2);
  });

  it('should benchmark tree operations and record genuine timings', () => {
    const results = BenchmarkRunner.benchmarkTrees(200, 42);
    expect(results.length).toBeGreaterThanOrEqual(2);
    results.forEach((r) => {
      expect(r.timeMs).toBeGreaterThanOrEqual(0);
      expect(r.inputSize).toBe(200);
      expect(r.theoreticalComplexity).toBeDefined();
    });
  });

  it('should benchmark graph operations and record genuine timings', () => {
    const results = BenchmarkRunner.benchmarkGraphs(50, 99);
    expect(results.length).toBe(5); // BFS, DFS, Dijkstra, Prim, Kruskal
    results.forEach((r) => {
      expect(r.timeMs).toBeGreaterThanOrEqual(0);
      expect(r.inputSize).toBe(50);
      expect(r.operationsCount).toBeGreaterThan(0);
    });
  });
});

describe('Asymptotic Complexity Theory', () => {
  it('should provide asymptotic notation definitions', () => {
    const notations = ComplexityTheory.getAsymptoticNotations();
    expect(notations.length).toBe(3);
    expect(notations.map((n) => n.notation)).toEqual(['O(g(n))', 'Ω(g(n))', 'Θ(g(n))']);
  });

  it('should supply accurate algorithm complexity profiles', () => {
    const profiles = ComplexityTheory.getAlgorithmProfiles();
    expect(profiles.length).toBeGreaterThanOrEqual(10);
    profiles.forEach((p) => {
      expect(p.bestTime).toBeDefined();
      expect(p.averageTime).toBeDefined();
      expect(p.worstTime).toBeDefined();
      expect(p.spaceComplexity).toBeDefined();
    });
  });
});
