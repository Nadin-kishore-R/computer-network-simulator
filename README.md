# Computer Network Simulator

[![React](https://img.shields.io/badge/React-19.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-5.0-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![Firebase Hosting](https://img.shields.io/badge/Firebase_Hosting-Live-FFCA28?logo=firebase&logoColor=black)](https://console.firebase.google.com/project/computer-network-simulator)

> A comprehensive, interactive Computer Network Simulator demonstrating Data Structures and Algorithms (General Trees, BST, AVL Trees, Expression Trees, Graph ADT, BFS, DFS, Dijkstra, Prim, Kruskal, SCC, and Topological Sorting) applied to real-world computer networking paradigms.

---

## 📌 Project Overview
The **Computer Network Simulator** bridges core computer science theory and realistic networking infrastructure. It models network topologies, routing protocols, subnet hierarchies, device registries, cabling optimizations, and packet dispatching through rigorous Data Structures and Algorithms implementations directly in TypeScript without third-party algorithm engines.

---

## 🚀 Key Modules & Features

### 🌲 Unit III — Trees
* **Network Hierarchy (General Tree)**: Multi-way tree hierarchy representing Routers, Subnets, and Switches with operations: Add/Remove node, Depth/Height calculation, Preorder, Postorder, and Level-order traversals.
* **Device Registry (Binary Search Tree)**: IP and Port registry supporting Insertion, Deletion, Search, Min/Max, Inorder, Preorder, Postorder, Range queries, Predecessor/Successor.
* **Balanced IP Registry (AVL Tree)**: Self-balancing BST with automatic LL, RR, LR, RL rotations, step-by-step rotation visualization, balance factor tracking, and height preservation.
* **Bandwidth Calculator (Expression Tree)**: Postfix expression parsing, tree synthesis, operator/operand validation, evaluation steps, and zero-division protection.

### 🌐 Unit IV — Graphs
* **Network Graph ADT**: Directed/Undirected, Weighted/Unweighted graphs with both Adjacency Matrix and Adjacency List representations.
* **Breadth-First Search (BFS)**: Hop-count distance calculation, traversal path, visited states, and disconnected component handling.
* **Depth-First Search (DFS)**: Recursive and iterative traversals, discovery and finishing timestamps, parent relationships, and tree/back/forward/cross edge classification.
* **Shortest Path Routing (Dijkstra)**: Greedy single-source shortest path routing, cost table, previous vertex pointers, negative weight rejection, and unreachable destination detection.
* **Minimum Spanning Tree (Prim & Kruskal)**:
  * **Prim's Algorithm**: Priority-driven edge expansion starting from custom root.
  * **Kruskal's Algorithm**: Disjoint Set Union (DSU) with Path Compression and Union by Rank, cycle detection, and edge rejection tracking.
* **Connectivity & Strongly Connected Components (SCC)**: Undirected connected component identification and Tarjan's / Kosaraju's SCC decomposition for directed networks.
* **Topological Sorting & Cycle Detection**: Kahn's in-degree BFS algorithm and DFS-based topological ordering with cycle detection.

### 🔬 Unit V — Algorithm Performance Laboratory
* **Comparative Studies**:
  * BFS vs. Dijkstra (Minimum-hop vs. Minimum-latency routes).
  * Prim vs. Kruskal (Dense vs. Sparse graph efficiencies).
  * BST vs. AVL (Degenerate skewed trees vs. $O(\log n)$ balanced guarantees).
* **Live Benchmarking Suite**: Real-world timing execution using `performance.now()` across various input sizes with reproducible seeds.
* **Theoretical Complexity Matrix**: Big $O$, $\Omega$, $\Theta$ asymptotic notations for time and space complexities.

---

## 🛠️ Tech Stack
* **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide React, Recharts.
* **Testing**: Vitest automated test suite.
* **Deployment & CI/CD**: Firebase Hosting & GitHub.

---

## 📦 Getting Started

### Prerequisites
* Node.js (v18+)
* npm (v9+)
* Git

### Installation
```bash
# Clone the repository
git clone https://github.com/Nadin-kishore-R/computer-network-simulator.git

# Navigate into project directory
cd computer-network-simulator

# Install dependencies
npm install

# Start local development server
npm run dev
```

### Running Tests
```bash
# Run Vitest automated test suite
npm run test

# Run TypeScript typecheck
npm run typecheck

# Run production build
npm run build
```

---

## 🌐 Deployment
Configured for Firebase Hosting:
```bash
firebase deploy --only hosting
```
Live deployment URL: `https://computer-network-simulator.web.app`

---

## 👥 Team
* **Lead Developer & Architect**: Nadin Kishore R
