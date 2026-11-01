import React, { useMemo } from 'react';
import { GeneralTreeNode, BSTNode, AVLNode, ExpressionTreeNode } from '../types/tree';

export interface VisualTreeNode {
  id: string;
  label: string;
  sublabel?: string;
  badge?: string;
  badgeColor?: string;
  type?: string;
  children: VisualTreeNode[];
  highlighted?: boolean;
  isPivot?: boolean;
}

interface TreeVisualizerProps {
  root: VisualTreeNode | null;
  onNodeClick?: (nodeId: string) => void;
  selectedId?: string;
  height?: number;
}

interface PositionedNode {
  node: VisualTreeNode;
  x: number;
  y: number;
  children: PositionedNode[];
}

export const TreeVisualizer: React.FC<TreeVisualizerProps> = ({
  root,
  onNodeClick,
  selectedId,
  height = 420,
}) => {
  // Compute hierarchical layout coordinates
  const { positionedTree, totalWidth } = useMemo(() => {
    if (!root) return { positionedTree: null, totalWidth: 600 };

    let currentX = 50;
    const levelHeight = 75;

    // Post-order traversal to position leaf nodes sequentially and center parent over children
    const layout = (node: VisualTreeNode, depth: number): PositionedNode => {
      if (node.children.length === 0) {
        const x = currentX;
        currentX += 80;
        return { node, x, y: 50 + depth * levelHeight, children: [] };
      }

      const positionedChildren = node.children.map((child) => layout(child, depth + 1));
      const firstChildX = positionedChildren[0].x;
      const lastChildX = positionedChildren[positionedChildren.length - 1].x;
      const x = (firstChildX + lastChildX) / 2;

      return {
        node,
        x,
        y: 50 + depth * levelHeight,
        children: positionedChildren,
      };
    };

    const tree = layout(root, 0);
    return { positionedTree: tree, totalWidth: Math.max(currentX + 50, 700) };
  }, [root]);

  if (!root || !positionedTree) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-dashed border-slate-700 rounded-xl bg-slate-900/40 text-slate-400">
        <p className="text-sm">Empty Tree Structure. Insert nodes or load default template to visualize.</p>
      </div>
    );
  }

  // Flatten links and nodes for SVG rendering
  const links: { x1: number; y1: number; x2: number; y2: number; key: string }[] = [];
  const nodes: PositionedNode[] = [];

  const traverse = (pNode: PositionedNode) => {
    nodes.push(pNode);
    for (const child of pNode.children) {
      links.push({
        x1: pNode.x,
        y1: pNode.y,
        x2: child.x,
        y2: child.y,
        key: `${pNode.node.id}->${child.node.id}`,
      });
      traverse(child);
    }
  };

  traverse(positionedTree);

  return (
    <div className="relative w-full overflow-x-auto overflow-y-hidden border border-slate-800 rounded-xl bg-slate-950/70 p-2 shadow-inner">
      <div className="flex items-center justify-between px-3 py-1 text-xs text-slate-400 border-b border-slate-800/80 mb-2">
        <span>Hierarchical Canvas Layout</span>
        <span className="text-cyan-400 font-mono">Total Nodes: {nodes.length}</span>
      </div>
      <svg
        width={totalWidth}
        height={height}
        className="mx-auto block select-none"
        style={{ minWidth: '100%' }}
      >
        <defs>
          <linearGradient id="linkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.4" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Links */}
        {links.map((link) => {
          const midY = (link.y1 + link.y2) / 2;
          const pathD = `M ${link.x1} ${link.y1} C ${link.x1} ${midY}, ${link.x2} ${midY}, ${link.x2} ${link.y2}`;
          return (
            <path
              key={link.key}
              d={pathD}
              fill="none"
              stroke="url(#linkGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((p) => {
          const isSelected = selectedId === p.node.id;
          const isHighlighted = p.node.highlighted;
          const isPivot = p.node.isPivot;

          let strokeColor = '#38bdf8';
          let fillColor = '#0f172a';

          if (isPivot) {
            strokeColor = '#ec4899';
            fillColor = '#831843';
          } else if (isHighlighted) {
            strokeColor = '#22c55e';
            fillColor = '#14532d';
          } else if (isSelected) {
            strokeColor = '#f59e0b';
            fillColor = '#78350f';
          }

          return (
            <g
              key={p.node.id}
              transform={`translate(${p.x}, ${p.y})`}
              className="cursor-pointer transition-transform duration-200 hover:scale-110"
              onClick={() => onNodeClick && onNodeClick(p.node.id)}
            >
              {/* Outer Glow for Highlighted */}
              {(isHighlighted || isPivot || isSelected) && (
                <circle r="26" fill="none" stroke={strokeColor} strokeWidth="2" opacity="0.4" filter="url(#glow)" />
              )}

              {/* Main Node Circle */}
              <circle
                r="22"
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={isSelected || isHighlighted || isPivot ? '3' : '2'}
                className="transition-colors"
              />

              {/* Label */}
              <text
                textAnchor="middle"
                dy="4"
                fill="#f8fafc"
                fontSize="11"
                fontWeight="600"
                className="pointer-events-none font-mono"
              >
                {p.node.label.length > 7 ? p.node.label.slice(0, 6) + '…' : p.node.label}
              </text>

              {/* Badge (BF, Height, or Device Type) */}
              {p.node.badge && (
                <g transform="translate(14, -14)">
                  <circle r="9" fill={p.node.badgeColor || '#0284c7'} />
                  <text
                    textAnchor="middle"
                    dy="3"
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="bold"
                    className="pointer-events-none font-mono"
                  >
                    {p.node.badge}
                  </text>
                </g>
              )}

              {/* Sublabel below node */}
              {p.node.sublabel && (
                <text
                  textAnchor="middle"
                  y="34"
                  fill="#94a3b8"
                  fontSize="10"
                  className="pointer-events-none"
                >
                  {p.node.sublabel.length > 14 ? p.node.sublabel.slice(0, 12) + '…' : p.node.sublabel}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Converters from algorithm node classes to VisualTreeNode:

export function generalTreeNodeToVisual(node: GeneralTreeNode | null): VisualTreeNode | null {
  if (!node) return null;
  return {
    id: node.id,
    label: node.name,
    sublabel: node.ip || node.type,
    badge: node.type.slice(0, 1).toUpperCase(),
    badgeColor: node.type === 'router' ? '#3b82f6' : node.type === 'switch' ? '#06b6d4' : '#10b981',
    type: node.type,
    children: node.children.map((c) => generalTreeNodeToVisual(c)!),
  };
}

export function bstNodeToVisual(
  node: BSTNode | null,
  highlightedKeys: number[] = [],
  selectedKey?: number
): VisualTreeNode | null {
  if (!node) return null;
  const children: VisualTreeNode[] = [];
  if (node.left) {
    const leftVisual = bstNodeToVisual(node.left, highlightedKeys, selectedKey);
    if (leftVisual) children.push(leftVisual);
  }
  if (node.right) {
    const rightVisual = bstNodeToVisual(node.right, highlightedKeys, selectedKey);
    if (rightVisual) children.push(rightVisual);
  }

  return {
    id: String(node.key),
    label: String(node.key),
    sublabel: node.name,
    badge: node.deviceType.slice(0, 1).toUpperCase(),
    badgeColor: node.status === 'online' ? '#10b981' : '#ef4444',
    type: node.deviceType,
    highlighted: highlightedKeys.includes(node.key),
    children,
  };
}

export function avlNodeToVisual(
  node: AVLNode | null,
  highlightedKeys: number[] = [],
  pivotKey?: number
): VisualTreeNode | null {
  if (!node) return null;
  const leftH = node.left ? node.left.height : 0;
  const rightH = node.right ? node.right.height : 0;
  const bf = leftH - rightH;

  const children: VisualTreeNode[] = [];
  if (node.left) {
    const leftVisual = avlNodeToVisual(node.left, highlightedKeys, pivotKey);
    if (leftVisual) children.push(leftVisual);
  }
  if (node.right) {
    const rightVisual = avlNodeToVisual(node.right, highlightedKeys, pivotKey);
    if (rightVisual) children.push(rightVisual);
  }

  let bfColor = '#059669'; // Green if 0
  if (bf === 1 || bf === -1) bfColor = '#d97706'; // Amber if 1 or -1
  if (Math.abs(bf) > 1) bfColor = '#dc2626'; // Red if unbalanced!

  return {
    id: String(node.key),
    label: String(node.key),
    sublabel: `h=${node.height}`,
    badge: `BF:${bf}`,
    badgeColor: bfColor,
    type: node.deviceType,
    highlighted: highlightedKeys.includes(node.key),
    isPivot: pivotKey === node.key,
    children,
  };
}

export function expressionNodeToVisual(node: ExpressionTreeNode | null): VisualTreeNode | null {
  if (!node) return null;
  const children: VisualTreeNode[] = [];
  if (node.left) children.push(expressionNodeToVisual(node.left)!);
  if (node.right) children.push(expressionNodeToVisual(node.right)!);

  return {
    id: `${node.value}-${Math.random()}`,
    label: node.value,
    sublabel: node.evaluatedValue !== undefined ? `= ${node.evaluatedValue}` : undefined,
    badge: node.isOperator ? 'OP' : 'NUM',
    badgeColor: node.isOperator ? '#8b5cf6' : '#06b6d4',
    children,
  };
}
