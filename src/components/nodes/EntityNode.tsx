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
import { useLanguage } from '@/contexts/LanguageContext';

interface EntityNodeData {
  label: string;
  kpiValue: string | number;
  kpiUnit: string;
  category: string;
  status?: string;
  lastUpdated?: string;
  icon?: string;
  nodeColor?: string;
  designation?: string;
  description?: string;
}

const getIconComponent = (icon?: string): React.ReactNode => {
  const cls = 'w-4 h-4';
  switch (icon) {
    case 'factory': return <Factory className={cls} />;
    case 'zap': return <Zap className={cls} />;
    case 'network': return <Network className={cls} />;
    case 'building': return <Building2 className={cls} />;
    case 'users': return <Users className={cls} />;
    case 'leaf': return <Leaf className={cls} />;
    case 'trending': return <TrendingUp className={cls} />;
    case 'cpu': return <Cpu className={cls} />;
    case 'droplet': return <Droplet className={cls} />;
    case 'alert': return <BadgeAlert className={cls} />;
    default: return <Zap className={cls} />;
  }
};

const getCategoryTheme = (category: string) => {
  switch (category) {
    case 'government':
      return { accent: '#f94144', glow: '249, 65, 68', label: 'Government', gradient: 'rgba(249, 65, 68, 0.08)' };
    case 'generation':
      return { accent: '#f3722c', glow: '243, 114, 44', label: 'Generation', gradient: 'rgba(243, 114, 44, 0.07)' };
    case 'transmission':
      return { accent: '#f8961e', glow: '248, 150, 30', label: 'Transmission', gradient: 'rgba(248, 150, 30, 0.07)' };
    case 'distribution':
      return { accent: '#f9c74f', glow: '249, 199, 79', label: 'Distribution', gradient: 'rgba(249, 199, 79, 0.06)' };
    case 'consumer':
      return { accent: '#90be6d', glow: '144, 190, 109', label: 'Consumer', gradient: 'rgba(144, 190, 109, 0.06)' };
    case 'fuel':
      return { accent: '#43aa8b', glow: '67, 170, 139', label: 'Fuel Supply', gradient: 'rgba(67, 170, 139, 0.06)' };
    case 'regulator':
      return { accent: '#577590', glow: '87, 117, 144', label: 'Regulator', gradient: 'rgba(87, 117, 144, 0.07)' };
    default:
      return { accent: '#577590', glow: '87, 117, 144', label: '—', gradient: 'rgba(87, 117, 144, 0.05)' };
  }
};

interface EntityNodeProps extends NodeProps<EntityNodeData> {}

const EntityNode: React.FC<EntityNodeProps> = ({ data, sourcePosition = Position.Bottom, targetPosition = Position.Top }) => {
  const { t, translateKpi, language } = useLanguage();
  const theme = getCategoryTheme(data.category);
  const isAlert = data.status === 'alert';
  const isWarning = data.status === 'warning';
  const kpi = translateKpi(data.kpiValue, data.kpiUnit);
  const fontClass = language === 'BN' ? 'font-bengali' : 'font-sans';

  return (
    <div className={`group relative cursor-pointer ${fontClass}`} style={{ width: 220, height: 220 }}>
      {/* Subtle hover glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, rgba(${theme.glow}, 0.1) 0%, transparent 70%)`,
          transform: 'scale(1.1)',
          filter: 'blur(12px)',
        }}
      />

      {/* Card */}
      <div
        className="relative w-full h-full rounded-2xl overflow-hidden transition-all duration-200 group-hover:translate-y-[-2px] flex flex-col"
        style={{
          background: `linear-gradient(145deg, ${theme.gradient} 0%, rgba(12, 17, 29, 0.92) 100%)`,
          border: `1px solid rgba(${theme.glow}, 0.15)`,
          borderTopWidth: '4px',
          borderTopColor: theme.accent,
          boxShadow: isAlert
            ? `0 0 24px rgba(248, 113, 113, 0.25), 0 4px 20px rgba(0,0,0,0.4)`
            : isWarning
            ? `0 0 20px rgba(245, 158, 11, 0.15), 0 4px 20px rgba(0,0,0,0.4)`
            : `0 4px 24px rgba(0, 0, 0, 0.35), 0 1px 0 rgba(255,255,255,0.02) inset`,
        }}
      >
        <Handle type="target" position={targetPosition} className="!bg-transparent !border-0 !w-3 !h-1" />
        <Handle type="source" position={sourcePosition} className="!bg-transparent !border-0 !w-3 !h-1" />

        {/* Top section: Icon + Name + Designation */}
        <div className="px-4 pt-4 pb-2 flex-shrink-0">
          <div className="flex items-start gap-2.5 mb-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: `rgba(${theme.glow}, 0.12)`, color: theme.accent }}
            >
              {getIconComponent(data.icon)}
            </div>
            <div className="min-w-0 flex-1">
              <h3
                className="text-[11px] font-bold leading-tight line-clamp-2"
                style={{ color: '#e2e8f0' }}
              >
                {t(data.label)}
              </h3>
              {data.designation && (
                <p className="text-[9px] mt-0.5 line-clamp-1" style={{ color: 'rgba(148, 163, 184, 0.6)' }}>
                  {t(data.designation)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* KPI Section — visual focal point */}
        <div className="px-4 flex-1 flex items-center justify-center">
          <div
            className="w-full rounded-xl px-3 py-3 text-center"
            style={{
              background: `rgba(${theme.glow}, 0.05)`,
              border: `1px solid rgba(${theme.glow}, 0.08)`,
            }}
          >
            <div
              className="text-xl font-bold tracking-tight leading-none mb-1"
              style={{ fontFamily: 'JetBrains Mono, monospace', color: '#f1f5f9' }}
            >
              {kpi.value}
            </div>
            <div className="text-[10px] font-medium" style={{ color: `rgba(${theme.glow}, 0.7)` }}>
              {kpi.unit}
            </div>
          </div>
        </div>

        {/* Bottom bar: Status + Category */}
        <div className="px-4 pb-3 pt-2 flex items-center justify-between flex-shrink-0">
          {/* Status */}
          <div className="flex items-center gap-1.5">
            <div
              className="w-[6px] h-[6px] rounded-full flex-shrink-0"
              style={{
                background: isAlert ? '#f87171' : isWarning ? '#fbbf24' : '#34d399',
                boxShadow: isAlert
                  ? '0 0 6px rgba(248,113,113,0.6)'
                  : isWarning
                  ? '0 0 6px rgba(251,191,36,0.5)'
                  : '0 0 4px rgba(52,211,153,0.4)',
                animation: isAlert ? 'subtlePulse 2s ease-in-out infinite' : 'none',
              }}
            />
            <span
              className="text-[9px] font-medium capitalize"
              style={{
                color: isAlert ? '#fca5a5' : isWarning ? '#fde68a' : 'rgba(148, 163, 184, 0.5)',
              }}
            >
              {t(data.status || 'normal')}
            </span>
          </div>

          {/* Category badge */}
          <div
            className="flex items-center justify-center text-center text-[8px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full shrink min-w-0 ml-2"
            style={{
              color: theme.accent,
              background: `rgba(${theme.glow}, 0.08)`,
              border: `1px solid rgba(${theme.glow}, 0.12)`,
            }}
          >
            <span className="truncate w-full block">{t(theme.label)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityNode;
