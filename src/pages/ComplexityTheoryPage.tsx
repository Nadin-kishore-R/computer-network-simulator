import React from 'react';
import { ComplexityTheory } from '../analysis/complexity';
import { Cpu, BookOpen, Sigma } from 'lucide-react';

export const ComplexityTheoryPage: React.FC = () => {
  const notations = ComplexityTheory.getAsymptoticNotations();
  const profiles = ComplexityTheory.getAlgorithmProfiles();

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-purple-700 text-xs font-semibold uppercase tracking-wider">
          <Cpu className="w-4 h-4 text-purple-600" />
          <span>Algorithmic Complexity & Bounds</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">Theoretical Complexity Reference Matrix</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Formal asymptotic definitions, recurrence relations, Master Theorem bounds, and amortized complexity profiles.
        </p>
      </div>

      {/* Asymptotic Notations Cards */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sigma className="w-4 h-4 text-purple-600" />
          <span>Formal Asymptotic Growth Notations</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {notations.map((n, idx) => (
            <div key={idx} className="p-5 rounded-xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-cyan-800 font-mono">{n.notation}</span>
                <span className="text-xs text-purple-700 font-bold">{n.name}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-800">
                {n.mathematicalDefinition}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">{n.intuitiveMeaning}</p>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <strong className="text-cyan-800 font-mono">Network Analogy: </strong>
                {n.networkingAnalogy}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Master Theorem & Recurrence Relations Callout */}
      <div className="p-5 rounded-xl bg-purple-50/50 border border-purple-200 space-y-3 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-purple-700" />
          <span>Divide-and-Conquer Recurrences & Master Theorem</span>
        </h2>
        <p className="text-xs text-slate-700 font-sans leading-relaxed">
          For algorithmic recurrences of the form <strong className="text-slate-900 font-mono">T(n) = a·T(n/b) + f(n)</strong> (where a ≥ 1, b &gt; 1):
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-xs">
            <span className="text-cyan-800 font-bold block mb-1">Case 1: Leaves Dominate</span>
            <span className="text-slate-500">If f(n) = O(n^(log_b(a) - ε)), then:</span>
            <div className="text-slate-900 font-bold mt-1">T(n) = Θ(n^(log_b a))</div>
          </div>
          <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-xs">
            <span className="text-purple-800 font-bold block mb-1">Case 2: Balanced Levels</span>
            <span className="text-slate-500">If f(n) = Θ(n^(log_b a) · log^k n), then:</span>
            <div className="text-slate-900 font-bold mt-1">T(n) = Θ(n^(log_b a) · log^(k+1) n)</div>
          </div>
          <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-xs">
            <span className="text-emerald-800 font-bold block mb-1">Case 3: Root Dominates</span>
            <span className="text-slate-500">If f(n) = Ω(n^(log_b(a) + ε)), then:</span>
            <div className="text-slate-900 font-bold mt-1">T(n) = Θ(f(n))</div>
          </div>
        </div>
      </div>

      {/* Comprehensive Algorithm Complexity Matrix Table */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Implemented Network Algorithms & Routing Protocols Master Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-[11px] bg-slate-50">
                <th className="py-2.5 px-3">Protocol / Algorithm</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Best Case</th>
                <th className="py-2.5 px-3">Average Case</th>
                <th className="py-2.5 px-3">Worst Case</th>
                <th className="py-2.5 px-3">Space Complexity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {profiles.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-3 text-cyan-800 font-bold">{p.name}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-semibold">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-emerald-700 font-semibold">{p.bestTime}</td>
                  <td className="py-2.5 px-3 text-cyan-800 font-semibold">{p.averageTime}</td>
                  <td className="py-2.5 px-3 text-amber-700 font-semibold">{p.worstTime}</td>
                  <td className="py-2.5 px-3 text-slate-600">{p.spaceComplexity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
