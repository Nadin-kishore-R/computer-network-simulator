import React, { useState } from 'react';
import { ExpressionTree, EvaluationResult } from '../trees/expressionTree';
import { TreeVisualizer, expressionNodeToVisual } from '../components/TreeVisualizer';
import { Calculator, Play, AlertCircle, CheckCircle2, BookOpen } from 'lucide-react';

export const ExpressionTreePage: React.FC = () => {
  const [postfixInput, setPostfixInput] = useState<string>('1000 500 + 0.8 *');
  const [treeInstance, setTreeInstance] = useState<ExpressionTree>(() => {
    const t = new ExpressionTree();
    t.buildFromPostfix('1000 500 + 0.8 *');
    return t;
  });

  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(() => {
    const t = new ExpressionTree();
    t.buildFromPostfix('1000 500 + 0.8 *');
    return t.evaluate();
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sampleFormulas = ExpressionTree.getSampleBandwidthFormulas();

  const handleEvaluate = (expr: string) => {
    setErrorMsg(null);
    try {
      const newTree = new ExpressionTree();
      newTree.buildFromPostfix(expr);
      const res = newTree.evaluate();
      setTreeInstance(newTree);
      setEvalResult(res);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
      setEvalResult(null);
    }
  };

  const visualRoot = expressionNodeToVisual(treeInstance.getRoot());

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono">
            <Calculator className="w-4 h-4" />
            <span>UNIT III — TREES</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Bandwidth Calculator — Expression Tree</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Constructs binary expression trees from Reverse Polish Notation (postfix) to evaluate networking bandwidth and latency formulas.
          </p>
        </div>

        {evalResult && (
          <div className="px-4 py-2 rounded-xl bg-indigo-950/70 border border-indigo-800 flex items-center gap-3">
            <span className="text-xs text-slate-400">Evaluated Result:</span>
            <span className="text-xl font-bold text-cyan-300 font-mono">{evalResult.value}</span>
          </div>
        )}
      </div>

      {/* Preset Formula Chips */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
        <span className="text-xs font-semibold text-white flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>Select Networking Metric Formula Template:</span>
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {sampleFormulas.map((f, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPostfixInput(f.postfix);
                handleEvaluate(f.postfix);
              }}
              className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-600/80 text-left transition-all"
            >
              <div className="text-xs font-semibold text-slate-200">{f.label}</div>
              <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{f.postfix}</div>
              <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">{f.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Input bar */}
      <div className="flex gap-2">
        <input
          type="text"
          value={postfixInput}
          onChange={(e) => setPostfixInput(e.target.value)}
          placeholder="Enter postfix expression (e.g. 1500 8 * 100 /)"
          className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:border-cyan-500 outline-none shadow-inner"
        />
        <button
          onClick={() => handleEvaluate(postfixInput)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all text-sm"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Build & Evaluate</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-950/80 border border-red-800 text-xs text-red-200 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Visual Tree */}
      <div className="space-y-1">
        <div className="text-xs text-slate-400 px-1">
          Binary Expression Tree Representation (Operators in Violet, Operands in Cyan):
        </div>
        <TreeVisualizer root={visualRoot} height={320} />
      </div>

      {/* Evaluation Representations & Step-by-Step Table */}
      {evalResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notations Card */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 font-mono text-xs">
            <h2 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Notational Forms</span>
            </h2>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block">Inorder (Fully Parenthesized):</span>
              <span className="text-cyan-300 font-bold break-all">{evalResult.inorder}</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block">Preorder (Prefix / Polish):</span>
              <span className="text-blue-300 break-all">{evalResult.preorder}</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block">Postorder (Postfix / Reverse Polish):</span>
              <span className="text-indigo-300 break-all">{evalResult.postorder}</span>
            </div>
          </div>

          {/* Execution Steps */}
          <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-cyan-400" />
              <span>Step-by-Step Operator Evaluation Audit</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                    <th className="py-2 px-3">Step</th>
                    <th className="py-2 px-3">Sub-Expression</th>
                    <th className="py-2 px-3">Action Description</th>
                    <th className="py-2 px-3 text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {evalResult.steps.map((s) => (
                    <tr key={s.stepNumber} className="hover:bg-slate-950/50">
                      <td className="py-2 px-3 text-slate-500 font-bold">{s.stepNumber}</td>
                      <td className="py-2 px-3 text-indigo-400">{s.subExpression}</td>
                      <td className="py-2 px-3 text-slate-300 text-[11px] font-sans">{s.operation}</td>
                      <td className="py-2 px-3 text-right text-cyan-300 font-bold">{s.result}</td>
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
