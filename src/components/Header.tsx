import React from 'react';
import { useNetwork } from '../context/NetworkContext';
import { Globe, Server, Share2, Layers } from 'lucide-react';

const GitHubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

export const Header: React.FC = () => {
  const { graph, generalTree, activeTab } = useNetwork();

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Mission Operations Dashboard';
      case 'hierarchy':
        return 'Network Hierarchy — General Tree Management';
      case 'registry-bst':
        return 'Device Registry — Binary Search Tree (BST)';
      case 'registry-avl':
        return 'Balanced Registry — Self-Balancing AVL Tree';
      case 'bandwidth-calc':
        return 'Bandwidth Calculator — Expression Tree Synthesis';
      case 'graph-builder':
        return 'Network Topology Graph Builder';
      case 'traversals':
        return 'Network Traversal — BFS and DFS Edge Analysis';
      case 'shortest-path':
        return 'Shortest Path Routing — Dijkstra Algorithm';
      case 'cabling-mst':
        return 'Network Cabling Optimization — Prim & Kruskal MST';
      case 'connectivity':
        return 'Network Connectivity & Strongly Connected Components (Tarjan)';
      case 'topological-sort':
        return 'Dependency Pipeline — Topological Sorting & Cycle Detection';
      case 'lab-comparisons':
        return 'Algorithm Performance Laboratory — Comparative Analysis';
      case 'lab-benchmarking':
        return 'Empirical Benchmarking Laboratory';
      case 'lab-complexity':
        return 'Theoretical Complexity Matrix (O, Ω, Θ)';
      case 'testing':
        return 'Automated Quality Assurance & Vitest Report';
      case 'documentation':
        return 'Project Architecture & Comprehensive Documentation';
      default:
        return 'Computer Network Simulator';
    }
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/70 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="h-4 w-1 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full" />
        <h2 className="text-base font-bold text-slate-100 tracking-tight">{getPageTitle()}</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Network Metrics Chips */}
        <div className="hidden lg:flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{graph.getAllVertices().length} Vertices</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>{graph.getAllEdges().length} Links</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            <span>{generalTree.countNodes()} Tree Nodes</span>
          </div>
        </div>

        {/* Live Badges */}
        <a
          href="https://computer-network-simulator.web.app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-800/80 text-cyan-400 hover:bg-cyan-900/60 text-xs font-medium transition-all"
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Firebase Live</span>
        </a>

        <a
          href="https://github.com/Nadin-kishore-R/computer-network-simulator.git"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all"
        >
          <GitHubIcon className="w-3.5 h-3.5 text-slate-300" />
          <span className="hidden sm:inline">GitHub Repository</span>
        </a>
      </div>
    </header>
  );
};
