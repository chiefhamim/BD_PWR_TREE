'use client';

import React from 'react';
import {
  EdgeProps,
  getSmoothStepPath,
  BaseEdge,
  EdgeLabelRenderer,
} from 'reactflow';

interface FlowEdgeData {
  flowVolume?: number;
  flowType?: 'power' | 'subsidy' | 'fuel';
  animated?: boolean;
  label?: string;
  nodeColor?: string;
}

const FlowEdge: React.FC<EdgeProps<FlowEdgeData>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
  style,
}) => {
  const flowType = data?.flowType || 'power';
  const label = data?.label || '';

  const getStrokeStyle = () => {
    if (data?.nodeColor) {
      return {
        color: data.nodeColor,
        opacity: 0.45,
        width: 1.5,
      };
    }
    switch (flowType) {
      case 'subsidy':
        return { color: '#34d399', opacity: 0.4, width: 1, dasharray: '4,4' };
      case 'fuel':
        return { color: '#fbbf24', opacity: 0.4, width: 1, dasharray: '6,3' };
      default:
        return { color: '#475569', opacity: 0.35, width: 1.5 };
    }
  };

  const strokeStyle = getStrokeStyle();

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: strokeStyle.color,
          strokeWidth: strokeStyle.width,
          strokeDasharray: (strokeStyle as any).dasharray,
          opacity: strokeStyle.opacity,
          ...style,
        }}
      />
      
      {/* Moving Energy Pulse */}
      {data?.animated !== false && (
        <circle r="4" fill={style?.stroke || strokeStyle.color} filter={`url(#glow-${id})`}>
          <animateMotion 
            dur="3s" 
            repeatCount="indefinite" 
            path={edgePath} 
          />
        </circle>
      )}

      {/* SVG filter for glow effect */}
      <defs>
        <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 10,
              pointerEvents: 'none',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(8px)',
              padding: '2px 8px',
              borderRadius: 6,
              border: '1px solid rgba(148, 163, 184, 0.12)',
              fontWeight: 500,
              color: '#94a3b8',
              fontFamily: 'JetBrains Mono, monospace',
              letterSpacing: '0.02em',
            }}
            className="nodrag nopan"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default FlowEdge;
