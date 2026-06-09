'use client';

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import {
  Factory,
  Zap,
  Network,
  Building2,
  Users,
  Leaf,
  TrendingUp,
  Cpu,
  Droplet,
  BadgeAlert,
} from 'lucide-react';
import { clsx } from 'clsx';

interface EntityNodeData {
  label: string;
  kpiValue: string | number;
  kpiUnit: string;
  category:
    | 'government'
    | 'generation'
    | 'transmission'
    | 'distribution'
    | 'consumer'
    | 'fuel'
    | 'regulator';
  status?: 'normal' | 'warning' | 'alert';
  lastUpdated?: string;
  icon?: 'factory' | 'zap' | 'network' | 'building' | 'users' | 'leaf' | 'trending' | 'cpu' | 'droplet' | 'alert';
}

const getIconComponent = (
  icon?: string
): React.ReactNode => {
  switch (icon) {
    case 'factory':
      return <Factory className="w-5 h-5" />;
    case 'zap':
      return <Zap className="w-5 h-5" />;
    case 'network':
      return <Network className="w-5 h-5" />;
    case 'building':
      return <Building2 className="w-5 h-5" />;
    case 'users':
      return <Users className="w-5 h-5" />;
    case 'leaf':
      return <Leaf className="w-5 h-5" />;
    case 'trending':
      return <TrendingUp className="w-5 h-5" />;
    case 'cpu':
      return <Cpu className="w-5 h-5" />;
    case 'droplet':
      return <Droplet className="w-5 h-5" />;
    case 'alert':
      return <BadgeAlert className="w-5 h-5" />;
    default:
      return <Factory className="w-5 h-5" />;
  }
};

const getCategoryColors = (
  category: EntityNodeData['category']
): {
  border: string;
  bg: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  icon: string;
} => {
  switch (category) {
    case 'government':
      return {
        border: '#64748b',
        bg: 'bg-slate-50',
        badgeBg: 'bg-slate-100',
        badgeText: 'text-slate-700',
        badgeBorder: 'border-slate-300',
        icon: 'text-slate-600',
      };
    case 'generation':
      return {
        border: '#0D9488',
        bg: 'bg-teal-50',
        badgeBg: 'bg-teal-100',
        badgeText: 'text-teal-700',
        badgeBorder: 'border-teal-300',
        icon: 'text-teal-600',
      };
    case 'transmission':
      return {
        border: '#1E3A8A',
        bg: 'bg-blue-50',
        badgeBg: 'bg-blue-100',
        badgeText: 'text-blue-700',
        badgeBorder: 'border-blue-300',
        icon: 'text-blue-600',
      };
    case 'distribution':
      return {
        border: '#D97706',
        bg: 'bg-amber-50',
        badgeBg: 'bg-amber-100',
        badgeText: 'text-amber-700',
        badgeBorder: 'border-amber-300',
        icon: 'text-amber-600',
      };
    case 'consumer':
      return {
        border: '#7C3AED',
        bg: 'bg-purple-50',
        badgeBg: 'bg-purple-100',
        badgeText: 'text-purple-700',
        badgeBorder: 'border-purple-300',
        icon: 'text-purple-600',
      };
    case 'fuel':
      return {
        border: '#DC2626',
        bg: 'bg-red-50',
        badgeBg: 'bg-red-100',
        badgeText: 'text-red-700',
        badgeBorder: 'border-red-300',
        icon: 'text-red-600',
      };
    case 'regulator':
      return {
        border: '#059669',
        bg: 'bg-green-50',
        badgeBg: 'bg-green-100',
        badgeText: 'text-green-700',
        badgeBorder: 'border-green-300',
        icon: 'text-green-600',
      };
    default:
      return {
        border: '#64748b',
        bg: 'bg-slate-50',
        badgeBg: 'bg-slate-100',
        badgeText: 'text-slate-700',
        badgeBorder: 'border-slate-300',
        icon: 'text-slate-600',
      };
  }
};

interface EntityNodeProps extends NodeProps<EntityNodeData> {
  isConnecting?: boolean;
}

const EntityNode: React.FC<EntityNodeProps> = ({ 
  data, 
  isConnecting = false 
}) => {
  const colors = getCategoryColors(data.category);
  const isAlert = data.status === 'alert';
  const isWarning = data.status === 'warning';

  return (
    <div
      className={clsx(
        'relative w-72 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg',
        colors.bg,
        'border-2 border-solid',
        isAlert && 'ring-2 ring-red-500 animate-pulse',
        isWarning && 'ring-2 ring-yellow-400'
      )}
      style={{
        borderColor: colors.border,
        borderLeftWidth: '8px',
      }}
    >
      {/* Handles for connections */}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />

      {/* Content Container */}
      <div className="p-4 space-y-3">
        {/* Header: Icon and Category Badge */}
        <div className="flex items-center justify-between">
          <div className={`${colors.icon}`}>{getIconComponent(data.icon)}</div>
          <span
            className={clsx(
              'text-xs font-semibold px-2 py-1 rounded-full border',
              colors.badgeText,
              colors.badgeBg,
              colors.badgeBorder
            )}
          >
            {data.category.charAt(0).toUpperCase() + data.category.slice(1)}
          </span>
        </div>

        {/* Entity Label */}
        <div>
          <h3 className="font-bold text-sm text-slate-900 leading-tight">
            {data.label}
          </h3>
        </div>

        {/* KPI Metric */}
        <div className="bg-white rounded-md p-2 border border-slate-200">
          <div className="font-mono font-bold text-base text-slate-800">
            {typeof data.kpiValue === 'number'
              ? data.kpiValue.toLocaleString()
              : data.kpiValue}
          </div>
          <div className="text-xs text-slate-500">{data.kpiUnit}</div>
        </div>

        {/* Last Updated Timestamp */}
        {data.lastUpdated && (
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <span>Updated: {data.lastUpdated}</span>
          </div>
        )}

        {/* Alert Indicator */}
        {isAlert && (
          <div className="bg-red-100 border border-red-300 rounded-md p-2">
            <div className="flex items-center gap-1">
              <BadgeAlert className="w-3.5 h-3.5 text-red-600" />
              <span className="text-xs font-semibold text-red-700">
                Alert Status
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Connection indicator on hover */}
      {isConnecting && (
        <div className="absolute inset-0 border-2 border-blue-400 rounded-lg pointer-events-none opacity-50" />
      )}
    </div>
  );
};

export default EntityNode;
