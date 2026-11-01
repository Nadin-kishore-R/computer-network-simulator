import React, { useState } from 'react';
import { useNetwork } from '../context/NetworkContext';
import { TreeVisualizer, avlNodeToVisual } from '../components/TreeVisualizer';
import { RotationStep } from '../types/tree';
import { Plus, Trash2, Scale, CheckCircle2, History, Zap } from 'lucide-react';

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
      logOperation('BalancedRegistry', 'Inserted Key', res.message || `Key ${keyNum} inserted.`);
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
      logOperation('BalancedRegistry', 'Deleted Key', res.message || `Key ${keyNum} deleted.`);
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
      avl.insert({ key: 30, id: 'n30', name: 'Gateway 30', ip: '10.0.0.30', deviceType: 'router', status: 'online' });
      avl.insert({ key: 20, id: 'n20', name: 'Switch 20', ip: '10.0.0.20', deviceType: 'switch', status: 'online' });
      const res = avl.insert({ key: 10, id: 'n10', name: 'Host 10', ip: '10.0.0.10', deviceType: 'workstation', status: 'online' });
      setLatestRotations(res.rotations);
      setStatusMessage('Triggered LL Rotation (Right Rotation) around 30 using pivot 20.');
    } else if (type === 'RR') {
      avl.insert({ key: 10, id: 'n10', name: 'Host 10', ip: '10.0.0.10', deviceType: 'workstation', status: 'online' });
      avl.insert({ key: 20, id: 'n20', name: 'Switch 20', ip: '10.0.0.20', deviceType: 'switch', status: 'online' });
      const res = avl.insert({ key: 30, id: 'n30', name: 'Gateway 30', ip: '10.0.0.30', deviceType: 'router', status: 'online' });
      setLatestRotations(res.rotations);
      setStatusMessage('Triggered RR Rotation (Left Rotation) around 10 using pivot 20.');
    } else if (type === 'LR') {
      avl.insert({ key: 30, id: 'n30', name: 'Gateway 30', ip: '10.0.0.30', deviceType: 'router', status: 'online' });
      avl.insert({ key: 10, id: 'n10', name: 'Host 10', ip: '10.0.0.10', deviceType: 'workstation', status: 'online' });
      const res = avl.insert({ key: 20, id: 'n20', name: 'Switch 20', ip: '10.0.0.20', deviceType: 'switch', status: 'online' });
      setLatestRotations(res.rotations);
      setStatusMessage('Triggered LR Double Rotation: Left rotation on 10, then Right rotation on 30.');
    } else if (type === 'RL') {
      avl.insert({ key: 10, id: 'n10', name: 'Host 10', ip: '10.0.0.10', deviceType: 'workstation', status: 'online' });
      avl.insert({ key: 30, id: 'n30', name: 'Gateway 30', ip: '10.0.0.30', deviceType: 'router', status: 'online' });
      const res = avl.insert({ key: 20, id: 'n20', name: 'Switch 20', ip: '10.0.0.20', deviceType: 'switch', status: 'online' });
      setLatestRotations(res.rotations);
      setStatusMessage('Triggered RL Double Rotation: Right rotation on 30, then Left rotation on 10.');
    }

    triggerUpdate();
    logOperation('BalancedRegistry', `${type} Demo`, `Executed preset demonstrative ${type} rotation.`);
  };

  const isBST = avl.verifyBST();
  const isBalanced = avl.verifyAVLBalance();

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-teal-700 text-xs font-semibold uppercase tracking-wider">
            <Scale className="w-4 h-4 text-teal-600" />
            <span>Balanced IP Routing Architecture</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Self-Balancing IP Registry</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict height-balanced directory enforcing |Balance Factor| ≤ 1 through LL, RR, LR, and RL rotations.
          </p>
        </div>

        {/* Real-time Verification Badges */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 shadow-xs flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-slate-500">Ordering: </span>
            <span className="text-emerald-700 font-bold">{isBST ? 'VERIFIED' : 'VIOLATED'}</span>
          </div>
          <div className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 shadow-xs flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span className="text-slate-500">Balance: </span>
            <span className="text-teal-700 font-bold">{isBalanced ? 'BALANCED' : 'IMBALANCED'}</span>
          </div>
        </div>
      </div>

      {/* Preset Rotation Demo Bar */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
        <span className="font-semibold text-slate-800 flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-600" />
          <span>Interactive Rotation Demonstrators:</span>
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => triggerRotationDemo('LL')}
            className="px-3 py-1.5 rounded-lg bg-white border border-cyan-300 hover:bg-cyan-50 text-cyan-800 font-mono font-medium shadow-xs transition-colors"
          >
            Demo LL (Right Rotate)
          </button>
          <button
            onClick={() => triggerRotationDemo('RR')}
            className="px-3 py-1.5 rounded-lg bg-white border border-blue-300 hover:bg-blue-50 text-blue-800 font-mono font-medium shadow-xs transition-colors"
          >
            Demo RR (Left Rotate)
          </button>
          <button
            onClick={() => triggerRotationDemo('LR')}
            className="px-3 py-1.5 rounded-lg bg-white border border-teal-300 hover:bg-teal-50 text-teal-800 font-mono font-medium shadow-xs transition-colors"
          >
            Demo LR (Double Rotate)
          </button>
          <button
            onClick={() => triggerRotationDemo('RL')}
            className="px-3 py-1.5 rounded-lg bg-white border border-purple-300 hover:bg-purple-50 text-purple-800 font-mono font-medium shadow-xs transition-colors"
          >
            Demo RL (Double Rotate)
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
          {errorMsg}
        </div>
      )}
      {statusMessage && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
          {statusMessage}
        </div>
      )}

      {/* Interactive Visualizer Canvas */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-500 px-1">
          <span>Balanced Hierarchy. Top badges show Balance Factor (BF = h_left - h_right). Pink nodes indicate rotation pivot.</span>
          <span className="text-teal-700 font-mono font-semibold">Tree Height: {avl.getHeight(root)}</span>
        </div>
        <TreeVisualizer root={visualRoot} height={380} />
      </div>

      {/* Mutation & Rotation History */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Insert */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Plus className="w-4 h-4 text-teal-600" />
            <span>Insert Device (Auto-Balance)</span>
          </h2>
          <form onSubmit={handleInsert} className="space-y-2 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-0.5">Device Key (Integer)</label>
              <input
                type="number"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="e.g. 27"
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 font-mono focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-0.5">Device Name</label>
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="e.g. Router Core 27"
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>Insert with Auto-Balance</span>
            </button>
          </form>
        </div>

        {/* Delete */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-red-600" />
            <span>Delete Node (Auto-Rebalance)</span>
          </h2>
          <div className="space-y-2 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-0.5">Key to Remove</label>
              <input
                type="number"
                value={deleteKey}
                onChange={(e) => setDeleteKey(e.target.value)}
                placeholder="e.g. 30"
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 font-mono focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
              />
            </div>
            <button
              onClick={handleDelete}
              className="w-full py-2.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-300 text-red-700 font-semibold flex items-center justify-center gap-1.5 transition-colors mt-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete and Rebalance</span>
            </button>
          </div>
        </div>

        {/* Rotation Audit Log */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-amber-600" />
            <span>Step-by-Step Rotation Log</span>
          </h2>
          <div className="space-y-2 max-h-48 overflow-y-auto font-mono text-xs">
            {avl.getRotationHistory().length > 0 ? (
              avl.getRotationHistory().slice(-4).reverse().map((step, idx) => (
                <div key={idx} className="p-2 rounded bg-slate-50 border border-slate-200 text-[11px] space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-amber-800">{step.type} Rotation</span>
                    <span className="text-slate-500">Node {step.unbalancedKey}</span>
                  </div>
                  <p className="text-slate-600 text-[10px] leading-tight">{step.description}</p>
                </div>
              ))
            ) : (
              <div className="text-slate-400 italic text-xs">No rotations recorded yet. Insert keys or click demo buttons above.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
