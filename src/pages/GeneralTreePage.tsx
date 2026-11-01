import React, { useState } from 'react';
import { useNetwork } from '../context/NetworkContext';
import { TreeVisualizer, generalTreeNodeToVisual } from '../components/TreeVisualizer';
import { GeneralTreeNode, NetworkDeviceType } from '../types/tree';
import { Plus, Trash2, Search, RefreshCw, GitFork, Info } from 'lucide-react';

export const GeneralTreePage: React.FC = () => {
  const { generalTree, triggerUpdate, logOperation } = useNetwork();

  const [selectedNodeId, setSelectedNodeId] = useState<string>('core-router');
  const [parentIdInput, setParentIdInput] = useState<string>('dept-a');
  const [newId, setNewId] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [newType, setNewType] = useState<NetworkDeviceType>('switch');
  const [newIp, setNewIp] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResult, setSearchResult] = useState<GeneralTreeNode | null>(null);
  const [traversalType, setTraversalType] = useState<'preorder' | 'postorder' | 'levelorder'>('preorder');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const root = generalTree.getRoot();
  const visualRoot = generalTreeNodeToVisual(root);

  const selectedNode = selectedNodeId ? generalTree.findNode(selectedNodeId) : null;
  const selectedParent = selectedNodeId ? generalTree.findParent(selectedNodeId) : null;

  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!newId.trim() || !newName.trim()) {
      setErrorMsg('Node ID and Name are required.');
      return;
    }

    try {
      generalTree.addChild(parentIdInput, {
        id: newId.trim(),
        name: newName.trim(),
        type: newType,
        ip: newIp.trim() || undefined,
      });
      triggerUpdate();
      logOperation('GeneralTree', 'Added Node', `Added "${newName}" (${newId}) under parent "${parentIdInput}".`);
      setNewId('');
      setNewName('');
      setNewIp('');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    }
  };

  const handleRemoveNode = (id: string) => {
    setErrorMsg(null);
    if (id === root?.id) {
      if (!window.confirm('Deleting root node will clear the entire tree. Proceed?')) return;
    }
    const success = generalTree.removeNode(id);
    if (success) {
      triggerUpdate();
      logOperation('GeneralTree', 'Removed Node', `Removed node "${id}" and its subtree.`);
      if (selectedNodeId === id) setSelectedNodeId(root?.id || '');
    } else {
      setErrorMsg(`Could not delete node "${id}".`);
    }
  };

  const handleSearch = () => {
    setErrorMsg(null);
    if (!searchQuery.trim()) {
      setSearchResult(null);
      return;
    }
    const found = generalTree.findNode(searchQuery.trim());
    setSearchResult(found);
    if (found) {
      setSelectedNodeId(found.id);
      logOperation('GeneralTree', 'Node Search', `Found node "${found.name}" (ID: ${found.id}).`);
    } else {
      setErrorMsg(`No node found with ID "${searchQuery}".`);
    }
  };

  const getTraversalList = () => {
    if (traversalType === 'preorder') return generalTree.preorderTraversal();
    if (traversalType === 'postorder') return generalTree.postorderTraversal();
    return generalTree.levelOrderTraversal();
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono">
            <GitFork className="w-4 h-4" />
            <span>UNIT III — TREES</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Network Hierarchy — General Tree</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Hierarchical representation of enterprise network infrastructure (Routers, Departments, Switches, and Hosts).
          </p>
        </div>

        {/* Tree Metrics */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-400">Total Nodes: </span>
            <span className="text-cyan-400 font-bold">{generalTree.countNodes()}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-400">Tree Height: </span>
            <span className="text-blue-400 font-bold">{generalTree.calculateHeight()}</span>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-950/80 border border-red-800 text-xs text-red-200">
          {errorMsg}
        </div>
      )}

      {/* Interactive Visualizer Canvas */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Click any node circle to inspect its properties, parent, and children.</span>
          {selectedNode && (
            <span className="text-cyan-400 font-mono">
              Selected: <strong className="text-white">{selectedNode.name}</strong> ({selectedNode.id})
            </span>
          )}
        </div>
        <TreeVisualizer
          root={visualRoot}
          selectedId={selectedNodeId}
          onNodeClick={(id) => setSelectedNodeId(id)}
          height={380}
        />
      </div>

      {/* Operational Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Add Child Node Section */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Add Child Node</span>
          </h2>
          <form onSubmit={handleAddChild} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Parent Node ID</label>
              <input
                type="text"
                value={parentIdInput}
                onChange={(e) => setParentIdInput(e.target.value)}
                placeholder="Parent ID (e.g. dept-a)"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:border-cyan-500 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 mb-1">New Node ID</label>
                <input
                  type="text"
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  placeholder="e.g. switch-a3"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:border-cyan-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Device Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as NetworkDeviceType)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 outline-none"
                >
                  <option value="switch">Switch</option>
                  <option value="router">Router</option>
                  <option value="server">Server</option>
                  <option value="firewall">Firewall</option>
                  <option value="workstation">Workstation</option>
                  <option value="department">Department</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Display Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Core Switch Floor 3"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">IP Address / Subnet (Optional)</label>
              <input
                type="text"
                value={newIp}
                onChange={(e) => setNewIp(e.target.value)}
                placeholder="e.g. 10.1.3.1"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:border-cyan-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Attach Node to Hierarchy</span>
            </button>
          </form>
        </div>

        {/* 2. Selected Node Inspector */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-400" />
            <span>Node Inspector & Metrics</span>
          </h2>

          {selectedNode ? (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Node ID:</span>
                  <span className="text-cyan-400 font-bold">{selectedNode.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Name:</span>
                  <span className="text-white">{selectedNode.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Type:</span>
                  <span className="text-blue-400 uppercase">{selectedNode.type}</span>
                </div>
                {selectedNode.ip && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">IP:</span>
                    <span className="text-slate-300">{selectedNode.ip}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">Node Height:</span>
                  <span className="text-teal-400">{generalTree.calculateHeight(selectedNode)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Node Depth:</span>
                  <span className="text-teal-400">{generalTree.calculateDepth(selectedNode.id)}</span>
                </div>
              </div>

              {/* Parent Info */}
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px]">
                <span className="text-slate-400">Immediate Parent: </span>
                {selectedParent ? (
                  <span className="text-cyan-300 font-mono font-medium">
                    {selectedParent.name} ({selectedParent.id})
                  </span>
                ) : (
                  <span className="text-amber-400 italic font-mono">Root Node (No Parent)</span>
                )}
              </div>

              {/* Children List */}
              <div className="space-y-1">
                <span className="text-slate-400 text-[11px]">Direct Children ({selectedNode.children.length}):</span>
                {selectedNode.children.length > 0 ? (
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {selectedNode.children.map((child) => (
                      <div
                        key={child.id}
                        onClick={() => setSelectedNodeId(child.id)}
                        className="p-1.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 hover:text-cyan-400 cursor-pointer flex justify-between"
                      >
                        <span>{child.name}</span>
                        <span className="text-slate-500">{child.id}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-slate-500 italic text-[11px]">Leaf device (0 children)</div>
                )}
              </div>

              <button
                onClick={() => handleRemoveNode(selectedNode.id)}
                className="w-full py-2 rounded-lg bg-red-950 hover:bg-red-900 border border-red-800 text-red-300 font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Subtree & Node</span>
              </button>
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500 text-xs italic">
              Select any node from the canvas to inspect.
            </div>
          )}
        </div>

        {/* 3. Search & Traversals Section */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Search className="w-4 h-4 text-emerald-400" />
            <span>Search & Tree Traversals</span>
          </h2>

          {/* Search Box */}
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Node ID (e.g. switch-a1)"
              className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:border-cyan-500 outline-none"
            />
            <button
              onClick={handleSearch}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-cyan-400 border border-slate-700 font-semibold"
            >
              Search
            </button>
          </div>

          {searchResult && (
            <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-200">
              Found: <strong className="font-mono">{searchResult.name}</strong> ({searchResult.id})
            </div>
          )}

          {/* Traversals Tabs */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
              {(['preorder', 'postorder', 'levelorder'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTraversalType(t)}
                  className={`flex-1 py-1.5 rounded-md font-medium capitalize transition-all ${
                    traversalType === t ? 'bg-cyan-900/80 text-cyan-300 font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs font-mono max-h-40 overflow-y-auto space-y-1">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                {traversalType} Order Sequence:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {getTraversalList().map((n, idx) => (
                  <span
                    key={n.id}
                    onClick={() => setSelectedNodeId(n.id)}
                    className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 hover:border-cyan-500 cursor-pointer text-[11px]"
                  >
                    {idx + 1}. {n.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Algorithmic Complexity Card */}
      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs space-y-1 text-slate-400 font-mono">
        <span className="text-cyan-400 font-semibold">General Tree Complexity Bounds:</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
          <div>Search / Node Count: <span className="text-white">O(n)</span></div>
          <div>Pre/Post/Level Order: <span className="text-white">O(n)</span></div>
          <div>Depth / Height: <span className="text-white">O(n)</span></div>
        </div>
      </div>
    </div>
  );
};
