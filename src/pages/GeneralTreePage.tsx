import React, { useState } from 'react';
import { useNetwork } from '../context/NetworkContext';
import { TreeVisualizer, generalTreeNodeToVisual } from '../components/TreeVisualizer';
import { GeneralTreeNode, NetworkDeviceType } from '../types/tree';
import { Plus, Trash2, Search, GitFork, Info } from 'lucide-react';

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-700 text-xs font-semibold uppercase tracking-wider">
            <GitFork className="w-4 h-4 text-cyan-600" />
            <span>Network Hierarchy Architecture</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Enterprise Network Hierarchy</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Hierarchical model of enterprise network infrastructure (Routers, Departments, Switches, and Hosts).
          </p>
        </div>

        {/* Tree Metrics */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 shadow-xs">
            <span className="text-slate-500">Total Nodes: </span>
            <span className="text-cyan-700 font-bold">{generalTree.countNodes()}</span>
          </div>
          <div className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 shadow-xs">
            <span className="text-slate-500">Hierarchy Height: </span>
            <span className="text-blue-700 font-bold">{generalTree.calculateHeight()}</span>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
          {errorMsg}
        </div>
      )}

      {/* Interactive Visualizer Canvas */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>Click any node circle to inspect its properties, parent, and direct links.</span>
          {selectedNode && (
            <span className="text-cyan-700 font-mono font-medium">
              Selected: <strong className="text-slate-900">{selectedNode.name}</strong> ({selectedNode.id})
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
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Plus className="w-4 h-4 text-cyan-600" />
            <span>Add Child Node</span>
          </h2>
          <form onSubmit={handleAddChild} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Parent Node ID</label>
              <input
                type="text"
                value={parentIdInput}
                onChange={(e) => setParentIdInput(e.target.value)}
                placeholder="Parent ID (e.g. dept-a)"
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 font-mono focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 font-medium mb-1">New Node ID</label>
                <input
                  type="text"
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  placeholder="e.g. switch-a3"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 font-mono focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Device Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as NetworkDeviceType)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
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
              <label className="block text-slate-700 font-medium mb-1">Display Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Core Switch Floor 3"
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">IP Address / Subnet (Optional)</label>
              <input
                type="text"
                value={newIp}
                onChange={(e) => setNewIp(e.target.value)}
                placeholder="e.g. 10.1.3.1"
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 font-mono focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Attach Node to Hierarchy</span>
            </button>
          </form>
        </div>

        {/* 2. Selected Node Inspector */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600" />
            <span>Node Inspector & Metrics</span>
          </h2>

          {selectedNode ? (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Node ID:</span>
                  <span className="text-cyan-700 font-bold">{selectedNode.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Name:</span>
                  <span className="text-slate-900 font-semibold">{selectedNode.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Type:</span>
                  <span className="text-blue-700 uppercase font-semibold">{selectedNode.type}</span>
                </div>
                {selectedNode.ip && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">IP:</span>
                    <span className="text-slate-700">{selectedNode.ip}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtree Height:</span>
                  <span className="text-teal-700 font-semibold">{generalTree.calculateHeight(selectedNode)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Node Depth:</span>
                  <span className="text-teal-700 font-semibold">{generalTree.calculateDepth(selectedNode.id)}</span>
                </div>
              </div>

              {/* Parent Info */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px]">
                <span className="text-slate-500">Immediate Parent: </span>
                {selectedParent ? (
                  <span className="text-cyan-800 font-mono font-medium">
                    {selectedParent.name} ({selectedParent.id})
                  </span>
                ) : (
                  <span className="text-amber-700 italic font-mono font-medium">Root Node (No Parent)</span>
                )}
              </div>

              {/* Children List */}
              <div className="space-y-1">
                <span className="text-slate-600 font-medium text-[11px]">Direct Connected Children ({selectedNode.children.length}):</span>
                {selectedNode.children.length > 0 ? (
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {selectedNode.children.map((child) => (
                      <div
                        key={child.id}
                        onClick={() => setSelectedNodeId(child.id)}
                        className="p-1.5 rounded bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700 hover:text-cyan-700 hover:bg-slate-100 cursor-pointer flex justify-between"
                      >
                        <span className="font-medium">{child.name}</span>
                        <span className="text-slate-500">{child.id}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-slate-500 italic text-[11px]">Leaf device (0 direct downstream nodes)</div>
                )}
              </div>

              <button
                onClick={() => handleRemoveNode(selectedNode.id)}
                className="w-full py-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-semibold flex items-center justify-center gap-1.5 transition-colors"
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
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Search className="w-4 h-4 text-emerald-600" />
            <span>Search & Hierarchy Order</span>
          </h2>

          {/* Search Box */}
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Node ID (e.g. switch-a1)"
              className="flex-1 px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-800 font-mono focus:border-cyan-500 outline-none"
            />
            <button
              onClick={handleSearch}
              className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs text-cyan-800 border border-slate-300 font-semibold"
            >
              Search
            </button>
          </div>

          {searchResult && (
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
              Found: <strong className="font-mono">{searchResult.name}</strong> ({searchResult.id})
            </div>
          )}

          {/* Traversals Tabs */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200 text-xs">
              {(['preorder', 'postorder', 'levelorder'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTraversalType(t)}
                  className={`flex-1 py-1.5 rounded-md font-medium capitalize transition-all ${
                    traversalType === t ? 'bg-white text-cyan-800 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono max-h-40 overflow-y-auto space-y-1">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-semibold">
                {traversalType} Order Sequence:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {getTraversalList().map((n, idx) => (
                  <span
                    key={n.id}
                    onClick={() => setSelectedNodeId(n.id)}
                    className="px-2 py-0.5 rounded bg-white border border-slate-200 text-cyan-800 hover:border-cyan-400 cursor-pointer text-[11px] shadow-xs"
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
      <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs space-y-1 text-slate-600 font-mono shadow-xs">
        <span className="text-cyan-800 font-bold">Hierarchy Complexity Bounds:</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
          <div>Search / Node Count: <span className="text-slate-900 font-semibold">O(n)</span></div>
          <div>Pre/Post/Level Order: <span className="text-slate-900 font-semibold">O(n)</span></div>
          <div>Depth / Height: <span className="text-slate-900 font-semibold">O(n)</span></div>
        </div>
      </div>
    </div>
  );
};
