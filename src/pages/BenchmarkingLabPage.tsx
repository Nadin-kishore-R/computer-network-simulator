import React, { useState } from 'react';
import { BenchmarkRunner, BenchmarkResult } from '../analysis/benchmarking';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Activity, Play, Cpu, Clock } from 'lucide-react';

export const BenchmarkingLabPage: React.FC = () => {
  const [treeSize, setTreeSize] = useState<number>(1000);
  const [graphSize, setGraphSize] = useState<number>(200);
  const [isBenchmarking, setIsBenchmarking] = useState<boolean>(false);

  // Initial benchmark results
  const [treeResults, setTreeResults] = useState<BenchmarkResult[]>(() => {
    return BenchmarkRunner.benchmarkTrees(1000, 42);
  });

  const [graphResults, setGraphResults] = useState<BenchmarkResult[]>(() => {
    return BenchmarkRunner.benchmarkGraphs(200, 99);
  });

  const runTreeBenchmark = () => {
    setIsBenchmarking(true);
    setTimeout(() => {
      const res = BenchmarkRunner.benchmarkTrees(treeSize, 42);
      setTreeResults(res);
      setIsBenchmarking(false);
    }, 50);
  };

  const runGraphBenchmark = () => {
    setIsBenchmarking(true);
    setTimeout(() => {
      const res = BenchmarkRunner.benchmarkGraphs(graphSize, 99);
      setGraphResults(res);
      setIsBenchmarking(false);
    }, 50);
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold uppercase tracking-wider">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Empirical Execution Benchmarks</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Performance Benchmarking Laboratory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time execution latency measurements using browser high-precision timers (performance.now()) and reproducible PRNG seeds.
          </p>
        </div>

        <div className="px-3.5 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800 flex items-center gap-2 shadow-xs">
          <Clock className="w-3.5 h-3.5 text-emerald-600" />
          <span>High-Resolution Timing: performance.now()</span>
        </div>
      </div>

      {/* Part 1: Tree Benchmarking */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-600" />
              <span>Hierarchical Directory Benchmark (BST vs. Balanced AVL)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Evaluates random insertion and sequential sorted insertions (worst case degenerate linear path vs O(log n) balanced AVL).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={treeSize}
              onChange={(e) => setTreeSize(parseInt(e.target.value, 10))}
              className="px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-800 font-mono outline-none shadow-xs"
            >
              <option value={1000}>1,000 nodes</option>
              <option value={5000}>5,000 nodes</option>
              <option value={20000}>20,000 nodes</option>
            </select>

            <button
              onClick={runTreeBenchmark}
              disabled={isBenchmarking}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold flex items-center gap-2 text-xs shadow-sm disabled:opacity-50 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isBenchmarking ? 'Running…' : 'Run Directory Benchmark'}</span>
            </button>
          </div>
        </div>

        {/* Tree Chart & Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Chart */}
          <div className="h-64 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-mono text-slate-600 font-semibold block mb-2 px-2">
              Execution Time (ms) by Algorithm [Size: {treeSize}]
            </span>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={treeResults} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="algorithm" stroke="#64748b" tick={{ fontSize: 10 }} interval={0} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', fontSize: '11px', fontFamily: 'monospace', borderRadius: '8px', color: '#0f172a' }}
                />
                <Bar dataKey="timeMs" fill="#0284c7" name="Time (ms)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[11px] bg-slate-50">
                  <th className="py-2.5 px-3">Algorithm</th>
                  <th className="py-2.5 px-3">Theoretical O</th>
                  <th className="py-2.5 px-3">Measured Time</th>
                  <th className="py-2.5 px-3">Structural Output</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {treeResults.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 text-cyan-800 font-semibold">{r.algorithm}</td>
                    <td className="py-2.5 px-3 text-slate-600">{r.theoreticalComplexity}</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">{r.timeMs} ms</td>
                    <td className="py-2.5 px-3 text-slate-600 text-[11px] font-sans">{r.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Part 2: Graph Benchmarking */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-600" />
              <span>Routing Algorithms Benchmark (BFS, DFS, Dijkstra, Prim, Kruskal)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Evaluates execution speed across dense connected topologies with deterministic random seed.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={graphSize}
              onChange={(e) => setGraphSize(parseInt(e.target.value, 10))}
              className="px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-800 font-mono outline-none shadow-xs"
            >
              <option value={200}>200 vertices</option>
              <option value={1000}>1,000 vertices</option>
              <option value={2000}>2,000 vertices</option>
            </select>

            <button
              onClick={runGraphBenchmark}
              disabled={isBenchmarking}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold flex items-center gap-2 text-xs shadow-sm disabled:opacity-50 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isBenchmarking ? 'Running…' : 'Run Routing Benchmark'}</span>
            </button>
          </div>
        </div>

        {/* Graph Chart & Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Chart */}
          <div className="h-64 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-mono text-slate-600 font-semibold block mb-2 px-2">
              Routing Algorithm Latency (ms) [Size: {graphSize} Vertices]
            </span>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={graphResults} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="algorithm" stroke="#64748b" tick={{ fontSize: 9 }} interval={0} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', fontSize: '11px', fontFamily: 'monospace', borderRadius: '8px', color: '#0f172a' }}
                />
                <Bar dataKey="timeMs" fill="#16a34a" name="Time (ms)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[11px] bg-slate-50">
                  <th className="py-2.5 px-3">Algorithm</th>
                  <th className="py-2.5 px-3">Complexity</th>
                  <th className="py-2.5 px-3">Execution Time</th>
                  <th className="py-2.5 px-3">Operations Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {graphResults.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 text-emerald-700 font-semibold">{r.algorithm}</td>
                    <td className="py-2.5 px-3 text-slate-600">{r.theoreticalComplexity}</td>
                    <td className="py-2.5 px-3 text-cyan-800 font-bold">{r.timeMs} ms</td>
                    <td className="py-2.5 px-3 text-slate-600">{r.operationsCount} ops</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
