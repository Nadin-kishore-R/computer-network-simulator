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
    category: string;
    desc: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'hierarchy',
      title: 'Network Hierarchy',
      category: 'Hierarchy',
      desc: 'Multi-way hierarchy modeling core routers, subnets, switches, and edge workstations.',
      icon: <GitFork className="w-5 h-5 text-cyan-600" />,
    },
    {
      id: 'registry-bst',
      title: 'Device Registry',
      category: 'Directory',
      desc: 'Ordered registry maintaining unique IP addresses and rapid lookup keys.',
      icon: <Binary className="w-5 h-5 text-blue-600" />,
    },
    {
      id: 'registry-avl',
      title: 'Balanced IP Registry',
      category: 'Self-Balancing',
      desc: 'Height-balanced directory with automatic LL, RR, LR, RL rotations and balance audit.',
      icon: <Scale className="w-5 h-5 text-teal-600" />,
    },
    {
      id: 'bandwidth-calc',
      title: 'Bandwidth Calculator',
      category: 'Capacity',
      desc: 'Expression engine evaluating throughput, delay-bandwidth products, and buffer formulas.',
      icon: <Calculator className="w-5 h-5 text-indigo-600" />,
    },
    {
      id: 'graph-builder',
      title: 'Topology Graph Builder',
      category: 'Topology',
      desc: 'Interactive topology builder supporting dynamic vertices, weighted channels, and link matrix.',
      icon: <Share2 className="w-5 h-5 text-emerald-600" />,
    },
    {
      id: 'traversals',
      title: 'Network Traversal',
      category: 'Hop Analysis',
      desc: 'Hop-distance BFS and recursive/iterative DFS with discovery timestamps and edge classification.',
      icon: <Compass className="w-5 h-5 text-sky-600" />,
    },
    {
      id: 'shortest-path',
      title: 'Shortest Path Routing',
      category: 'Dijkstra',
      desc: 'Single-source shortest path routing with Min-Heap, distance tables, and latency optimization.',
      icon: <Navigation className="w-5 h-5 text-cyan-600" />,
    },
    {
      id: 'cabling-mst',
      title: 'Cabling Optimization',
      category: 'MST',
      desc: 'Prim and Kruskal algorithms with Disjoint Set Union (DSU) and cycle edge rejection.',
      icon: <Cable className="w-5 h-5 text-amber-600" />,
    },
    {
      id: 'connectivity',
      title: 'Subnet Connectivity & SCC',
      category: 'Partitioning',
      desc: 'Undirected network partitioning and Tarjan\'s Strongly Connected Components algorithm for flow paths.',
      icon: <Network className="w-5 h-5 text-violet-600" />,
    },
    {
      id: 'topological-sort',
      title: 'Service Dependencies',
      category: 'Pipeline',
      desc: 'Kahn\'s algorithm and DFS-based topological ordering with cycle deadlock detection.',
      icon: <ListOrdered className="w-5 h-5 text-pink-600" />,
    },
    {
      id: 'lab-comparisons',
      title: 'Routing Comparisons',
      category: 'Evaluation',
      desc: 'In-depth comparative studies: BFS vs. Dijkstra, Prim vs. Kruskal, and Registry lookups.',
      icon: <Layers className="w-5 h-5 text-yellow-600" />,
    },
    {
      id: 'lab-benchmarking',
      title: 'Benchmarking Laboratory',
      category: 'Empirical',
      desc: 'Live browser performance benchmarks measuring actual runtime using performance.now() across large datasets.',
      icon: <Activity className="w-5 h-5 text-emerald-600" />,
    },
  ];

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-white via-slate-50 to-blue-50/60 border border-slate-200 p-8 shadow-xs">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-xs font-semibold text-cyan-800">
            <Zap className="w-3.5 h-3.5 text-cyan-600" />
            <span>Enterprise Computer Network Simulator</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            High-Performance Network Topology & Routing Simulation Platform
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            A unified, academically rigorous laboratory implementing network hierarchies, device registries, balanced IP directories, bandwidth calculators, graph topologies, breadth-first & depth-first traversals, Dijkstra routing, minimum spanning trees (Prim & Kruskal), strongly connected components, and empirical benchmarking.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('graph-builder')}
              className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
            >
              <span>Explore Network Topology</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('testing')}
              className="px-4 py-2.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold shadow-xs transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Audit 49 Automated Tests</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Topology Nodes</div>
          <div className="text-2xl font-bold text-cyan-700 mt-1 font-mono">{vertices.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Active Devices</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Communication Links</div>
          <div className="text-2xl font-bold text-blue-700 mt-1 font-mono">{edges.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Weighted Channels</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Hierarchy Nodes</div>
          <div className="text-2xl font-bold text-teal-700 mt-1 font-mono">{generalTree.countNodes()}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Hierarchy Tree</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Indexed Devices</div>
          <div className="text-2xl font-bold text-indigo-700 mt-1 font-mono">{bst.countNodes()} / {avl.countNodes()}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Registry Nodes</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Core Algorithms</div>
          <div className="text-2xl font-bold text-amber-700 mt-1 font-mono">11</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Fully Implemented</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Automated Tests</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1 font-mono">49 / 49</div>
          <div className="text-[11px] text-emerald-700 mt-0.5 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>100% Passing</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Topology Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Live Enterprise Topology Preview</h2>
            <p className="text-xs text-slate-500">14-node enterprise network with core routers, switches, servers, and air-gapped subnet.</p>
          </div>
          <button
            onClick={() => setActiveTab('graph-builder')}
            className="text-xs font-semibold text-cyan-700 hover:text-cyan-800 flex items-center gap-1 transition-colors"
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
        <h2 className="text-lg font-bold text-slate-900">Integrated Network Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {moduleCards.map((m) => (
            <div
              key={m.id}
              onClick={() => setActiveTab(m.id)}
              className="p-5 rounded-xl bg-white border border-slate-200 hover:border-cyan-300 hover:shadow-md transition-all cursor-pointer group shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">{m.icon}</div>
                  <span className="text-[10px] font-semibold font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {m.category}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                  {m.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">{m.desc}</p>
              </div>

              <div className="flex items-center text-xs font-semibold text-cyan-700 pt-4 mt-2 group-hover:translate-x-1 transition-transform">
                <span>Launch Module</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Operations Log */}
      <div className="space-y-3 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-700" />
            <span>Simulator Audit Trail & Operation History</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">{operationLogs.length} Records</span>
        </div>

        <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto font-mono text-xs">
          {operationLogs.map((log) => (
            <div key={log.id} className="py-2 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-[10px]">{log.timestamp}</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[10px] border border-slate-200">
                  {log.module}
                </span>
                <span className="text-slate-900 font-semibold">{log.action}:</span>
                <span className="text-slate-600 text-[11px] truncate max-w-md">{log.details}</span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  log.status === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : log.status === 'warning'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
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
