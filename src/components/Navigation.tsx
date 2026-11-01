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
        { id: 'dashboard', label: 'Mission Dashboard', icon: <LayoutDashboard className="w-4 h-4 text-slate-600" /> },
      ],
    },
    {
      groupName: 'HIERARCHY & DIRECTORY',
      items: [
        { id: 'hierarchy', label: 'Network Hierarchy', icon: <GitFork className="w-4 h-4 text-cyan-600" /> },
        { id: 'registry-bst', label: 'Device Registry', icon: <Binary className="w-4 h-4 text-blue-600" /> },
        { id: 'registry-avl', label: 'Balanced IP Registry', icon: <Scale className="w-4 h-4 text-teal-600" /> },
        { id: 'bandwidth-calc', label: 'Bandwidth Calculator', icon: <Calculator className="w-4 h-4 text-indigo-600" /> },
      ],
    },
    {
      groupName: 'ROUTING & TOPOLOGY',
      items: [
        { id: 'graph-builder', label: 'Topology Builder', icon: <Share2 className="w-4 h-4 text-emerald-600" /> },
        { id: 'traversals', label: 'Network Traversal', icon: <Compass className="w-4 h-4 text-sky-600" /> },
        { id: 'shortest-path', label: 'Shortest Path Routing', icon: <NavigationIcon className="w-4 h-4 text-cyan-600" /> },
        { id: 'cabling-mst', label: 'Cabling Optimization', icon: <Cable className="w-4 h-4 text-amber-600" /> },
        { id: 'connectivity', label: 'Subnet Connectivity', icon: <Network className="w-4 h-4 text-violet-600" /> },
        { id: 'topological-sort', label: 'Service Dependencies', icon: <ListOrdered className="w-4 h-4 text-pink-600" /> },
      ],
    },
    {
      groupName: 'PERFORMANCE & BENCHMARKS',
      items: [
        { id: 'lab-comparisons', label: 'Protocol Comparisons', icon: <Layers className="w-4 h-4 text-yellow-600" /> },
        { id: 'lab-benchmarking', label: 'Performance Benchmarking', icon: <Activity className="w-4 h-4 text-emerald-600" /> },
        { id: 'lab-complexity', label: 'Complexity Matrix', icon: <Cpu className="w-4 h-4 text-purple-600" /> },
      ],
    },
    {
      groupName: 'QUALITY ASSURANCE',
      items: [
        { id: 'testing', label: 'Automated Test Suite', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />, badge: '49' },
        { id: 'documentation', label: 'System Documentation', icon: <BookOpen className="w-4 h-4 text-slate-600" /> },
      ],
    },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-screen select-none sticky top-0 shrink-0 shadow-sm">
      {/* Brand Header: NetSIM */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
            <Network className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900 text-base tracking-wide">NetSIM</h1>
            <p className="text-[10px] text-cyan-700 font-medium">Computer Network Simulator</p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
        {navGroups.map((group) => (
          <div key={group.groupName} className="space-y-1">
            <h2 className="px-3 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
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
                        ? 'bg-cyan-50 text-cyan-900 border border-cyan-200 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-cyan-700' : 'text-slate-500'}>{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-semibold">
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
      <div className="p-3 border-t border-slate-200 bg-slate-50/80 space-y-2">
        <button
          onClick={resetAllToDefault}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-600" />
          <span>Reset Sample Topology</span>
        </button>

        <div className="flex items-center justify-between px-2 text-[10px] text-slate-500 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-700 font-semibold">Ready</span>
          </div>
          <span className="text-cyan-700 font-medium">v1.0.0</span>
        </div>
      </div>
    </aside>
  );
};
