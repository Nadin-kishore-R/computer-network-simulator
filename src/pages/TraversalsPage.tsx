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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-sky-700 text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-4 h-4 text-sky-600" />
            <span>Network Exploration Architecture</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Network Traversal & Hop Analysis</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Hop-distance discovery via Breadth-First Search and edge classification/timestamps via Depth-First Search.
          </p>
        </div>

        {/* Algorithm Controls */}
        <div className="flex items-center gap-3">
          <select
            value={startVertex}
            onChange={(e) => setStartVertex(e.target.value)}
            className="px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-800 font-mono focus:border-cyan-500 outline-none shadow-xs"
          >
            {vertices.map((v) => (
              <option key={v.id} value={v.id}>
                Start: {v.label} ({v.id})
              </option>
            ))}
          </select>

          <button
            onClick={handleRun}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-semibold flex items-center gap-2 shadow-sm text-xs transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Execute Traversal</span>
          </button>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
        <button
          onClick={() => {
            setMode('bfs');
            if (!bfsResult) handleRun();
          }}
          className={`flex-1 py-2 rounded-lg transition-all ${
            mode === 'bfs' ? 'bg-white text-sky-800 font-bold border border-sky-200 shadow-xs' : 'text-slate-600 hover:text-slate-900'
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
            mode === 'dfs-recursive' ? 'bg-white text-sky-800 font-bold border border-sky-200 shadow-xs' : 'text-slate-600 hover:text-slate-900'
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
            mode === 'dfs-iterative' ? 'bg-white text-sky-800 font-bold border border-sky-200 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Depth-First Search (Iterative Call Stack)
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
          {errorMsg}
        </div>
      )}

      {/* Visual Canvas */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-500 px-1">
          <span>
            {mode === 'bfs'
              ? 'BFS Active Frontier (Tags show hop distance from source):'
              : 'DFS Traversal Frontier (Tags show Discovery / Finishing timestamps d/f):'}
          </span>
          <span className="text-sky-800 font-mono font-semibold">Root Source: {startVertex}</span>
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
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900 font-sans flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-600" />
              <span>BFS Traversal Statistics</span>
            </h2>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Reachable Vertices:</span>
                <span className="text-emerald-700 font-bold">{bfsResult.reachableCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Unreachable:</span>
                <span className="text-amber-700 font-bold">{bfsResult.unreachableVertices.length}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-700 font-bold text-[11px] uppercase">Traversal Sequence:</span>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {bfsResult.traversalOrder.map((id, idx) => (
                  <span key={id} className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-sky-800 font-semibold shadow-xs">
                    {idx + 1}. {id}
                  </span>
                ))}
              </div>
            </div>

            {bfsResult.unreachableVertices.length > 0 && (
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-sans">
                <strong>Disconnected Subnet Detected: </strong>
                Vertices [{bfsResult.unreachableVertices.join(', ')}] have no path from {startVertex}.
              </div>
            )}
          </div>

          {/* Hop Distance Table */}
          <div className="lg:col-span-2 p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900 font-sans flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-cyan-600" />
              <span>Hop Distance Table & Breadth-First Parents</span>
            </h2>
            <div className="overflow-x-auto max-h-60">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[11px] bg-slate-50">
                    <th className="py-2.5 px-3">Vertex</th>
                    <th className="py-2.5 px-3">Hop Count</th>
                    <th className="py-2.5 px-3">Parent in BFS Tree</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vertices.map((v) => {
                    const dist = bfsResult.distances[v.id];
                    const parent = bfsResult.parents[v.id];
                    const isReached = dist !== Infinity;
                    return (
                      <tr key={v.id} className="hover:bg-slate-50/70">
                        <td className="py-2.5 px-3 text-slate-900 font-bold">{v.id}</td>
                        <td className="py-2.5 px-3 text-cyan-800 font-semibold">{isReached ? `${dist} hops` : '∞ (Unreachable)'}</td>
                        <td className="py-2.5 px-3 text-slate-600">{parent || (v.id === startVertex ? 'ROOT' : '—')}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              isReached ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
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
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900 font-sans flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Discovery & Finishing Times (d/f)</span>
            </h2>
            <div className="overflow-y-auto max-h-64 space-y-1">
              {vertices.map((v) => (
                <div key={v.id} className="p-2 rounded bg-slate-50 border border-slate-200 flex justify-between">
                  <span className="text-slate-800 font-bold">{v.id}:</span>
                  <span className="text-amber-800 font-semibold">
                    d={dfsResult.discoveryTimes[v.id] || '—'} / f={dfsResult.finishingTimes[v.id] || '—'}
                  </span>
                </div>
              ))}
            </div>

            {dfsResult.hasCycle && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[11px] font-sans flex items-center gap-2 font-medium">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>Cycle detected! Back-edge encountered during traversal.</span>
              </div>
            )}
          </div>

          {/* Edge Classifications */}
          <div className="lg:col-span-2 p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900 font-sans flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-600" />
              <span>DFS Edge Classification (Tree, Back, Forward, Cross)</span>
            </h2>
            <div className="overflow-x-auto max-h-64">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[11px] bg-slate-50">
                    <th className="py-2.5 px-3">Edge (u → v)</th>
                    <th className="py-2.5 px-3">Classification</th>
                    <th className="py-2.5 px-3">Theoretical Meaning</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dfsResult.classifiedEdges.map((ce, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3 text-cyan-800 font-bold">
                        {ce.edge.source} → {ce.edge.target}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            ce.type === 'tree'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : ce.type === 'back'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : ce.type === 'forward'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-purple-50 text-purple-700 border border-purple-200'
                          }`}
                        >
                          {ce.type} Edge
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 text-[11px] font-sans">{ce.description}</td>
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
