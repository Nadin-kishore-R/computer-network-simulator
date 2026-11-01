import React, { useState } from 'react';
import { useNetwork } from '../context/NetworkContext';
import { TreeVisualizer, bstNodeToVisual } from '../components/TreeVisualizer';
import { BinarySearchTree, SearchResult } from '../trees/bst';
import { NetworkDeviceType } from '../types/tree';
import { Plus, Trash2, Search, ArrowLeftRight, Binary, ShieldAlert, Check } from 'lucide-react';

export const BSTPage: React.FC = () => {
  const { bst, triggerUpdate, logOperation } = useNetwork();

  const [insertKey, setInsertKey] = useState<string>('');
  const [insertName, setInsertName] = useState<string>('');
  const [insertIp, setInsertIp] = useState<string>('');
  const [insertType, setInsertType] = useState<NetworkDeviceType>('switch');

  const [searchKey, setSearchKey] = useState<string>('');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

  const [deleteKey, setDeleteKey] = useState<string>('');
  const [queryKey, setQueryKey] = useState<string>('40');
  const [rangeMin, setRangeMin] = useState<string>('20');
  const [rangeMax, setRangeMax] = useState<string>('60');
  const [rangeResults, setRangeResults] = useState<number[]>([]);

  const [highlightedKeys, setHighlightedKeys] = useState<number[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const root = bst.getRoot();
  const visualRoot = bstNodeToVisual(root, highlightedKeys);

  const handleInsert = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    const keyNum = parseInt(insertKey, 10);
    if (isNaN(keyNum)) {
      setErrorMsg('Key must be a valid integer.');
      return;
    }

    try {
      bst.insert({
        key: keyNum,
        id: `dev-${keyNum}`,
        name: insertName.trim() || `Device ${keyNum}`,
        ip: insertIp.trim() || `192.168.1.${keyNum}`,
        deviceType: insertType,
        status: 'online',
      });
      triggerUpdate();
      setSuccessMsg(`Inserted device key ${keyNum} into registry.`);
      logOperation('DeviceRegistry', 'Inserted Key', `Inserted device key ${keyNum} (${insertName || `Device ${keyNum}`}).`);
      setInsertKey('');
      setInsertName('');
      setInsertIp('');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    }
  };

  const handleSearch = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    const keyNum = parseInt(searchKey, 10);
    if (isNaN(keyNum)) {
      setErrorMsg('Enter a valid key to search.');
      return;
    }

    const result = bst.search(keyNum);
    setSearchResult(result);
    setHighlightedKeys(result.path);

    if (result.found) {
      setSuccessMsg(`Device key ${keyNum} found in ${result.comparisons} comparisons! Search path: [${result.path.join(' -> ')}]`);
      logOperation('DeviceRegistry', 'Key Search', `Found key ${keyNum} in ${result.comparisons} steps.`);
    } else {
      setErrorMsg(`Device key ${keyNum} not found. Path explored: [${result.path.join(' -> ')}]`);
    }
  };

  const handleDelete = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    const keyNum = parseInt(deleteKey, 10);
    if (isNaN(keyNum)) {
      setErrorMsg('Enter a valid key to delete.');
      return;
    }

    const deleted = bst.delete(keyNum);
    if (deleted) {
      triggerUpdate();
      setSuccessMsg(`Deleted device key ${keyNum} from registry.`);
      logOperation('DeviceRegistry', 'Deleted Key', `Removed key ${keyNum} from registry.`);
      setDeleteKey('');
      setHighlightedKeys([]);
    } else {
      setErrorMsg(`Key ${keyNum} does not exist in registry.`);
    }
  };

  const handleRangeQuery = () => {
    const min = parseInt(rangeMin, 10);
    const max = parseInt(rangeMax, 10);
    if (isNaN(min) || isNaN(max)) return;

    const res = bst.rangeQuery(min, max);
    const keys = res.map((n) => n.key);
    setRangeResults(keys);
    setHighlightedKeys(keys);
  };

  const minNode = bst.findMin();
  const maxNode = bst.findMax();
  const targetKeyNum = parseInt(queryKey, 10);
  const predecessor = !isNaN(targetKeyNum) ? bst.findPredecessor(targetKeyNum) : null;
  const successor = !isNaN(targetKeyNum) ? bst.findSuccessor(targetKeyNum) : null;

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-blue-700 text-xs font-semibold uppercase tracking-wider">
            <Binary className="w-4 h-4 text-blue-600" />
            <span>Device Directory Architecture</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Device Registry Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Keyed network device registry supporting O(log n) lookups, range queries, and min/max bounds.
          </p>
        </div>

        {/* Tree Stats */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 shadow-xs">
            <span className="text-slate-500">Registry Count: </span>
            <span className="text-cyan-700 font-bold">{bst.countNodes()}</span>
          </div>
          <div className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 shadow-xs">
            <span className="text-slate-500">Tree Height: </span>
            <span className="text-blue-700 font-bold">{bst.calculateHeight()}</span>
          </div>
          <div className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 shadow-xs">
            <span className="text-slate-500">Ordering Valid: </span>
            <span className="text-emerald-700 font-bold">{bst.isValidBST() ? 'TRUE' : 'FALSE'}</span>
          </div>
        </div>
      </div>

      {/* Duplicate Policy Banner */}
      <div className="p-3.5 rounded-lg bg-blue-50 border border-blue-200 flex items-start gap-2.5 text-xs text-blue-900 shadow-xs">
        <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Duplicate Policy: </span>
          <span>{BinarySearchTree.DUPLICATE_POLICY}</span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Interactive Canvas */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-500 px-1">
          <span>Binary Directory Layout. Green nodes indicate search path or range query results.</span>
          <span className="text-cyan-800 font-mono font-medium">Min: {minNode?.key ?? 'N/A'} | Max: {maxNode?.key ?? 'N/A'}</span>
        </div>
        <TreeVisualizer root={visualRoot} height={380} />
      </div>

      {/* Operations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Insert Node */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Plus className="w-4 h-4 text-cyan-600" />
            <span>Insert Device Node</span>
          </h2>
          <form onSubmit={handleInsert} className="space-y-2 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-0.5">Numeric Device Key</label>
              <input
                type="number"
                value={insertKey}
                onChange={(e) => setInsertKey(e.target.value)}
                placeholder="e.g. 45"
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 font-mono focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-0.5">Device Name</label>
              <input
                type="text"
                value={insertName}
                onChange={(e) => setInsertName(e.target.value)}
                placeholder="e.g. Edge Switch Beta"
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-0.5">Device Type</label>
              <select
                value={insertType}
                onChange={(e) => setInsertType(e.target.value as NetworkDeviceType)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
              >
                <option value="switch">Switch</option>
                <option value="router">Router</option>
                <option value="server">Server</option>
                <option value="firewall">Firewall</option>
                <option value="workstation">Workstation</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>Insert into Directory</span>
            </button>
          </form>
        </div>

        {/* 2. Search & Delete */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-600" />
              <span>Search Key with Path Audit</span>
            </h2>
            <div className="flex gap-2">
              <input
                type="number"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                placeholder="Search key (e.g. 40)"
                className="flex-1 px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-800 font-mono focus:border-cyan-500 outline-none"
              />
              <button
                onClick={handleSearch}
                className="px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-xs text-emerald-800 border border-emerald-300 font-semibold"
              >
                Search
              </button>
            </div>
            {searchResult && (
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-800">
                <div>Found: <span className={searchResult.found ? 'text-emerald-700 font-bold' : 'text-red-700 font-bold'}>{String(searchResult.found)}</span></div>
                <div>Comparisons: {searchResult.comparisons}</div>
                <div>Path: [{searchResult.path.join(' -> ')}]</div>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-200">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-red-600" />
              <span>Delete Node (3 Cases)</span>
            </h2>
            <div className="flex gap-2">
              <input
                type="number"
                value={deleteKey}
                onChange={(e) => setDeleteKey(e.target.value)}
                placeholder="Key to delete"
                className="flex-1 px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-800 font-mono focus:border-cyan-500 outline-none"
              />
              <button
                onClick={handleDelete}
                className="px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-xs text-red-700 border border-red-300 font-semibold"
              >
                Delete
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              Handles Case 1 (Leaf), Case 2 (Single Child), and Case 3 (Two Children using in-order successor).
            </p>
          </div>
        </div>

        {/* 3. Range Query & Successor/Predecessor */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-amber-600" />
              <span>Successor & Predecessor</span>
            </h2>
            <input
              type="number"
              value={queryKey}
              onChange={(e) => setQueryKey(e.target.value)}
              placeholder="Query Key"
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-800 font-mono outline-none"
            />
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Predecessor:</span>
                <span className="text-amber-800 font-bold">{predecessor ? predecessor.key : 'None'}</span>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Successor:</span>
                <span className="text-amber-800 font-bold">{successor ? successor.key : 'None'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-200 text-xs">
            <span className="font-bold text-slate-900 block">Range Query [min, max]</span>
            <div className="flex gap-2">
              <input
                type="number"
                value={rangeMin}
                onChange={(e) => setRangeMin(e.target.value)}
                placeholder="Min"
                className="w-1/2 px-2 py-1.5 rounded bg-white border border-slate-300 font-mono text-slate-800 text-xs"
              />
              <input
                type="number"
                value={rangeMax}
                onChange={(e) => setRangeMax(e.target.value)}
                placeholder="Max"
                className="w-1/2 px-2 py-1.5 rounded bg-white border border-slate-300 font-mono text-slate-800 text-xs"
              />
              <button
                onClick={handleRangeQuery}
                className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-cyan-800 font-semibold text-xs border border-slate-300"
              >
                Run
              </button>
            </div>
            {rangeResults.length > 0 && (
              <div className="p-2 rounded bg-slate-50 border border-slate-200 text-[11px] font-mono text-cyan-800 font-medium">
                Nodes in [{rangeMin}, {rangeMax}]: [{rangeResults.join(', ')}]
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Traversal Outputs */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2 font-mono text-xs">
        <div className="font-bold uppercase text-[11px] text-cyan-800">Sorted Inorder Traversal (LVR):</div>
        <div className="flex flex-wrap gap-1.5">
          {bst.inorderTraversal().map((n) => (
            <span key={n.key} className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-cyan-800 text-[11px]">
              {n.key} ({n.name})
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
