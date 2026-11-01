import React, { createContext, useContext, useState, useMemo } from 'react';
import { GeneralTree } from '../trees/generalTree';
import { BinarySearchTree } from '../trees/bst';
import { AVLTree } from '../trees/avl';
import { Graph } from '../algorithms/graph';

export interface OperationLog {
  id: string;
  timestamp: string;
  module: string;
  action: string;
  details: string;
  status: 'success' | 'warning' | 'error';
}

export type TabId =
  | 'dashboard'
  | 'hierarchy'
  | 'registry-bst'
  | 'registry-avl'
  | 'bandwidth-calc'
  | 'graph-builder'
  | 'traversals'
  | 'shortest-path'
  | 'cabling-mst'
  | 'connectivity'
  | 'topological-sort'
  | 'lab-comparisons'
  | 'lab-benchmarking'
  | 'lab-complexity'
  | 'testing'
  | 'documentation';

interface NetworkContextType {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  generalTree: GeneralTree;
  setGeneralTree: React.Dispatch<React.SetStateAction<GeneralTree>>;
  bst: BinarySearchTree;
  setBst: React.Dispatch<React.SetStateAction<BinarySearchTree>>;
  avl: AVLTree;
  setAvl: React.Dispatch<React.SetStateAction<AVLTree>>;
  graph: Graph;
  setGraph: React.Dispatch<React.SetStateAction<Graph>>;
  operationLogs: OperationLog[];
  logOperation: (module: string, action: string, details: string, status?: 'success' | 'warning' | 'error') => void;
  resetAllToDefault: () => void;
  version: number;
  triggerUpdate: () => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [generalTree, setGeneralTree] = useState<GeneralTree>(() => GeneralTree.createDefaultNetwork());
  const [bst, setBst] = useState<BinarySearchTree>(() => BinarySearchTree.createDefaultRegistry());
  const [avl, setAvl] = useState<AVLTree>(() => AVLTree.createDefaultRegistry());
  const [graph, setGraph] = useState<Graph>(() => Graph.createSampleNetwork());
  const [version, setVersion] = useState<number>(0);

  const [operationLogs, setOperationLogs] = useState<OperationLog[]>([
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString(),
      module: 'System',
      action: 'Simulator Initialization',
      details: 'Loaded default 14-node enterprise topology, device registries, and hierarchy tree.',
      status: 'success',
    },
  ]);

  const triggerUpdate = () => {
    setVersion((v) => v + 1);
  };

  const logOperation = (
    module: string,
    action: string,
    details: string,
    status: 'success' | 'warning' | 'error' = 'success'
  ) => {
    setOperationLogs((prev) => [
      {
        id: `op-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: new Date().toLocaleTimeString(),
        module,
        action,
        details,
        status,
      },
      ...prev.slice(0, 49),
    ]);
  };

  const resetAllToDefault = () => {
    setGeneralTree(GeneralTree.createDefaultNetwork());
    setBst(BinarySearchTree.createDefaultRegistry());
    setAvl(AVLTree.createDefaultRegistry());
    setGraph(Graph.createSampleNetwork());
    triggerUpdate();
    logOperation('System', 'Topology Reset', 'Restored all data structures and graphs to baseline sample datasets.');
  };

  const value = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      generalTree,
      setGeneralTree,
      bst,
      setBst,
      avl,
      setAvl,
      graph,
      setGraph,
      operationLogs,
      logOperation,
      resetAllToDefault,
      version,
      triggerUpdate,
    }),
    [activeTab, generalTree, bst, avl, graph, operationLogs, version]
  );

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
};

export const useNetwork = (): NetworkContextType => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};
