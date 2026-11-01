import React, { useState } from 'react';
import { useNetwork } from '../context/NetworkContext';
import { GraphVisualizer } from '../components/GraphVisualizer';
import { Dijkstra } from '../algorithms/dijkstra';
import { DijkstraResult } from '../types/graph';
import { Navigation, Play, AlertCircle, CheckCircle2, ListOrdered, Route } from 'lucide-react';

export const ShortestPathPage: React.FC = () => {
  const { graph } = useNetwork();
  const vertices = graph.getAllVertices();
  const edges = graph.getAllEdges();

  const [sourceId, setSourceId] = useState<string>('R-Core');
  const [destId, setDestId] = useState<string>('SRV-DB');

  const [result, setResult] = useState<DijkstraResult | null>(() => {
    try {
      return Dijkstra.compute(graph, 'R-Core', 'SRV-DB');
    } catch {
      return null;
    }
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCompute = () => {
    setErrorMsg(null);
    try {
      const res = Dijkstra.compute(graph, sourceId, destId);
      setResult(res);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
      setResult(null);
    }
  };

  // Convert shortest path to edge pairs for visualizer
  const pathEdges: { source: string; target: string }[] = [];
  if (result && result.shortestPath.length > 1) {
    for (let i = 0; i < result.shortestPath.length - 1; i++) {
      pathEdges.push({
        source: result.shortestPath[i],
        target: result.shortestPath[i + 1],
      });
    }
  }

  const vertexMetricMap: Record<string, string | number> = {};
  if (result) {
    Object.entries(result.distances).forEach(([v, d]) => {
      vertexMetricMap[v] = d === Infinity ? '∞' : `${d}ms`;
    });
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono">
            <Navigation className="w-4 h-4" />
            <span>UNIT IV — GRAPHS</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Shortest Path Routing — Dijkstra Algorithm</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Single-source shortest path routing with Min-Priority Queue, non-negative weight checks, and path reconstruction.
          </p>
        </div>

        {/* Source & Destination Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">From:</span>
            <select
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-cyan-300 font-mono focus:border-cyan-500 outline-none"
            >
              {vertices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label} ({v.id})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">To:</span>
            <select
              value={destId}
              onChange={(e) => setDestId(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-emerald-300 font-mono focus:border-cyan-500 outline-none"
            >
              {vertices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label} ({v.id})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCompute}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-cyan-500/20 text-xs"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Find Shortest Path</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-950/80 border border-red-800 text-xs text-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Shortest Path Summary Banner */}
      {result && (
        <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-800/60 flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-cyan-950/80 border border-cyan-700/60 text-cyan-400">
              <Route className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-mono">Optimal Network Path:</div>
              {result.isReachable ? (
                <div className="text-base font-bold text-white font-mono flex items-center gap-2">
                  <span>{result.shortestPath.join(' → ')}</span>
                </div>
              ) : (
                <div className="text-sm font-bold text-red-400 font-mono">
                  Destination is completely unreachable (Disconnected component)
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 font-mono">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase">Shortest Metric</div>
              <div className="text-xl font-bold text-cyan-300">
                {result.shortestDistance === Infinity ? '∞' : `${result.shortestDistance} ms`}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase">Total Hops</div>
              <div className="text-xl font-bold text-blue-300">
                {result.shortestPath.length > 0 ? result.shortestPath.length - 1 : 0}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visual Canvas with Luminous Cyan Shortest Path */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-400 px-1">
          <span>Shortest Path highlighted in luminous cyan. Vertex tags indicate minimum distance from source.</span>
          <span className="text-cyan-400 font-mono">Source: {sourceId} | Target: {destId}</span>
        </div>
        <GraphVisualizer
          vertices={vertices}
          edges={edges}
          isDirected={graph.getIsDirected()}
          selectedVertexId={sourceId}
          targetVertexId={destId}
          highlightedPathEdges={pathEdges}
          highlightedVertices={result?.shortestPath || []}
          vertexMetricMap={vertexMetricMap}
          height={420}
        />
      </div>

      {/* Distance Table & Step Audit */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
          {/* Distance Table */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h2 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Full Distance & Predecessor Table</span>
            </h2>
            <div className="overflow-x-auto max-h-64">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                    <th className="py-2 px-3">Vertex</th>
                    <th className="py-2 px-3">d[v]</th>
                    <th className="py-2 px-3">Previous (π)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {vertices.map((v) => (
                    <tr
                      key={v.id}
                      className={
                        result.shortestPath.includes(v.id) ? 'bg-cyan-950/30' : 'hover:bg-slate-950/50'
                      }
                    >
                      <td className="py-2 px-3 text-white font-bold">{v.id}</td>
                      <td className="py-2 px-3 text-cyan-300">
                        {result.distances[v.id] === Infinity ? '∞' : `${result.distances[v.id]} ms`}
                      </td>
                      <td className="py-2 px-3 text-slate-400">
                        {result.previous[v.id] || (v.id === sourceId ? 'SOURCE' : '—')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Relaxation Steps */}
          <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h2 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-cyan-400" />
              <span>Priority Queue Relaxations & Execution Steps</span>
            </h2>
            <div className="overflow-y-auto max-h-64 space-y-2">
              {result.steps.map((s) => (
                <div
                  key={s.step}
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold">Step {s.step}:</span>
                    <span className="text-cyan-400">Settled: {s.settled.length} / {vertices.length}</span>
                  </div>
                  <p className="text-slate-300 font-sans">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
