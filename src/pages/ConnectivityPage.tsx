import React from 'react';
import { useNetwork } from '../context/NetworkContext';
import { GraphVisualizer } from '../components/GraphVisualizer';
import { ConnectedComponents } from '../algorithms/components';
import { Network, RefreshCw, Layers, ShieldCheck } from 'lucide-react';

export const ConnectivityPage: React.FC = () => {
  const { graph, triggerUpdate, logOperation } = useNetwork();
  const vertices = graph.getAllVertices();
  const edges = graph.getAllEdges();
  const isDirected = graph.getIsDirected();

  const componentResult = React.useMemo(() => {
    return ConnectedComponents.analyze(graph);
  }, [graph]);

  const toggleDirectedMode = (directed: boolean) => {
    graph.setIsDirected(directed);
    triggerUpdate();
    logOperation(
      'Connectivity',
      'Mode Switch',
      `Switched to ${directed ? 'Directed (Tarjan SCC)' : 'Undirected (Connected Components)'}.`
    );
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-violet-400 text-xs font-mono">
            <Network className="w-4 h-4" />
            <span>UNIT IV — GRAPHS</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">
            Network Connectivity & Strongly Connected Components
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Discovering isolated subnets and maximal strongly connected communication clusters using Tarjan's algorithm.
          </p>
        </div>

        {/* Directed / Undirected Mode Switch */}
        <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800 text-xs font-mono">
          <button
            onClick={() => toggleDirectedMode(false)}
            className={`px-3 py-1.5 rounded-md transition-all ${
              !isDirected
                ? 'bg-violet-950 text-violet-300 font-bold border border-violet-800'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Undirected Components
          </button>
          <button
            onClick={() => toggleDirectedMode(true)}
            className={`px-3 py-1.5 rounded-md transition-all ${
              isDirected
                ? 'bg-violet-950 text-violet-300 font-bold border border-violet-800'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Directed SCC (Tarjan)
          </button>
        </div>
      </div>

      {/* Component Statistics Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 font-mono">Partition Count</div>
          <div className="text-2xl font-bold text-violet-400 font-mono mt-0.5">
            {componentResult.componentCount}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            {isDirected ? 'Strongly Connected Components' : 'Isolated Network Partitions'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 font-mono">Algorithm Used</div>
          <div className="text-lg font-bold text-cyan-300 font-mono mt-1">
            {isDirected ? "Tarjan's Low-Link DFS" : 'Breadth-First Disjoint Search'}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">Linear Time Complexity O(V + E)</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 font-mono">Global Network Health</div>
          <div className="text-lg font-bold text-emerald-400 font-mono mt-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>{componentResult.componentCount > 1 ? 'Multi-Partition / Air-Gapped' : 'Fully Connected Fabric'}</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            {componentResult.componentCount > 1 ? 'Isolated subnets detected' : 'Full reachability guaranteed'}
          </div>
        </div>
      </div>

      {/* Color-Coded Canvas Visualizer */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-400 px-1">
          <span>
            Color-coded nodes denote isolated components or mutual reachability groups:
          </span>
          <span className="text-violet-400 font-mono">Total Components: {componentResult.componentCount}</span>
        </div>
        <GraphVisualizer
          vertices={vertices}
          edges={edges}
          isDirected={isDirected}
          vertexComponentMap={componentResult.vertexComponentMap}
          height={420}
        />
      </div>

      {/* Component Details Card */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4 font-mono text-xs">
        <h2 className="text-sm font-bold text-white font-sans flex items-center gap-2">
          <Layers className="w-4 h-4 text-violet-400" />
          <span>Discovered Component Partitions ({componentResult.components.length})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {componentResult.components.map((comp) => (
            <div
              key={comp.id}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 hover:border-violet-600/60 transition-all shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-violet-300">Partition #{comp.id}</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 text-[10px]">
                  {comp.vertices.length} Node{comp.vertices.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {comp.vertices.map((v) => (
                  <span key={v} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-bold">
                    {v}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
