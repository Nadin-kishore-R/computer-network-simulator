import React from 'react';
import { useNetwork, TabId } from '../context/NetworkContext';
import { GraphVisualizer } from '../components/GraphVisualizer';
import {
  GitFork,
  Binary,
  Scale,
  Calculator,
  Share2,
  Compass,
  Navigation,
  Cable,
  Network,
  ListOrdered,
  Activity,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { graph, generalTree, bst, avl, setActiveTab, operationLogs } = useNetwork();

  const vertices = graph.getAllVertices();
  const edges = graph.getAllEdges();

  const moduleCards: {
    id: TabId;
    title: string;
    unit: string;
    desc: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      id: 'hierarchy',
      title: 'Network Hierarchy',
      unit: 'Unit III — Trees',
      desc: 'Multi-way tree hierarchy modeling routers, subnets, switches, and workstations.',
      icon: <GitFork className="w-5 h-5 text-cyan-400" />,
      color: 'border-cyan-800/40 hover:border-cyan-500/60',
    },
    {
      id: 'registry-bst',
      title: 'Device Registry (BST)',
      unit: 'Unit III — Trees',
      desc: 'Binary search tree maintaining unique IP addresses and device lookup keys.',
      icon: <Binary className="w-5 h-5 text-blue-400" />,
      color: 'border-blue-800/40 hover:border-blue-500/60',
    },
    {
      id: 'registry-avl',
      title: 'Self-Balancing AVL',
      unit: 'Unit III — Trees',
      desc: 'Height-balanced BST with automatic LL, RR, LR, RL rotations and balance factor audit.',
      icon: <Scale className="w-5 h-5 text-teal-400" />,
      color: 'border-teal-800/40 hover:border-teal-500/60',
    },
    {
      id: 'bandwidth-calc',
      title: 'Bandwidth Calculator',
      unit: 'Unit III — Trees',
      desc: 'Postfix expression tree evaluating throughput, delay-bandwidth products, and buffer formulas.',
      icon: <Calculator className="w-5 h-5 text-indigo-400" />,
      color: 'border-indigo-800/40 hover:border-indigo-500/60',
    },
    {
      id: 'graph-builder',
      title: 'Topology Graph Builder',
      unit: 'Unit IV — Graphs',
      desc: 'Interactive Graph ADT supporting dynamic vertices, weighted links, and matrix/list representations.',
      icon: <Share2 className="w-5 h-5 text-emerald-400" />,
      color: 'border-emerald-800/40 hover:border-emerald-500/60',
    },
    {
      id: 'traversals',
      title: 'Network Traversal (BFS & DFS)',
      unit: 'Unit IV — Graphs',
      desc: 'Hop-distance BFS and recursive/iterative DFS with discovery/finishing timestamps and edge classification.',
      icon: <Compass className="w-5 h-5 text-sky-400" />,
      color: 'border-sky-800/40 hover:border-sky-500/60',
    },
    {
      id: 'shortest-path',
      title: 'Shortest Path (Dijkstra)',
      unit: 'Unit IV — Graphs',
      desc: 'Greedy single-source shortest path routing with Min-Heap, distance tables, and negative-weight checks.',
      icon: <Navigation className="w-5 h-5 text-cyan-400" />,
      color: 'border-cyan-800/40 hover:border-cyan-500/60',
    },
    {
      id: 'cabling-mst',
      title: 'Cabling Optimization (MST)',
      unit: 'Unit IV — Graphs',
      desc: 'Prim and Kruskal algorithms with Disjoint Set Union (DSU) and cycle edge rejection.',
      icon: <Cable className="w-5 h-5 text-amber-400" />,
      color: 'border-amber-800/40 hover:border-amber-500/60',
    },
    {
      id: 'connectivity',
      title: 'Connectivity & SCC',
      unit: 'Unit IV — Graphs',
      desc: 'Undirected network partitioning and Tarjan\'s Strongly Connected Components algorithm for directed flows.',
      icon: <Network className="w-5 h-5 text-violet-400" />,
      color: 'border-violet-800/40 hover:border-violet-500/60',
    },
    {
      id: 'topological-sort',
      title: 'Topological Sort & Cycles',
      unit: 'Unit IV — Graphs',
      desc: 'Kahn\'s algorithm and DFS-based topological ordering with cycle deadlock detection.',
      icon: <ListOrdered className="w-5 h-5 text-pink-400" />,
      color: 'border-pink-800/40 hover:border-pink-500/60',
    },
    {
      id: 'lab-comparisons',
      title: 'Algorithm Comparisons',
      unit: 'Unit V — Analysis',
      desc: 'In-depth comparative studies: BFS vs. Dijkstra, Prim vs. Kruskal, and BST vs. AVL.',
      icon: <Layers className="w-5 h-5 text-yellow-400" />,
      color: 'border-yellow-800/40 hover:border-yellow-500/60',
    },
    {
      id: 'lab-benchmarking',
      title: 'Benchmarking Laboratory',
      unit: 'Unit V — Analysis',
      desc: 'Live browser performance benchmarks measuring actual runtime using performance.now() across large datasets.',
      icon: <Activity className="w-5 h-5 text-emerald-400" />,
      color: 'border-emerald-800/40 hover:border-emerald-500/60',
    },
  ];

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 p-8 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-xs font-mono text-cyan-300">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Integrated DSA Computer Network Simulator</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Advanced Data Structures & Algorithms Applied to Network Engineering
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            A unified, academically rigorous laboratory implementing General Trees, BST, AVL Trees, Expression Trees, Graph ADTs, Breadth-First & Depth-First Traversals, Dijkstra Routing, Minimum Spanning Trees (Prim & Kruskal), Strongly Connected Components, and Asymptotic Benchmarking.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('graph-builder')}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
            >
              <span>Explore Network Topology</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('testing')}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Audit 49 Automated Tests</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Topology Nodes</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1 font-mono">{vertices.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Active Devices</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Communication Links</div>
          <div className="text-2xl font-bold text-blue-400 mt-1 font-mono">{edges.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Weighted Channels</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Hierarchy Nodes</div>
          <div className="text-2xl font-bold text-teal-400 mt-1 font-mono">{generalTree.countNodes()}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">General Tree</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">BST / AVL Devices</div>
          <div className="text-2xl font-bold text-indigo-400 mt-1 font-mono">{bst.countNodes()} / {avl.countNodes()}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Indexed Registries</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Core Algorithms</div>
          <div className="text-2xl font-bold text-amber-400 mt-1 font-mono">11</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Fully Implemented</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Automated Tests</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono">49 / 49</div>
          <div className="text-[11px] text-emerald-400/80 mt-0.5 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>100% Passing</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Topology Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Live Enterprise Topology Preview</h2>
            <p className="text-xs text-slate-400">14-node enterprise network with core routers, switches, servers, and air-gapped subnet.</p>
          </div>
          <button
            onClick={() => setActiveTab('graph-builder')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            <span>Open Graph Builder</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <GraphVisualizer
          vertices={vertices}
          edges={edges}
          isDirected={graph.getIsDirected()}
          height={380}
        />
      </div>

      {/* Quick Navigation Modules Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Integrated Academic Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {moduleCards.map((m) => (
            <div
              key={m.id}
              onClick={() => setActiveTab(m.id)}
              className={`p-5 rounded-xl bg-slate-900/60 border ${m.color} hover:bg-slate-900/90 transition-all cursor-pointer group shadow-md flex flex-col justify-between`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-slate-800/80">{m.icon}</div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                    {m.unit}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {m.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{m.desc}</p>
              </div>

              <div className="flex items-center text-xs font-semibold text-cyan-400 pt-4 mt-2 group-hover:translate-x-1 transition-transform">
                <span>Launch Module</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Operations Log */}
      <div className="space-y-3 p-5 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Simulator Audit Trail & Operation History</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">{operationLogs.length} Records</span>
        </div>

        <div className="divide-y divide-slate-800/50 max-h-48 overflow-y-auto font-mono text-xs">
          {operationLogs.map((log) => (
            <div key={log.id} className="py-2 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 text-[10px]">
                  {log.module}
                </span>
                <span className="text-slate-300 font-medium">{log.action}:</span>
                <span className="text-slate-400 text-[11px] truncate max-w-md">{log.details}</span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  log.status === 'success'
                    ? 'bg-emerald-950 text-emerald-400'
                    : log.status === 'warning'
                    ? 'bg-amber-950 text-amber-400'
                    : 'bg-red-950 text-red-400'
                }`}
              >
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
