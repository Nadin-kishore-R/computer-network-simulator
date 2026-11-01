import React, { useState } from 'react';
import { useNetwork } from '../context/NetworkContext';
import { GraphVisualizer } from '../components/GraphVisualizer';
import { Prim } from '../algorithms/prim';
import { Kruskal } from '../algorithms/kruskal';
import { Cable, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const CablingMSTPage: React.FC = () => {
  const { graph } = useNetwork();
  const vertices = graph.getAllVertices();
  const edges = graph.getAllEdges();

  const [primStartVertex, setPrimStartVertex] = useState<string>('R-Core');

  const primResult = React.useMemo(() => {
    return Prim.compute(graph, primStartVertex);
  }, [graph, primStartVertex]);

  const kruskalResult = React.useMemo(() => {
    return Kruskal.compute(graph);
  }, [graph]);

  const weightsMatch = primResult.totalWeight === kruskalResult.totalWeight;

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-amber-700 text-xs font-semibold uppercase tracking-wider">
            <Cable className="w-4 h-4 text-amber-600" />
            <span>Infrastructure Cabling Architecture</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Network Cabling Optimization — Prim & Kruskal</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Constructing loop-free, minimum-cost physical cabling infrastructure across enterprise network backbones.
          </p>
        </div>

        {/* Verification Badge */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-3 font-mono text-xs shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <div>
              <span className="text-slate-500">MST Equivalence: </span>
              <span className={weightsMatch ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                {weightsMatch ? 'VERIFIED (Equal Weight)' : 'DISCONNECTED (Spanning Forest)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Selector Tabs & Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-mono font-medium">Prim's Total Weight</div>
            <div className="text-2xl font-bold text-emerald-700 font-mono mt-0.5">{primResult.totalWeight}</div>
            <div className="text-[11px] text-slate-500 font-mono">{primResult.mstEdges.length} edges selected</div>
          </div>
          <div className="text-right">
            <label className="text-[10px] text-slate-600 font-medium block mb-1">Start Vertex:</label>
            <select
              value={primStartVertex}
              onChange={(e) => setPrimStartVertex(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-800 font-mono outline-none shadow-xs"
            >
              {vertices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.id}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-mono font-medium">Kruskal's Total Weight</div>
            <div className="text-2xl font-bold text-emerald-700 font-mono mt-0.5">{kruskalResult.totalWeight}</div>
            <div className="text-[11px] text-slate-500 font-mono">{kruskalResult.mstEdges.length} edges selected</div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-600 font-medium block mb-1">Partition Union:</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-mono text-cyan-800 font-bold">
              Rank + Path Comp
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-mono font-medium">Cycle-Forming Edges Rejected</div>
            <div className="text-2xl font-bold text-red-700 font-mono mt-0.5">{kruskalResult.rejectedEdges.length}</div>
            <div className="text-[11px] text-slate-500 font-mono">Prevented Network Loops</div>
          </div>
          <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 font-mono text-xs font-bold">
            Loop Free
          </div>
        </div>
      </div>

      {/* Visual Canvas: Green for MST Edges, Red dashed for Rejected Edges */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-500 px-1">
          <span>
            Minimum Spanning Tree Topology: <strong className="text-emerald-700">Green solid lines</strong> indicate selected cabling. <strong className="text-red-700">Red dashed lines</strong> indicate rejected redundant loops.
          </span>
          <span className="text-amber-800 font-mono font-semibold">Total Cabling Metric: {kruskalResult.totalWeight}</span>
        </div>
        <GraphVisualizer
          vertices={vertices}
          edges={edges}
          mstEdges={kruskalResult.mstEdges}
          rejectedEdges={kruskalResult.rejectedEdges}
          height={420}
        />
      </div>

      {/* Selected vs Rejected Edges Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
        {/* Selected MST Edges */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-900 font-sans flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Selected Minimum Spanning Tree Edges ({kruskalResult.mstEdges.length})</span>
            </span>
            <span className="text-emerald-700 text-xs font-mono font-bold">Weight: {kruskalResult.totalWeight}</span>
          </h2>

          <div className="overflow-x-auto max-h-60">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[11px] bg-slate-50">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Connection (u — v)</th>
                  <th className="py-2.5 px-3 text-right">Link Weight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {kruskalResult.mstEdges.map((e, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="py-2 px-3 text-slate-500 font-bold">{idx + 1}</td>
                    <td className="py-2 px-3 text-slate-900 font-semibold">
                      {e.source} <span className="text-emerald-700 font-bold">⟷</span> {e.target}
                    </td>
                    <td className="py-2 px-3 text-right text-emerald-700 font-bold">{e.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rejected Cycle-Forming Edges */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-900 font-sans flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Rejected Cycle-Forming Links ({kruskalResult.rejectedEdges.length})</span>
            </span>
            <span className="text-red-700 text-xs font-mono font-bold">Loops Prevented</span>
          </h2>

          <div className="overflow-x-auto max-h-60">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[11px] bg-slate-50">
                  <th className="py-2.5 px-3">Link</th>
                  <th className="py-2.5 px-3">Weight</th>
                  <th className="py-2.5 px-3">Partition Rejection Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {kruskalResult.rejectedEdges.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="py-2 px-3 text-red-700 font-semibold">
                      {r.edge.source} ⟷ {r.edge.target}
                    </td>
                    <td className="py-2 px-3 text-red-700 font-bold">{r.edge.weight}</td>
                    <td className="py-2 px-3 text-slate-600 text-[11px] font-sans">{r.reason}</td>
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
