import React from 'react';
import { useNetwork, TabId } from '../context/NetworkContext';
import {
  LayoutDashboard,
  GitFork,
  Binary,
  Scale,
  Calculator,
  Share2,
  Compass,
  Navigation as NavigationIcon,
  Cable,
  Network,
  ListOrdered,
  Layers,
  Activity,
  BookOpen,
  CheckCircle2,
  RefreshCw,
  Cpu,
} from 'lucide-react';

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

interface NavGroup {
  groupName: string;
  items: NavItem[];
}

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, resetAllToDefault } = useNetwork();

  const navGroups: NavGroup[] = [
    {
      groupName: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Mission Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      ],
    },
    {
      groupName: 'UNIT III — TREES',
      items: [
        { id: 'hierarchy', label: 'Network Hierarchy (General Tree)', icon: <GitFork className="w-4 h-4 text-cyan-400" /> },
        { id: 'registry-bst', label: 'Device Registry (BST)', icon: <Binary className="w-4 h-4 text-blue-400" /> },
        { id: 'registry-avl', label: 'Self-Balancing IP Registry (AVL)', icon: <Scale className="w-4 h-4 text-teal-400" /> },
        { id: 'bandwidth-calc', label: 'Bandwidth Calculator (Expr Tree)', icon: <Calculator className="w-4 h-4 text-indigo-400" /> },
      ],
    },
    {
      groupName: 'UNIT IV — GRAPHS',
      items: [
        { id: 'graph-builder', label: 'Topology Graph Builder', icon: <Share2 className="w-4 h-4 text-emerald-400" /> },
        { id: 'traversals', label: 'Network Traversal (BFS & DFS)', icon: <Compass className="w-4 h-4 text-sky-400" /> },
        { id: 'shortest-path', label: 'Shortest Path Routing (Dijkstra)', icon: <NavigationIcon className="w-4 h-4 text-cyan-400" /> },
        { id: 'cabling-mst', label: 'Cabling Optimization (Prim/Kruskal)', icon: <Cable className="w-4 h-4 text-amber-400" /> },
        { id: 'connectivity', label: 'Connectivity & SCC (Tarjan)', icon: <Network className="w-4 h-4 text-violet-400" /> },
        { id: 'topological-sort', label: 'Dependency Ordering & Cycles', icon: <ListOrdered className="w-4 h-4 text-pink-400" /> },
      ],
    },
    {
      groupName: 'UNIT V — ALGORITHM ANALYSIS',
      items: [
        { id: 'lab-comparisons', label: 'Algorithm Comparisons', icon: <Layers className="w-4 h-4 text-yellow-400" /> },
        { id: 'lab-benchmarking', label: 'Performance Benchmarking Lab', icon: <Activity className="w-4 h-4 text-emerald-400" /> },
        { id: 'lab-complexity', label: 'Complexity Theory Matrix', icon: <Cpu className="w-4 h-4 text-purple-400" /> },
      ],
    },
    {
      groupName: 'QUALITY ASSURANCE & DOCS',
      items: [
        { id: 'testing', label: 'Automated Test Suite (Vitest)', icon: <CheckCircle2 className="w-4 h-4 text-green-400" />, badge: '49' },
        { id: 'documentation', label: 'Project Architecture & Docs', icon: <BookOpen className="w-4 h-4 text-slate-300" /> },
      ],
    },
  ];

  return (
    <aside className="w-72 bg-slate-950/95 border-r border-slate-800/80 flex flex-col h-screen select-none sticky top-0 shrink-0">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Network className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-sm tracking-wide">NetSim DSA</h1>
            <p className="text-[10px] text-cyan-400 font-mono tracking-tight">Computer Network Simulator</p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
        {navGroups.map((group) => (
          <div key={group.groupName} className="space-y-1">
            <h2 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {group.groupName}
            </h2>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-950/80 to-blue-950/60 text-cyan-300 border border-cyan-800/60 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-cyan-400' : 'text-slate-500'}>{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Reset & Status Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/80 space-y-2">
        <button
          onClick={resetAllToDefault}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Reset Sample Topology</span>
        </button>

        <div className="flex items-center justify-between px-2 text-[10px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-semibold">Ready</span>
          </div>
          <span className="text-cyan-400">v1.0.0</span>
        </div>
      </div>
    </aside>
  );
};
