import React, { useState } from 'react';
import { AlgorithmComparisons, ComparisonData } from '../analysis/comparisons';
import { GraphVisualizer } from '../components/GraphVisualizer';
import { Layers, Compass, Navigation, Cable, Binary, Scale, HelpCircle } from 'lucide-react';

export const ComparisonsLabPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bfs-dijkstra' | 'prim-kruskal' | 'bst-avl'>('bfs-dijkstra');

  const bfsVsDijkstra = AlgorithmComparisons.getBFSvsDijkstra();
  const primVsKruskal = AlgorithmComparisons.getPrimVsKruskal();
  const bstVsAvl = AlgorithmComparisons.getBSTvsAVL();

  const divergent = AlgorithmComparisons.createDivergentRouteNetwork();

  const getCurrentData = (): ComparisonData => {
    if (activeTab === 'bfs-dijkstra') return bfsVsDijkstra;
    if (activeTab === 'prim-kruskal') return primVsKruskal;
    return bstVsAvl;
  };

  const current = getCurrentData();

  // Highlighted paths for divergent network
  const dijkstraPathEdges: { source: string; target: string }[] = [];
  for (let i = 0; i < divergent.dijkstraPath.length - 1; i++) {
    dijkstraPathEdges.push({
      source: divergent.dijkstraPath[i],
      target: divergent.dijkstraPath[i + 1],
    });
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-yellow-400 text-xs font-mono">
            <Layers className="w-4 h-4" />
            <span>UNIT V — ALGORITHM ANALYSIS</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Algorithm Performance Laboratory — Comparisons</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Rigorous comparative analysis of contrasting algorithmic paradigms in networking and tree structures.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('bfs-dijkstra')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'bfs-dijkstra' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800' : 'text-slate-400 hover:text-white'
            }`}
          >
            BFS vs. Dijkstra
          </button>
          <button
            onClick={() => setActiveTab('prim-kruskal')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'prim-kruskal' ? 'bg-amber-950 text-amber-300 font-bold border border-amber-800' : 'text-slate-400 hover:text-white'
            }`}
          >
            Prim vs. Kruskal
          </button>
          <button
            onClick={() => setActiveTab('bst-avl')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'bst-avl' ? 'bg-purple-950 text-purple-300 font-bold border border-purple-800' : 'text-slate-400 hover:text-white'
            }`}
          >
            BST vs. AVL
          </button>
        </div>
      </div>

      {/* Comparison Summary Banner */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">{current.title}</h2>
          <span className="text-xs text-cyan-400 font-mono font-semibold">{current.subtitle}</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">{current.summary}</p>
      </div>

      {/* Divergent Network Demonstration for BFS vs Dijkstra */}
      {activeTab === 'bfs-dijkstra' && (
        <div className="p-5 rounded-xl bg-slate-900/80 border border-cyan-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>Concrete Route Divergence: Minimum-Hop Route vs. Minimum-Latency Route</span>
            </h3>
            <span className="text-xs text-cyan-400 font-mono">OSPF vs RIP Paradigm</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-sky-400 font-bold block">1. BFS Minimum-Hop Selection (RIP style):</span>
              <div className="text-white">Route: [{divergent.bfsPath.join(' → ')}]</div>
              <div className="text-slate-400">Total Hops: 1 | Cumulative Latency: {divergent.bfsCost} ms</div>
              <p className="text-[11px] text-slate-500 font-sans pt-1">
                BFS minimizes hop count, blindly selecting the direct slow satellite link (100ms).
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-cyan-800/60 space-y-1">
              <span className="text-cyan-400 font-bold block">2. Dijkstra Minimum-Cost Selection (OSPF style):</span>
              <div className="text-white">Route: [{divergent.dijkstraPath.join(' → ')}]</div>
              <div className="text-emerald-400 font-bold">Total Hops: 3 | Cumulative Latency: {divergent.dijkstraCost} ms (70% faster!)</div>
              <p className="text-[11px] text-slate-500 font-sans pt-1">
                Dijkstra optimizes cumulative weight, choosing the 3-hop high-speed fiber route (30ms).
              </p>
            </div>
          </div>

          {/* Interactive Topology Display */}
          <GraphVisualizer
            vertices={divergent.graph.getAllVertices()}
            edges={divergent.graph.getAllEdges()}
            highlightedPathEdges={dijkstraPathEdges}
            highlightedVertices={divergent.dijkstraPath}
            height={260}
          />
        </div>
      )}

      {/* Comprehensive Comparison Table */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h2 className="text-sm font-bold text-white">Feature & Complexity Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-3 px-3 w-1/5">Attribute</th>
                <th className="py-3 px-3 w-2/5 text-cyan-300">{current.subjectA}</th>
                <th className="py-3 px-3 w-2/5 text-blue-300">{current.subjectB}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {current.table.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-950/50">
                  <td className="py-3 px-3 text-white font-bold align-top">{row.attribute}</td>
                  <td className="py-3 px-3 text-slate-300 font-sans align-top">
                    <div className="font-mono text-cyan-400 mb-1">{row.itemA}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-sans align-top">
                    <div className="font-mono text-blue-400 mb-1">{row.itemB}</div>
                    <div className="text-[11px] text-slate-500">{row.explanation}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
