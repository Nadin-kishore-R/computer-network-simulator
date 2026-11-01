import React, { useState } from 'react';
import { useNetwork } from '../context/NetworkContext';
import { GraphVisualizer } from '../components/GraphVisualizer';
import { BreadthFirstSearch } from '../algorithms/bfs';
import { DepthFirstSearch } from '../algorithms/dfs';
import { BFSResult, DFSResult } from '../types/graph';
import { Compass, Play, GitCommit, Layers, Clock, AlertTriangle } from 'lucide-react';

export const TraversalsPage: React.FC = () => {
  const { graph } = useNetwork();
  const vertices = graph.getAllVertices();
  const edges = graph.getAllEdges();

  const [mode, setMode] = useState<'bfs' | 'dfs-recursive' | 'dfs-iterative'>('bfs');
  const [startVertex, setStartVertex] = useState<string>('R-Core');

  const [bfsResult, setBfsResult] = useState<BFSResult | null>(() => {
    try {
      return BreadthFirstSearch.traverse(graph, 'R-Core');
    } catch {
      return null;
    }
  });

  const [dfsResult, setDfsResult] = useState<DFSResult | null>(() => {
    try {
      return DepthFirstSearch.traverseRecursive(graph, 'R-Core');
    } catch {
      return null;
    }
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRun = () => {
    setErrorMsg(null);
    try {
      if (mode === 'bfs') {
        const res = BreadthFirstSearch.traverse(graph, startVertex);
        setBfsResult(res);
      } else if (mode === 'dfs-recursive') {
        const res = DepthFirstSearch.traverseRecursive(graph, startVertex);
        setDfsResult(res);
      } else {
        const res = DepthFirstSearch.traverseIterative(graph, startVertex);
        setDfsResult(res);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    }
  };

  // Determine highlighted vertices and metric tags
  const highlightedVertices = mode === 'bfs'
    ? (bfsResult ? bfsResult.visited : [])
    : (dfsResult ? dfsResult.traversalOrder : []);

  const vertexMetricMap: Record<string, string | number> = {};
  if (mode === 'bfs' && bfsResult) {
    Object.entries(bfsResult.distances).forEach(([v, d]) => {
      vertexMetricMap[v] = d === Infinity ? '∞' : `${d}h`;
    });
  } else if (dfsResult) {
    Object.keys(dfsResult.discoveryTimes).forEach((v) => {
      const d = dfsResult.discoveryTimes[v];
      const f = dfsResult.finishingTimes[v];
      if (d && f) {
        vertexMetricMap[v] = `${d}/${f}`;
      }
    });
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-sky-400 text-xs font-mono">
            <Compass className="w-4 h-4" />
            <span>UNIT IV — GRAPHS</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Network Traversal — BFS and DFS</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Hop-distance discovery via Breadth-First Search and edge classification/timestamps via Depth-First Search.
          </p>
        </div>

        {/* Algorithm Controls */}
        <div className="flex items-center gap-3">
          <select
            value={startVertex}
            onChange={(e) => setStartVertex(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:border-cyan-500 outline-none"
          >
            {vertices.map((v) => (
              <option key={v.id} value={v.id}>
                Start: {v.label} ({v.id})
              </option>
            ))}
          </select>

          <button
            onClick={handleRun}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-sky-500/20 text-xs"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Execute Traversal</span>
          </button>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs font-semibold">
        <button
          onClick={() => {
            setMode('bfs');
            if (!bfsResult) handleRun();
          }}
          className={`flex-1 py-2 rounded-lg transition-all ${
            mode === 'bfs' ? 'bg-sky-950 text-sky-300 font-bold border border-sky-800' : 'text-slate-400 hover:text-white'
          }`}
        >
          Breadth-First Search (Hop Distance)
        </button>
        <button
          onClick={() => {
            setMode('dfs-recursive');
            if (!dfsResult) handleRun();
          }}
          className={`flex-1 py-2 rounded-lg transition-all ${
            mode === 'dfs-recursive' ? 'bg-sky-950 text-sky-300 font-bold border border-sky-800' : 'text-slate-400 hover:text-white'
          }`}
        >
          Depth-First Search (Recursive + Edge Classification)
        </button>
        <button
          onClick={() => {
            setMode('dfs-iterative');
            if (!dfsResult) handleRun();
          }}
          className={`flex-1 py-2 rounded-lg transition-all ${
            mode === 'dfs-iterative' ? 'bg-sky-950 text-sky-300 font-bold border border-sky-800' : 'text-slate-400 hover:text-white'
          }`}
        >
          Depth-First Search (Iterative Call Stack)
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-950/80 border border-red-800 text-xs text-red-200">
          {errorMsg}
        </div>
      )}

      {/* Visual Canvas */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-400 px-1">
          <span>
            {mode === 'bfs'
              ? 'BFS Active Frontier (Tags show hop distance from source):'
              : 'DFS Traversal Frontier (Tags show Discovery / Finishing timestamps d/f):'}
          </span>
          <span className="text-sky-400 font-mono">Root Source: {startVertex}</span>
        </div>
        <GraphVisualizer
          vertices={vertices}
          edges={edges}
          isDirected={graph.getIsDirected()}
          selectedVertexId={startVertex}
          highlightedVertices={highlightedVertices}
          vertexMetricMap={vertexMetricMap}
          height={400}
        />
      </div>

      {/* Traversal Results & Step Audits */}
      {mode === 'bfs' && bfsResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
          {/* Summary */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h2 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>BFS Traversal Statistics</span>
            </h2>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Reachable Vertices:</span>
                <span className="text-emerald-400 font-bold">{bfsResult.reachableCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Unreachable:</span>
                <span className="text-amber-400 font-bold">{bfsResult.unreachableVertices.length}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-bold text-[11px] uppercase">Traversal Sequence:</span>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {bfsResult.traversalOrder.map((id, idx) => (
                  <span key={id} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-sky-300">
                    {idx + 1}. {id}
                  </span>
                ))}
              </div>
            </div>

            {bfsResult.unreachableVertices.length > 0 && (
              <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/60 text-amber-200 text-[11px] font-sans">
                <strong>Disconnected Island Detected: </strong>
                Vertices [{bfsResult.unreachableVertices.join(', ')}] have no path from {startVertex}.
              </div>
            )}
          </div>

          {/* Hop Distance Table */}
          <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h2 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-cyan-400" />
              <span>Hop Distance Table & Breadth-First Tree Parents</span>
            </h2>
            <div className="overflow-x-auto max-h-60">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                    <th className="py-2 px-3">Vertex</th>
                    <th className="py-2 px-3">Hop Count</th>
                    <th className="py-2 px-3">Parent in BFS Tree</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {vertices.map((v) => {
                    const dist = bfsResult.distances[v.id];
                    const parent = bfsResult.parents[v.id];
                    const isReached = dist !== Infinity;
                    return (
                      <tr key={v.id} className="hover:bg-slate-950/50">
                        <td className="py-2 px-3 text-white font-bold">{v.id}</td>
                        <td className="py-2 px-3 text-cyan-400">{isReached ? `${dist} hops` : '∞ (Unreachable)'}</td>
                        <td className="py-2 px-3 text-slate-300">{parent || (v.id === startVertex ? 'ROOT' : '—')}</td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] ${
                              isReached ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                            }`}
                          >
                            {isReached ? 'REACHED' : 'UNREACHED'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* DFS Results & Edge Classifications */}
      {mode !== 'bfs' && dfsResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
          {/* Timestamps Card */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h2 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Discovery & Finishing Times (d/f)</span>
            </h2>
            <div className="overflow-y-auto max-h-64 space-y-1">
              {vertices.map((v) => (
                <div key={v.id} className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-slate-300 font-bold">{v.id}:</span>
                  <span className="text-amber-400">
                    d={dfsResult.discoveryTimes[v.id] || '—'} / f={dfsResult.finishingTimes[v.id] || '—'}
                  </span>
                </div>
              ))}
            </div>

            {dfsResult.hasCycle && (
              <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-[11px] font-sans flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>Cycle detected! Back-edge encountered during traversal.</span>
              </div>
            )}
          </div>

          {/* Edge Classifications */}
          <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h2 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>DFS Edge Classification (Tree, Back, Forward, Cross)</span>
            </h2>
            <div className="overflow-x-auto max-h-64">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                    <th className="py-2 px-3">Edge (u → v)</th>
                    <th className="py-2 px-3">Classification</th>
                    <th className="py-2 px-3">Theoretical Meaning</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {dfsResult.classifiedEdges.map((ce, idx) => (
                    <tr key={idx} className="hover:bg-slate-950/50">
                      <td className="py-2 px-3 text-cyan-300 font-bold">
                        {ce.edge.source} → {ce.edge.target}
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            ce.type === 'tree'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : ce.type === 'back'
                              ? 'bg-red-950 text-red-400 border border-red-800'
                              : ce.type === 'forward'
                              ? 'bg-blue-950 text-blue-400 border border-blue-800'
                              : 'bg-purple-950 text-purple-400 border border-purple-800'
                          }`}
                        >
                          {ce.type} Edge
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-300 text-[11px] font-sans">{ce.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
