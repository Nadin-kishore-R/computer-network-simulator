// Tree types and models for network hierarchies

export type NetworkDeviceType = 'router' | 'switch' | 'server' | 'firewall' | 'workstation' | 'subnet' | 'gateway';

export interface GeneralTreeNode {
  id: string;
  name: string;
  type: NetworkDeviceType | 'network-root' | 'department';
  ip?: string;
  bandwidthMbps?: number;
  children: GeneralTreeNode[];
  metadata?: Record<string, string | number>;
}

export interface TreeTraversalResult {
  nodes: { id: string; name: string; key?: number }[];
  pathNames: string[];
}

export interface BSTNode {
  key: number;
  id: string;
  name: string;
  ip: string;
  deviceType: NetworkDeviceType;
  status: 'online' | 'offline' | 'congested';
  left: BSTNode | null;
  right: BSTNode | null;
  height?: number; // Used in AVL
}

export type RotationType = 'LL' | 'RR' | 'LR' | 'RL';

export interface RotationStep {
  type: RotationType;
  unbalancedKey: number;
  pivotKey: number;
  description: string;
  timestamp: number;
  snapshotBefore?: string; // serialized or visual snapshot
  snapshotAfter?: string;
}

export interface AVLNode {
  key: number;
  id: string;
  name: string;
  ip: string;
  deviceType: NetworkDeviceType;
  status: 'online' | 'offline' | 'congested';
  height: number;
  left: AVLNode | null;
  right: AVLNode | null;
}

export interface ExpressionTreeNode {
  value: string;
  isOperator: boolean;
  left: ExpressionTreeNode | null;
  right: ExpressionTreeNode | null;
  evaluatedValue?: number;
}

export interface ExpressionEvaluationStep {
  stepNumber: number;
  subExpression: string;
  operation: string;
  result: number;
  stackState: number[];
}
