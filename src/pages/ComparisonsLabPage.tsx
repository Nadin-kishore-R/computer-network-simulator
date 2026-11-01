import React, { useState } from 'react';
import { AlgorithmComparisons, ComparisonData } from '../analysis/comparisons';
import { GraphVisualizer } from '../components/GraphVisualizer';
import { Layers, HelpCircle } from 'lucide-react';

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-yellow-700 text-xs font-semibold uppercase tracking-wider">
            <Layers className="w-4 h-4 text-yellow-600" />
            <span>Empirical Protocol Comparisons</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Routing Protocol & Architecture Comparisons</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Rigorous comparative analysis of contrasting algorithmic paradigms in routing protocols and hierarchical registries.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200 text-xs font-mono">
          <button
            onClick={() => setActiveTab('bfs-dijkstra')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'bfs-dijkstra' ? 'bg-white text-cyan-800 font-bold border border-cyan-200 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            BFS vs. Dijkstra
          </button>
          <button
            onClick={() => setActiveTab('prim-kruskal')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'prim-kruskal' ? 'bg-white text-amber-800 font-bold border border-amber-200 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Prim vs. Kruskal
          </button>
          <button
            onClick={() => setActiveTab('bst-avl')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'bst-avl' ? 'bg-white text-purple-800 font-bold border border-purple-200 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            BST vs. AVL
          </button>
        </div>
      </div>

      {/* Comparison Summary Banner */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">{current.title}</h2>
          <span className="text-xs text-cyan-800 font-mono font-semibold">{current.subtitle}</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed font-sans">{current.summary}</p>
      </div>

      {/* Divergent Network Demonstration for BFS vs Dijkstra */}
      {activeTab === 'bfs-dijkstra' && (
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-600" />
              <span>Concrete Route Divergence: Minimum-Hop Route vs. Minimum-Latency Route</span>
            </h3>
            <span className="text-xs text-cyan-800 font-mono font-semibold">OSPF vs RIP Paradigm</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-sky-800 font-bold block">1. BFS Minimum-Hop Selection (RIP style):</span>
              <div className="text-slate-900 font-bold">Route: [{divergent.bfsPath.join(' → ')}]</div>
              <div className="text-slate-600">Total Hops: 1 | Cumulative Latency: {divergent.bfsCost} ms</div>
              <p className="text-[11px] text-slate-500 font-sans pt-1">
                BFS minimizes hop count, blindly selecting the direct slow satellite link (100ms).
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-cyan-50/60 border border-cyan-200 space-y-1">
              <span className="text-cyan-800 font-bold block">2. Dijkstra Minimum-Cost Selection (OSPF style):</span>
              <div className="text-slate-900 font-bold">Route: [{divergent.dijkstraPath.join(' → ')}]</div>
              <div className="text-emerald-700 font-bold">Total Hops: 3 | Cumulative Latency: {divergent.dijkstraCost} ms (70% faster!)</div>
              <p className="text-[11px] text-slate-600 font-sans pt-1">
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
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-900">Feature & Complexity Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-[11px] bg-slate-50">
                <th className="py-2.5 px-3 w-1/5">Attribute</th>
                <th className="py-2.5 px-3 w-2/5 text-cyan-800 font-bold">{current.subjectA}</th>
                <th className="py-2.5 px-3 w-2/5 text-blue-800 font-bold">{current.subjectB}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {current.table.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70">
                  <td className="py-3 px-3 text-slate-900 font-bold align-top">{row.attribute}</td>
                  <td className="py-3 px-3 text-slate-700 font-sans align-top">
                    <div className="font-mono text-cyan-800 font-semibold mb-1">{row.itemA}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-sans align-top">
                    <div className="font-mono text-blue-800 font-semibold mb-1">{row.itemB}</div>
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
