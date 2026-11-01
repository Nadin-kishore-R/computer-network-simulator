import React from 'react';
import { BookOpen, CheckCircle2, Globe, Server, Layers, Cpu, Code2 } from 'lucide-react';

const GitHubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

export const DocumentationPage: React.FC = () => {
  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono">
          <BookOpen className="w-4 h-4" />
          <span>PROJECT ARCHITECTURE & DOCUMENTATION</span>
        </div>
        <h1 className="text-2xl font-bold text-white mt-1">Computer Network Simulator — Master Documentation</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Comprehensive academic technical manual documenting algorithmic implementations, data structure design, and verification reports.
        </p>
      </div>

      {/* Quick Links & Deployment Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Live Production Deployment (Firebase Hosting)</span>
          </div>
          <p className="text-xs text-slate-400 font-mono break-all">
            URL: <a href="https://computer-network-simulator.web.app" target="_blank" rel="noreferrer" className="text-cyan-400 underline">https://computer-network-simulator.web.app</a>
          </p>
          <div className="text-[11px] text-slate-500 font-mono">
            Firebase Project ID: <span className="text-slate-300">computer-network-simulator</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <GitHubIcon className="w-4 h-4 text-slate-300" />
            <span>GitHub Version Control Repository</span>
          </div>
          <p className="text-xs text-slate-400 font-mono break-all">
            URL: <a href="https://github.com/Nadin-kishore-R/computer-network-simulator.git" target="_blank" rel="noreferrer" className="text-cyan-400 underline">https://github.com/Nadin-kishore-R/computer-network-simulator.git</a>
          </p>
          <div className="text-[11px] text-slate-500 font-mono">
            Branch: <span className="text-emerald-400 font-bold">main</span> | Owner: <span className="text-slate-300">Nadin-kishore-R</span>
          </div>
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Curriculum Requirements Compliance Checklist (100% Completed)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          {/* Unit III */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-cyan-400 font-bold uppercase text-[11px]">Unit III — Trees</div>
            <ul className="space-y-1.5 text-slate-300 text-[11px] font-sans">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> General Tree (Network Hierarchy)</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Add/Remove child, height, depth, count</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Preorder, postorder, level-order traversals</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Binary Search Tree (Device Registry)</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> BST 3-case deletion & range queries</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Min, max, successor, predecessor</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> AVL Tree (LL, RR, LR, RL Rotations)</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Balance factor (|BF| ≤ 1) and height audits</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Expression Tree (Bandwidth Calculator)</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Inorder, preorder, postorder & evaluation</li>
            </ul>
          </div>

          {/* Unit IV */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-blue-400 font-bold uppercase text-[11px]">Unit IV — Graphs</div>
            <ul className="space-y-1.5 text-slate-300 text-[11px] font-sans">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Graph ADT (Matrix & List representations)</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Directed, Undirected, Weighted, Unweighted</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Dynamic vertex/edge additions & updates</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Breadth-First Search (Hop distances)</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Depth-First Search (Recursive & Iterative)</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Edge classification (Tree, Back, Forward, Cross)</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Discovery & finishing timestamps (d/f)</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Dijkstra Shortest Path with Min-Heap</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Negative weight check & path reconstruction</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Prim & Kruskal MST with DSU cycle rejection</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Connected components & Tarjan's SCC</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Topological sort (Kahn & DFS) & cycle detection</li>
            </ul>
          </div>

          {/* Unit V */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-yellow-400 font-bold uppercase text-[11px]">Unit V — Algorithm Analysis</div>
            <ul className="space-y-1.5 text-slate-300 text-[11px] font-sans">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> BFS vs. Dijkstra with divergent topology</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Prim vs. Kruskal comparative matrix</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> BST vs. AVL height & worst-case analysis</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Benchmarking laboratory (1k, 5k, 20k trees)</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Benchmarking laboratory (200, 1k, 2k graphs)</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Measured runtime via performance.now()</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Reproducible seeds using SeededRandom LCG</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Asymptotic definitions: O, Ω, and Θ</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Recurrence relations & Master Theorem</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Amortized analysis of DSU α(n)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Architecture & Folder Structure */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 font-mono text-xs">
        <h2 className="text-sm font-bold text-white font-sans flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span>Production Folder Structure</span>
        </h2>
        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 overflow-x-auto text-[11px] leading-relaxed">
{`computer-network-simulator/
├── public/                 # Favicons and web assets
├── src/
│   ├── algorithms/         # Complete Graph & MST Algorithms
│   │   ├── bfs.ts          # Breadth-First Search
│   │   ├── dfs.ts          # Depth-First Search (Recursive & Iterative)
│   │   ├── dijkstra.ts     # Dijkstra Shortest Path with Min-Heap
│   │   ├── dsu.ts          # Disjoint Set Union (Rank + Path Compression)
│   │   ├── graph.ts        # Complete Graph ADT (Matrix & List)
│   │   ├── kruskal.ts      # Kruskal MST Algorithm
│   │   ├── prim.ts         # Prim MST Algorithm
│   │   ├── components.ts   # Connected Components & Tarjan SCC
│   │   └── topologicalSort.ts # Kahn & DFS Topological Ordering
│   ├── analysis/           # Unit V Performance & Benchmarking
│   │   ├── comparisons.ts  # Comparative Studies & Divergent Network
│   │   ├── benchmarking.ts # Live timing benchmarks (performance.now)
│   │   └── complexity.ts   # Theoretical Complexity Master Matrix
│   ├── components/         # Interactive Canvas & Visualization UI
│   │   ├── TreeVisualizer.tsx  # Dynamic Hierarchical Tree SVG Canvas
│   │   ├── GraphVisualizer.tsx # Network Topology SVG Canvas
│   │   ├── Header.tsx      # Application Header with real-time stats
│   │   └── Navigation.tsx  # Sidebar Module Navigator
│   ├── context/            # Shared Network State & Event Audit
│   │   └── NetworkContext.tsx
│   ├── pages/              # 16 Interactive Modules
│   ├── tests/              # 49 Automated Tests (Vitest)
│   │   ├── setup.test.ts
│   │   ├── trees.test.ts
│   │   ├── graphs.test.ts
│   │   └── analysis.test.ts
│   ├── types/              # Strict TypeScript Models
│   │   ├── tree.ts
│   │   └── graph.ts
│   ├── App.tsx             # Main App Router & Layout
│   └── main.tsx
├── firebase.json           # Firebase Hosting SPA Configuration
├── .firebaserc             # Project ID: computer-network-simulator
├── README.md               # GitHub Documentation
├── FINAL_TEST_REPORT.md    # Vitest Execution Audit
└── DEPLOYMENT_REPORT.md    # Hosting & Commit Verification`}
        </pre>
      </div>

      {/* Project Team */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
        <h2 className="text-sm font-bold text-white">Project Engineering Team</h2>
        <div className="text-xs text-slate-300 font-mono">
          Developer & Architect: <span className="text-cyan-400 font-bold">Nadin Kishore R</span>
        </div>
      </div>
    </div>
  );
};
