'use client';

import React from 'react';
import {
  EdgeProps,
  getBezierPath,
  BaseEdge,
  EdgeLabelRenderer,
} from 'reactflow';
import { clsx } from 'clsx';

interface FlowEdgeData {
  flowVolume?: number; // in MW
  flowType?: 'power' | 'subsidy' | 'fuel';
  animated?: boolean;
  label?: string;
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
}) => {
  const flowVolume = data?.flowVolume || 1000;
  const flowType = data?.flowType || 'power';
  const label = data?.label || '';

  // Calculate stroke width based on flow volume (MW)
  // Min 1px, max 12px
  const calculateStrokeWidth = (volume: number): number => {
    const minVolume = 100;
    const maxVolume = 10000;
    const minStroke = 1;
    const maxStroke = 12;

    if (volume <= minVolume) return minStroke;
    if (volume >= maxVolume) return maxStroke;

    return (
      minStroke +
      ((volume - minVolume) / (maxVolume - minVolume)) * (maxStroke - minStroke)
    );
  };

  const strokeWidth = calculateStrokeWidth(flowVolume);

  // Determine stroke color and style based on flow type
  const getStrokeStyle = (): {
    color: string;
    dasharray?: string;
    opacity: number;
  } => {
    switch (flowType) {
      case 'subsidy':
        return {
          color: '#22c55e',
          dasharray: '5,5',
          opacity: 0.7,
        };
      case 'fuel':
        return {
          color: '#f59e0b',
          dasharray: '8,4',
          opacity: 0.7,
        };
      case 'power':
      default:
        return {
          color: '#475569',
          opacity: 0.8,
        };
    }
  };

  const strokeStyle = getStrokeStyle();

  const [edgePath, labelX, labelY] = getBezierPath({
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
          strokeWidth,
          strokeDasharray: strokeStyle.dasharray,
          opacity: strokeStyle.opacity,
          animation: data?.animated
            ? `dash-animation 20s linear infinite`
            : 'none',
        }}
      />

      {/* Animated dash pattern for active power lines */}
      {data?.animated && (
        <style>{`
          @keyframes dash-animation {
            to {
              stroke-dashoffset: 20;
            }
          }
          
          svg [data-testid="rf__edge"] path {
            animation: dash-animation 20s linear infinite;
          }
        `}</style>
      )}

      {/* Edge Label */}
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 12,
              pointerEvents: 'none',
              backgroundColor: 'white',
              padding: '2px 6px',
              borderRadius: 4,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
              fontWeight: 600,
              color: '#475569',
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
