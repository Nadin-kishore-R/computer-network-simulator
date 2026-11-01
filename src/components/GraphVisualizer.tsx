import React, { useState } from 'react';
import { GraphVertex, GraphEdge } from '../types/graph';
import { Router, Server, Shield, Laptop, Network } from 'lucide-react';

interface GraphVisualizerProps {
  vertices: GraphVertex[];
  edges: GraphEdge[];
  isDirected?: boolean;
  selectedVertexId?: string | null;
  targetVertexId?: string | null;
  onVertexClick?: (vertexId: string) => void;
  highlightedPathEdges?: { source: string; target: string }[];
  highlightedVertices?: string[];
  mstEdges?: GraphEdge[];
  rejectedEdges?: { edge: GraphEdge; reason: string }[];
  vertexComponentMap?: Record<string, number>;
  vertexMetricMap?: Record<string, string | number>;
  height?: number;
}

const COMPONENT_PALETTES = [
  { fill: '#1e293b', stroke: '#38bdf8', text: '#38bdf8' },
  { fill: '#1e1b4b', stroke: '#818cf8', text: '#a5b4fc' },
  { fill: '#14532d', stroke: '#4ade80', text: '#86efac' },
  { fill: '#701a75', stroke: '#f472b6', text: '#fbcfe8' },
  { fill: '#78350f', stroke: '#fbbf24', text: '#fde68a' },
  { fill: '#7f1d1d', stroke: '#f87171', text: '#fca5a5' },
];

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({
  vertices,
  edges,
  isDirected = false,
  selectedVertexId,
  targetVertexId,
  onVertexClick,
  highlightedPathEdges = [],
  highlightedVertices = [],
  mstEdges = [],
  rejectedEdges = [],
  vertexComponentMap,
  vertexMetricMap,
  height = 520,
}) => {
  // Track node drag positions
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});

  // Compute default layout if x, y are not present
  const vertexPositions = React.useMemo(() => {
    const coords: Record<string, { x: number; y: number }> = {};
    const n = vertices.length;
    const centerX = 450;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 80;

    vertices.forEach((v, idx) => {
      if (positions[v.id]) {
        coords[v.id] = positions[v.id];
      } else if (v.x !== undefined && v.y !== undefined) {
        coords[v.id] = { x: v.x, y: v.y };
      } else {
        const angle = (2 * Math.PI * idx) / Math.max(n, 1);
        coords[v.id] = {
          x: Math.round(centerX + radius * Math.cos(angle)),
          y: Math.round(centerY + radius * Math.sin(angle)),
        };
      }
    });

    return coords;
  }, [vertices, positions, height]);

  const handleMouseDown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDraggedNode(id);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggedNode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    setPositions((prev) => ({
      ...prev,
      [draggedNode]: { x: Math.max(30, Math.min(x, 900)), y: Math.max(30, Math.min(y, height - 30)) },
    }));
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  const isEdgeInPath = (e: GraphEdge) => {
    return highlightedPathEdges.some(
      (p) =>
        (p.source === e.source && p.target === e.target) ||
        (!isDirected && p.source === e.target && p.target === e.source)
    );
  };

  const isEdgeInMST = (e: GraphEdge) => {
    return mstEdges.some(
      (m) =>
        (m.source === e.source && m.target === e.target) ||
        (!isDirected && m.source === e.target && m.target === e.source)
    );
  };

  const isEdgeRejected = (e: GraphEdge) => {
    return rejectedEdges.some(
      (r) =>
        (r.edge.source === e.source && r.edge.target === e.target) ||
        (!isDirected && r.edge.source === e.target && r.edge.target === e.source)
    );
  };

  const getDeviceIcon = (type?: string) => {
    switch (type) {
      case 'router':
        return <Router className="w-3.5 h-3.5 text-blue-400" />;
      case 'server':
        return <Server className="w-3.5 h-3.5 text-emerald-400" />;
      case 'firewall':
        return <Shield className="w-3.5 h-3.5 text-red-400" />;
      case 'workstation':
        return <Laptop className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Network className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  return (
    <div className="relative w-full overflow-hidden border border-slate-800 rounded-xl bg-slate-950/80 p-2 shadow-2xl select-none">
      <div className="flex items-center justify-between px-3 py-1 text-xs text-slate-400 border-b border-slate-800/80 mb-2">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-slate-200">Network Topology Canvas</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">Click node to set Source / Target. Drag nodes to reposition.</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="text-cyan-400 font-medium">{vertices.length} Nodes</span>
          <span className="text-blue-400 font-medium">{edges.length} Links</span>
        </div>
      </div>

      <svg
        width="100%"
        height={height}
        viewBox="0 0 950 540"
        className="w-full h-auto cursor-default"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <defs>
          {/* Arrow marker for directed edges */}
          <marker
            id="directed-arrow"
            viewBox="0 0 10 10"
            refX="26"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
          </marker>

          {/* Highlighted Arrow */}
          <marker
            id="highlighted-arrow"
            viewBox="0 0 10 10"
            refX="26"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
          </marker>

          {/* Glow filter */}
          <filter id="luminousGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Normal and Highlighted Edges */}
        {edges.map((edge) => {
          const p1 = vertexPositions[edge.source];
          const p2 = vertexPositions[edge.target];
          if (!p1 || !p2) return null;

          const inPath = isEdgeInPath(edge);
          const inMST = isEdgeInMST(edge);
          const rejected = isEdgeRejected(edge);

          let strokeColor = '#334155';
          let strokeWidth = 1.8;
          let strokeDasharray = undefined;

          if (inPath) {
            strokeColor = '#06b6d4'; // Luminous Cyan
            strokeWidth = 4.5;
          } else if (inMST) {
            strokeColor = '#22c55e'; // Green
            strokeWidth = 3.5;
          } else if (rejected) {
            strokeColor = '#ef4444'; // Red dashed
            strokeWidth = 2;
            strokeDasharray = '4,4';
          }

          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;

          return (
            <g key={edge.id} className="transition-all">
              <line
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeLinecap="round"
                markerEnd={isDirected ? (inPath ? 'url(#highlighted-arrow)' : 'url(#directed-arrow)') : undefined}
                filter={inPath ? 'url(#luminousGlow)' : undefined}
              />
              {/* Edge Weight / Latency Badge */}
              <g transform={`translate(${midX}, ${midY})`}>
                <rect
                  x="-16"
                  y="-10"
                  width="32"
                  height="18"
                  rx="4"
                  fill="#0b1329"
                  stroke={inPath ? '#06b6d4' : inMST ? '#22c55e' : '#1e293b'}
                  strokeWidth="1.2"
                />
                <text
                  textAnchor="middle"
                  dy="3.5"
                  fill={inPath ? '#38bdf8' : inMST ? '#4ade80' : '#94a3b8'}
                  fontSize="10"
                  fontWeight="bold"
                  className="font-mono pointer-events-none"
                >
                  {edge.weight}
                </text>
              </g>
            </g>
          );
        })}

        {/* 2. Vertices */}
        {vertices.map((v) => {
          const p = vertexPositions[v.id];
          if (!p) return null;

          const isSelected = selectedVertexId === v.id;
          const isTarget = targetVertexId === v.id;
          const isHighlighted = highlightedVertices.includes(v.id);

          const compId = vertexComponentMap ? vertexComponentMap[v.id] : undefined;
          const palette = compId !== undefined ? COMPONENT_PALETTES[(compId - 1) % COMPONENT_PALETTES.length] : null;

          let strokeColor = palette ? palette.stroke : '#38bdf8';
          let fillColor = palette ? palette.fill : '#0f172a';

          if (isSelected) {
            strokeColor = '#38bdf8';
            fillColor = '#0369a1';
          } else if (isTarget) {
            strokeColor = '#10b981';
            fillColor = '#065f46';
          } else if (isHighlighted) {
            strokeColor = '#f59e0b';
            fillColor = '#78350f';
          }

          const metric = vertexMetricMap ? vertexMetricMap[v.id] : undefined;

          return (
            <g
              key={v.id}
              transform={`translate(${p.x}, ${p.y})`}
              className="cursor-pointer"
              onMouseDown={(e) => handleMouseDown(v.id, e)}
              onClick={() => onVertexClick && onVertexClick(v.id)}
            >
              {/* Active Aura Glow */}
              {(isSelected || isTarget || isHighlighted) && (
                <circle
                  r="32"
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="2.5"
                  opacity="0.5"
                  filter="url(#luminousGlow)"
                />
              )}

              {/* Node Outer Circle */}
              <circle
                r="22"
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={isSelected || isTarget ? '3' : '2'}
                className="transition-colors shadow-lg"
              />

              {/* Device Type Mini Badge */}
              <foreignObject x="-10" y="-10" width="20" height="20" className="pointer-events-none">
                <div className="flex items-center justify-center w-full h-full">{getDeviceIcon(v.type)}</div>
              </foreignObject>

              {/* Node ID / Label */}
              <text
                textAnchor="middle"
                y="34"
                fill="#f1f5f9"
                fontSize="11"
                fontWeight="600"
                className="pointer-events-none font-mono"
              >
                {v.label.length > 12 ? v.label.slice(0, 11) + '…' : v.label}
              </text>

              {/* IP or Distance Metric Tag */}
              {metric !== undefined ? (
                <g transform="translate(14, -14)">
                  <rect
                    x="-12"
                    y="-8"
                    width="28"
                    height="16"
                    rx="3"
                    fill="#0284c7"
                    stroke="#38bdf8"
                    strokeWidth="1"
                  />
                  <text
                    textAnchor="middle"
                    dy="4"
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="bold"
                    className="font-mono pointer-events-none"
                  >
                    {metric}
                  </text>
                </g>
              ) : v.ip ? (
                <text
                  textAnchor="middle"
                  y="46"
                  fill="#64748b"
                  fontSize="9"
                  className="pointer-events-none font-mono"
                >
                  {v.ip}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
