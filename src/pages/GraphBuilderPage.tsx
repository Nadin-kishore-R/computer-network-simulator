import React, { useState } from 'react';
import { useNetwork } from '../context/NetworkContext';
import { GraphVisualizer } from '../components/GraphVisualizer';
import { Graph } from '../algorithms/graph';
import { GraphVertex } from '../types/graph';
import { Share2, Plus, Trash2, Edit3, Grid, List, RefreshCw, AlertCircle } from 'lucide-react';

export const GraphBuilderPage: React.FC = () => {
  const { graph, setGraph, triggerUpdate, logOperation } = useNetwork();

  const [activeTab, setActiveTab] = useState<'visual' | 'matrix' | 'list'>('visual');

  // Vertex input
  const [newVertexId, setNewVertexId] = useState('');
  const [newVertexLabel, setNewVertexLabel] = useState('');
  const [newVertexType, setNewVertexType] = useState<GraphVertex['type']>('router');
  const [newVertexIp, setNewVertexIp] = useState('');

  // Edge input
  const [edgeSource, setEdgeSource] = useState('');
  const [edgeTarget, setEdgeTarget] = useState('');
  const [edgeWeight, setEdgeWeight] = useState('5');

  // Edge weight update
  const [selectedEdgeId, setSelectedEdgeId] = useState('');
  const [updateWeightValue, setUpdateWeightValue] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const vertices = graph.getAllVertices();
  const edges = graph.getAllEdges();
  const isDirected = graph.getIsDirected();
  const isWeighted = graph.getIsWeighted();

  const handleToggleDirected = (directed: boolean) => {
    graph.setIsDirected(directed);
    triggerUpdate();
    logOperation('Graph', 'Toggled Graph Type', `Graph converted to ${directed ? 'Directed' : 'Undirected'}.`);
  };

  const handleToggleWeighted = (weighted: boolean) => {
    graph.setIsWeighted(weighted);
    triggerUpdate();
    logOperation('Graph', 'Toggled Metric Type', `Graph set to ${weighted ? 'Weighted' : 'Unweighted'}.`);
  };

  const handleAddVertex = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!newVertexId.trim()) return;

    try {
      graph.addVertex({
        id: newVertexId.trim(),
        label: newVertexLabel.trim() || newVertexId.trim(),
        type: newVertexType,
        ip: newVertexIp.trim() || undefined,
        x: Math.floor(200 + Math.random() * 500),
        y: Math.floor(100 + Math.random() * 300),
      });
      triggerUpdate();
      logOperation('Graph', 'Added Vertex', `Added device node "${newVertexId}".`);
      setNewVertexId('');
      setNewVertexLabel('');
      setNewVertexIp('');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    }
  };

  const handleRemoveVertex = (id: string) => {
    setErrorMsg(null);
    const removed = graph.removeVertex(id);
    if (removed) {
      triggerUpdate();
      logOperation('Graph', 'Removed Vertex', `Removed node "${id}" and incident links.`);
    }
  };

  const handleAddEdge = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!edgeSource || !edgeTarget) {
      setErrorMsg('Select both source and target vertices.');
      return;
    }

    try {
      const wt = parseFloat(edgeWeight);
      graph.addEdge({
        source: edgeSource,
        target: edgeTarget,
        weight: isNaN(wt) ? 1 : wt,
      });
      triggerUpdate();
      logOperation('Graph', 'Added Edge', `Linked "${edgeSource}" -> "${edgeTarget}" (weight: ${wt}).`);
      setEdgeSource('');
      setEdgeTarget('');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    }
  };

  const handleUpdateEdgeWeight = () => {
    setErrorMsg(null);
    const wt = parseFloat(updateWeightValue);
    if (isNaN(wt) || !selectedEdgeId) return;

    const ok = graph.updateEdgeWeight(selectedEdgeId, wt);
    if (ok) {
      triggerUpdate();
      logOperation('Graph', 'Updated Weight', `Updated link "${selectedEdgeId}" weight to ${wt}.`);
      setSelectedEdgeId('');
      setUpdateWeightValue('');
    }
  };

  const loadPreset = (preset: 'enterprise' | 'dag' | 'cyclic') => {
    if (preset === 'enterprise') {
      setGraph(Graph.createSampleNetwork());
    } else if (preset === 'dag') {
      setGraph(Graph.createSampleDAG());
    } else {
      setGraph(Graph.createSampleCyclicGraph());
    }
    triggerUpdate();
    logOperation('Graph', 'Loaded Preset', `Loaded template: ${preset.toUpperCase()}`);
  };

  const { vertexOrder, matrix } = graph.getAdjacencyMatrix();
  const listMap = graph.getAdjacencyListMap();

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono">
            <Share2 className="w-4 h-4" />
            <span>UNIT IV — GRAPHS</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Network Topology Graph Builder</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Complete Graph ADT supporting directed/undirected, weighted/unweighted graphs with dynamic modifications.
          </p>
        </div>

        {/* Configuration Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Directed / Undirected */}
          <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800 text-xs font-mono">
            <button
              onClick={() => handleToggleDirected(false)}
              className={`px-3 py-1 rounded-md transition-all ${
                !isDirected ? 'bg-cyan-950 text-cyan-400 font-bold border border-cyan-800' : 'text-slate-400'
              }`}
            >
              Undirected
            </button>
            <button
              onClick={() => handleToggleDirected(true)}
              className={`px-3 py-1 rounded-md transition-all ${
                isDirected ? 'bg-cyan-950 text-cyan-400 font-bold border border-cyan-800' : 'text-slate-400'
              }`}
            >
              Directed
            </button>
          </div>

          {/* Weighted / Unweighted */}
          <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800 text-xs font-mono">
            <button
              onClick={() => handleToggleWeighted(true)}
              className={`px-3 py-1 rounded-md transition-all ${
                isWeighted ? 'bg-blue-950 text-blue-400 font-bold border border-blue-800' : 'text-slate-400'
              }`}
            >
              Weighted
            </button>
            <button
              onClick={() => handleToggleWeighted(false)}
              className={`px-3 py-1 rounded-md transition-all ${
                !isWeighted ? 'bg-blue-950 text-blue-400 font-bold border border-blue-800' : 'text-slate-400'
              }`}
            >
              Unweighted
            </button>
          </div>
        </div>
      </div>

      {/* Preset Network Templates */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-slate-300">Preset Academic Topologies:</span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => loadPreset('enterprise')}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500 text-cyan-300 font-mono transition-colors"
          >
            14-Node Enterprise (Default)
          </button>
          <button
            onClick={() => loadPreset('dag')}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-blue-500 text-blue-300 font-mono transition-colors"
          >
            Acyclic DAG Pipeline
          </button>
          <button
            onClick={() => loadPreset('cyclic')}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-red-500 text-red-300 font-mono transition-colors"
          >
            Cyclic Dependency Network
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-950/80 border border-red-800 text-xs text-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Visualization / Matrix / List Mode Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('visual')}
              className={`px-4 py-1.5 rounded-md flex items-center gap-2 font-medium transition-all ${
                activeTab === 'visual' ? 'bg-slate-800 text-cyan-400 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Topology Visualizer</span>
            </button>
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-4 py-1.5 rounded-md flex items-center gap-2 font-medium transition-all ${
                activeTab === 'matrix' ? 'bg-slate-800 text-cyan-400 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Adjacency Matrix</span>
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-1.5 rounded-md flex items-center gap-2 font-medium transition-all ${
                activeTab === 'list' ? 'bg-slate-800 text-cyan-400 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Adjacency List</span>
            </button>
          </div>

          <span className="text-xs text-slate-500 font-mono">
            {vertices.length} Vertices | {edges.length} Edges
          </span>
        </div>

        {/* Tab 1: Interactive Canvas */}
        {activeTab === 'visual' && (
          <GraphVisualizer
            vertices={vertices}
            edges={edges}
            isDirected={isDirected}
            height={440}
          />
        )}

        {/* Tab 2: Adjacency Matrix */}
        {activeTab === 'matrix' && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto shadow-inner">
            <h3 className="text-xs font-bold text-slate-300 font-mono mb-3">
              Adjacency Matrix (Size {vertexOrder.length} × {vertexOrder.length})
            </h3>
            <table className="text-xs font-mono text-center border-collapse">
              <thead>
                <tr>
                  <th className="p-2 border border-slate-800 bg-slate-900 text-slate-500">v / u</th>
                  {vertexOrder.map((v) => (
                    <th key={v} className="p-2 border border-slate-800 bg-slate-900 text-cyan-400 font-semibold">
                      {v}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrix.map((row, i) => (
                  <tr key={vertexOrder[i]}>
                    <td className="p-2 border border-slate-800 bg-slate-900 text-cyan-400 font-semibold">
                      {vertexOrder[i]}
                    </td>
                    {row.map((val, j) => (
                      <td
                        key={j}
                        className={`p-2 border border-slate-800 ${
                          val === null
                            ? 'text-slate-700 bg-slate-950'
                            : val === 0
                            ? 'text-slate-500 bg-slate-900/50'
                            : 'text-emerald-400 font-bold bg-emerald-950/20'
                        }`}
                      >
                        {val === null ? '—' : val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Adjacency List */}
        {activeTab === 'list' && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
            <h3 className="text-xs font-bold text-slate-300 font-sans mb-3">
              Adjacency List Mapping:
            </h3>
            <div className="space-y-2">
              {Object.entries(listMap).map(([u, neighbors]) => (
                <div key={u} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-3">
                  <span className="font-bold text-cyan-400 shrink-0 w-24">[{u}]:</span>
                  <div className="flex flex-wrap gap-2">
                    {neighbors.length > 0 ? (
                      neighbors.map((n, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-200">
                          → {n.target} <span className="text-emerald-400 font-semibold">({n.weight})</span>
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-600 italic">No outgoing neighbors (isolated / sink)</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Editing Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Add Vertex */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Add Vertex (Node)</span>
          </h2>
          <form onSubmit={handleAddVertex} className="space-y-2 text-xs">
            <div>
              <label className="block text-slate-400 mb-0.5">Vertex ID</label>
              <input
                type="text"
                value={newVertexId}
                onChange={(e) => setNewVertexId(e.target.value)}
                placeholder="e.g. Router-Edge"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:border-cyan-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-0.5">Device Type</label>
              <select
                value={newVertexType}
                onChange={(e) => setNewVertexType(e.target.value as GraphVertex['type'])}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 outline-none"
              >
                <option value="router">Router</option>
                <option value="switch">Switch</option>
                <option value="server">Server</option>
                <option value="firewall">Firewall</option>
                <option value="gateway">Gateway</option>
                <option value="workstation">Workstation</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-0.5">IP Address (Optional)</label>
              <input
                type="text"
                value={newVertexIp}
                onChange={(e) => setNewVertexIp(e.target.value)}
                placeholder="e.g. 10.0.5.1"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:border-cyan-500 outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Vertex to Graph</span>
            </button>
          </form>
        </div>

        {/* 2. Add Edge */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-blue-400" />
            <span>Add Edge (Link)</span>
          </h2>
          <form onSubmit={handleAddEdge} className="space-y-2 text-xs">
            <div>
              <label className="block text-slate-400 mb-0.5">Source Vertex</label>
              <select
                value={edgeSource}
                onChange={(e) => setEdgeSource(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:border-cyan-500 outline-none"
                required
              >
                <option value="">Select source</option>
                {vertices.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label} ({v.id})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-0.5">Target Vertex</label>
              <select
                value={edgeTarget}
                onChange={(e) => setEdgeTarget(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:border-cyan-500 outline-none"
                required
              >
                <option value="">Select target</option>
                {vertices.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label} ({v.id})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-0.5">Link Metric / Weight (Latency ms)</label>
              <input
                type="number"
                value={edgeWeight}
                onChange={(e) => setEdgeWeight(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:border-cyan-500 outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 transition-all mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>Connect Link</span>
            </button>
          </form>
        </div>

        {/* 3. Manage Vertices & Update Weight */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4 text-xs">
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-amber-400" />
              <span>Update Link Weight</span>
            </h2>
            <div className="flex gap-2">
              <select
                value={selectedEdgeId}
                onChange={(e) => setSelectedEdgeId(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:border-cyan-500 outline-none"
              >
                <option value="">Select link</option>
                {edges.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.source} → {e.target} (wt: {e.weight})
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={updateWeightValue}
                onChange={(e) => setUpdateWeightValue(e.target.value)}
                placeholder="New wt"
                className="w-20 px-2 py-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-white text-xs outline-none"
              />
            </div>
            <button
              onClick={handleUpdateEdgeWeight}
              className="w-full py-2 rounded-lg bg-amber-950 hover:bg-amber-900 border border-amber-800 text-amber-300 font-semibold transition-colors"
            >
              Update Weight
            </button>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-slate-400 font-semibold block">Quick Remove Vertex:</span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {vertices.map((v) => (
                <button
                  key={v.id}
                  onClick={() => handleRemoveVertex(v.id)}
                  className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-red-400 hover:border-red-800 flex items-center gap-1 text-[11px] font-mono transition-colors"
                >
                  <span>{v.id}</span>
                  <Trash2 className="w-3 h-3 text-red-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
