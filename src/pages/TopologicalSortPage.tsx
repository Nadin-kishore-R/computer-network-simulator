import React, { useState } from 'react';
import { useNetwork } from '../context/NetworkContext';
import { GraphVisualizer } from '../components/GraphVisualizer';
import { TopologicalSort } from '../algorithms/topologicalSort';
import { Graph } from '../algorithms/graph';
import { ListOrdered, Play, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';

export const TopologicalSortPage: React.FC = () => {
  const { graph, setGraph, triggerUpdate, logOperation } = useNetwork();
  const [algoMode, setAlgoMode] = useState<'kahn' | 'dfs'>('kahn');

  const vertices = graph.getAllVertices();
  const edges = graph.getAllEdges();

  const sortResult = React.useMemo(() => {
    return algoMode === 'kahn' ? TopologicalSort.kahn(graph) : TopologicalSort.dfsBased(graph);
  }, [graph, algoMode]);

  const isValidOrder = sortResult.isDAG ? TopologicalSort.verifyTopologicalOrder(graph, sortResult.order) : false;

  const loadPreset = (type: 'dag' | 'cyclic') => {
    if (type === 'dag') {
      setGraph(Graph.createSampleDAG());
      logOperation('TopologicalSort', 'Loaded DAG', 'Loaded directed acyclic network pipeline.');
    } else {
      setGraph(Graph.createSampleCyclicGraph());
      logOperation('TopologicalSort', 'Loaded Cyclic Graph', 'Loaded graph with directed cycle to test cycle deadlock.');
    }
    triggerUpdate();
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-pink-400 text-xs font-mono">
            <ListOrdered className="w-4 h-4" />
            <span>UNIT IV — GRAPHS</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">
            Topological Sorting & Cycle Deadlock Detection
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Scheduling network service dependencies (DNS → Gateway → Firewall → Web Server) and detecting circular deadlocks.
          </p>
        </div>

        {/* Algorithm Tabs */}
        <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setAlgoMode('kahn')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              algoMode === 'kahn'
                ? 'bg-pink-950 text-pink-300 font-bold border border-pink-800'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Kahn's Algorithm (In-Degree)
          </button>
          <button
            onClick={() => setAlgoMode('dfs')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              algoMode === 'dfs'
                ? 'bg-pink-950 text-pink-300 font-bold border border-pink-800'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            DFS Reverse Postorder
          </button>
        </div>
      </div>

      {/* Preset Test Buttons */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-white">Demonstrative Test Scenarios:</span>
        <div className="flex gap-2">
          <button
            onClick={() => loadPreset('dag')}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-emerald-800/80 hover:bg-emerald-950/80 text-emerald-300 font-mono transition-colors"
          >
            Load Valid Acyclic DAG
          </button>
          <button
            onClick={() => loadPreset('cyclic')}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-red-800/80 hover:bg-red-950/80 text-red-300 font-mono transition-colors"
          >
            Load Directed Cyclic Network (Deadlock)
          </button>
        </div>
      </div>

      {/* Status Alert Banner */}
      {sortResult.isDAG ? (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 flex items-center justify-between gap-4 text-xs shadow-lg">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-emerald-200 font-bold font-mono">Valid Directed Acyclic Graph (DAG) Verified</div>
              <div className="text-slate-300 text-[11px] mt-0.5">
                Topological Order:{' '}
                <strong className="text-white font-mono">{sortResult.order.join(' → ')}</strong>
              </div>
            </div>
          </div>
          <div className="px-3 py-1 rounded bg-emerald-900/60 border border-emerald-700 text-emerald-300 font-mono font-bold shrink-0">
            {isValidOrder ? 'All Dependencies Respected' : 'Checking…'}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-800 flex items-start gap-3 text-xs shadow-lg">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="text-red-200 font-bold font-mono">Directed Cycle Detected — Topological Sort Impossible!</div>
            <p className="text-slate-300 text-[11px] font-sans">
              A circular dependency was discovered involving nodes: [{sortResult.cycle?.join(' ⟷ ') || 'Cyclic Loop'}]. Circular loops cause infinite deadlock in packet forwarding and dependency resolution.
            </p>
          </div>
        </div>
      )}

      {/* Visual Canvas */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-400 px-1">
          <span>Active Directed Graph Topology:</span>
          <span className="text-pink-400 font-mono">Graph Type: Directed</span>
        </div>
        <GraphVisualizer
          vertices={vertices}
          edges={edges}
          isDirected={true}
          height={380}
        />
      </div>

      {/* Execution Pipeline Steps Table */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 font-mono text-xs">
        <h2 className="text-sm font-bold text-white font-sans flex items-center gap-2">
          <ListOrdered className="w-4 h-4 text-pink-400" />
          <span>Algorithm Execution Steps & Resolution Queue</span>
        </h2>

        <div className="overflow-y-auto max-h-56 space-y-2">
          {sortResult.steps.map((s) => (
            <div key={s.step} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-pink-400">Step {s.step}</span>
                {s.readyQueue && (
                  <span className="text-slate-400">Ready Queue: [{s.readyQueue.join(', ')}]</span>
                )}
              </div>
              <p className="text-slate-300 font-sans">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
