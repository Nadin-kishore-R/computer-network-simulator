import React, { useState } from 'react';
import { useNetwork } from '../context/NetworkContext';
import { TreeVisualizer, avlNodeToVisual } from '../components/TreeVisualizer';
import { AVLTree } from '../trees/avl';
import { RotationStep } from '../types/tree';
import { Plus, Trash2, Scale, RefreshCw, CheckCircle2, History, Zap } from 'lucide-react';

export const AVLPage: React.FC = () => {
  const { avl, triggerUpdate, logOperation } = useNetwork();

  const [inputKey, setInputKey] = useState<string>('');
  const [inputName, setInputName] = useState<string>('');
  const [deleteKey, setDeleteKey] = useState<string>('');
  const [latestRotations, setLatestRotations] = useState<RotationStep[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const root = avl.getRoot();
  const visualRoot = avlNodeToVisual(root, [], latestRotations[0]?.pivotKey);

  const handleInsert = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setStatusMessage(null);
    const keyNum = parseInt(inputKey, 10);
    if (isNaN(keyNum)) {
      setErrorMsg('Key must be a valid number.');
      return;
    }

    try {
      const res = avl.insert({
        key: keyNum,
        id: `dev-${keyNum}`,
        name: inputName.trim() || `Node ${keyNum}`,
        ip: `10.0.0.${keyNum}`,
        deviceType: 'router',
        status: 'online',
      });

      triggerUpdate();
      setLatestRotations(res.rotations);
      setStatusMessage(res.message || `Inserted key ${keyNum}`);
      logOperation('AVL', 'Inserted Key', res.message || `Key ${keyNum} inserted.`);
      setInputKey('');
      setInputName('');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    }
  };

  const handleDelete = () => {
    setErrorMsg(null);
    setStatusMessage(null);
    const keyNum = parseInt(deleteKey, 10);
    if (isNaN(keyNum)) {
      setErrorMsg('Enter a key to delete.');
      return;
    }

    const res = avl.delete(keyNum);
    if (res.success) {
      triggerUpdate();
      setLatestRotations(res.rotations);
      setStatusMessage(res.message || `Deleted key ${keyNum}`);
      logOperation('AVL', 'Deleted Key', res.message || `Key ${keyNum} deleted.`);
      setDeleteKey('');
    } else {
      setErrorMsg(res.message || `Key ${keyNum} not found.`);
    }
  };

  // Preset triggers for demonstrative rotations
  const triggerRotationDemo = (type: 'LL' | 'RR' | 'LR' | 'RL') => {
    avl.clear();
    setErrorMsg(null);

    if (type === 'LL') {
      // 30, 20, 10
      avl.insert({ key: 30, id: 'n30', name: 'Gateway 30', ip: '10.0.0.30', deviceType: 'router', status: 'online' });
      avl.insert({ key: 20, id: 'n20', name: 'Switch 20', ip: '10.0.0.20', deviceType: 'switch', status: 'online' });
      const res = avl.insert({ key: 10, id: 'n10', name: 'Host 10', ip: '10.0.0.10', deviceType: 'workstation', status: 'online' });
      setLatestRotations(res.rotations);
      setStatusMessage('Triggered LL Rotation (Right Rotation) around 30 using pivot 20.');
    } else if (type === 'RR') {
      // 10, 20, 30
      avl.insert({ key: 10, id: 'n10', name: 'Host 10', ip: '10.0.0.10', deviceType: 'workstation', status: 'online' });
      avl.insert({ key: 20, id: 'n20', name: 'Switch 20', ip: '10.0.0.20', deviceType: 'switch', status: 'online' });
      const res = avl.insert({ key: 30, id: 'n30', name: 'Gateway 30', ip: '10.0.0.30', deviceType: 'router', status: 'online' });
      setLatestRotations(res.rotations);
      setStatusMessage('Triggered RR Rotation (Left Rotation) around 10 using pivot 20.');
    } else if (type === 'LR') {
      // 30, 10, 20
      avl.insert({ key: 30, id: 'n30', name: 'Gateway 30', ip: '10.0.0.30', deviceType: 'router', status: 'online' });
      avl.insert({ key: 10, id: 'n10', name: 'Host 10', ip: '10.0.0.10', deviceType: 'workstation', status: 'online' });
      const res = avl.insert({ key: 20, id: 'n20', name: 'Switch 20', ip: '10.0.0.20', deviceType: 'switch', status: 'online' });
      setLatestRotations(res.rotations);
      setStatusMessage('Triggered LR Double Rotation: Left rotation on 10, then Right rotation on 30.');
    } else if (type === 'RL') {
      // 10, 30, 20
      avl.insert({ key: 10, id: 'n10', name: 'Host 10', ip: '10.0.0.10', deviceType: 'workstation', status: 'online' });
      avl.insert({ key: 30, id: 'n30', name: 'Gateway 30', ip: '10.0.0.30', deviceType: 'router', status: 'online' });
      const res = avl.insert({ key: 20, id: 'n20', name: 'Switch 20', ip: '10.0.0.20', deviceType: 'switch', status: 'online' });
      setLatestRotations(res.rotations);
      setStatusMessage('Triggered RL Double Rotation: Right rotation on 30, then Left rotation on 10.');
    }

    triggerUpdate();
    logOperation('AVL', `${type} Demo`, `Executed preset demonstrative ${type} rotation.`);
  };

  const isBST = avl.verifyBST();
  const isBalanced = avl.verifyAVLBalance();

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-mono">
            <Scale className="w-4 h-4" />
            <span>UNIT III — TREES</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Self-Balancing IP Registry — AVL Tree</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Strict height-balanced binary search tree enforcing |Balance Factor| ≤ 1 through LL, RR, LR, and RL rotations.
          </p>
        </div>

        {/* Real-time Verification Badges */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400">BST Property: </span>
            <span className="text-emerald-400 font-bold">{isBST ? 'VERIFIED' : 'VIOLATED'}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span className="text-slate-400">AVL Balance: </span>
            <span className="text-teal-400 font-bold">{isBalanced ? 'BALANCED' : 'IMBALANCED'}</span>
          </div>
        </div>
      </div>

      {/* Preset Rotation Demo Bar */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-white flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Interactive Rotation Demonstrators:</span>
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => triggerRotationDemo('LL')}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-cyan-800/80 hover:bg-cyan-950/80 text-cyan-300 font-mono transition-colors"
          >
            Demo LL (Right Rotate)
          </button>
          <button
            onClick={() => triggerRotationDemo('RR')}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-blue-800/80 hover:bg-blue-950/80 text-blue-300 font-mono transition-colors"
          >
            Demo RR (Left Rotate)
          </button>
          <button
            onClick={() => triggerRotationDemo('LR')}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-teal-800/80 hover:bg-teal-950/80 text-teal-300 font-mono transition-colors"
          >
            Demo LR (Double Rotate)
          </button>
          <button
            onClick={() => triggerRotationDemo('RL')}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-purple-800/80 hover:bg-purple-950/80 text-purple-300 font-mono transition-colors"
          >
            Demo RL (Double Rotate)
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-950/80 border border-red-800 text-xs text-red-200">
          {errorMsg}
        </div>
      )}
      {statusMessage && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-200">
          {statusMessage}
        </div>
      )}

      {/* Interactive Visualizer Canvas */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-400 px-1">
          <span>AVL Hierarchy. Top badges show Balance Factor (BF = h_left - h_right). Pink nodes indicate rotation pivot.</span>
          <span className="text-teal-400 font-mono">Tree Height: {avl.getHeight(root)}</span>
        </div>
        <TreeVisualizer root={visualRoot} height={380} />
      </div>

      {/* Mutation & Rotation History */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Insert */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-teal-400" />
            <span>Insert Device (Auto-Balance)</span>
          </h2>
          <form onSubmit={handleInsert} className="space-y-2 text-xs">
            <div>
              <label className="block text-slate-400 mb-0.5">Device Key (Integer)</label>
              <input
                type="number"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="e.g. 27"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:border-teal-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-0.5">Device Name</label>
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="e.g. Router Core 27"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-teal-500 outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-teal-500/20 transition-all mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>Insert with AVL Rotation</span>
            </button>
          </form>
        </div>

        {/* Delete */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-red-400" />
            <span>Delete Node (Auto-Rebalance)</span>
          </h2>
          <div className="space-y-2 text-xs">
            <div>
              <label className="block text-slate-400 mb-0.5">Key to Remove</label>
              <input
                type="number"
                value={deleteKey}
                onChange={(e) => setDeleteKey(e.target.value)}
                placeholder="e.g. 30"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:border-red-500 outline-none"
              />
            </div>
            <button
              onClick={handleDelete}
              className="w-full py-2.5 rounded-lg bg-red-950 hover:bg-red-900 border border-red-800 text-red-300 font-semibold flex items-center justify-center gap-1.5 transition-colors mt-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete and Rebalance</span>
            </button>
          </div>
        </div>

        {/* Rotation Audit Log */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <History className="w-4 h-4 text-amber-400" />
            <span>Step-by-Step Rotation Log</span>
          </h2>
          <div className="space-y-2 max-h-48 overflow-y-auto font-mono text-xs">
            {avl.getRotationHistory().length > 0 ? (
              avl.getRotationHistory().slice(-4).reverse().map((step, idx) => (
                <div key={idx} className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-amber-400">{step.type} Rotation</span>
                    <span className="text-slate-500">Node {step.unbalancedKey}</span>
                  </div>
                  <p className="text-slate-400 text-[10px] leading-tight">{step.description}</p>
                </div>
              ))
            ) : (
              <div className="text-slate-500 italic text-xs">No rotations recorded yet. Insert keys or click demo buttons above.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
