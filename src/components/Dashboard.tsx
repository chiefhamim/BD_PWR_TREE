'use client';

import React, { useMemo } from 'react';
import { TrendingUp, Zap, DollarSign, AlertCircle, Gauge } from 'lucide-react';
import { clsx } from 'clsx';

interface DashboardStats {
  totalGeneration: number;
  totalCapacity: number;
  estimatedCost: number;
  systemEfficiency: number;
  alerts: number;
}

interface DashboardProps {
  stats?: DashboardStats;
}

const DEFAULT_STATS: DashboardStats = {
  totalGeneration: 14400,
  totalCapacity: 16800,
  estimatedCost: 2847,
  systemEfficiency: 85.7,
  alerts: 2,
};

const Dashboard: React.FC<DashboardProps> = ({ stats = DEFAULT_STATS }) => {
  const metrics = useMemo(() => {
    const utilizationRate = (stats.totalGeneration / stats.totalCapacity) * 100;
    return {
      ...stats,
      utilizationRate: utilizationRate.toFixed(1),
    };
  }, [stats]);

  const StatCard = ({
    icon: Icon,
    label,
    value,
    unit,
    color,
    isAlert = false,
  }: {
    icon: any;
    label: string;
    value: number | string;
    unit: string;
    color: string;
    isAlert?: boolean;
  }) => (
    <div
      className={clsx(
        'p-4 rounded-lg border backdrop-blur-sm transition-all hover:shadow-lg',
        isAlert
          ? 'bg-red-950 border-red-800 hover:bg-red-900'
          : 'bg-slate-800 border-slate-700 hover:bg-slate-750'
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className={clsx('p-2 rounded-lg', isAlert ? 'bg-red-900' : 'bg-slate-700')}>
          <Icon className={clsx('w-5 h-5', color)} />
        </div>
        <span className="text-xs text-slate-400">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-white">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        <span className="text-xs text-slate-400">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="absolute top-4 right-4 w-96 bg-gradient-to-b from-slate-800 via-slate-800 to-slate-900 border border-slate-700 rounded-xl shadow-2xl p-6 z-20 backdrop-blur-md">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
          <Gauge className="w-5 h-5 text-blue-400" />
          System Status
        </h2>
        <p className="text-xs text-slate-400">Real-time grid overview</p>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          icon={Zap}
          label="Generation"
          value={metrics.totalGeneration}
          unit="MW"
          color="text-teal-400"
        />
        <StatCard
          icon={Gauge}
          label="Capacity"
          value={metrics.totalCapacity}
          unit="MW"
          color="text-blue-400"
        />
        <StatCard
          icon={DollarSign}
          label="Est. Cost"
          value={metrics.estimatedCost}
          unit="Million BDT"
          color="text-green-400"
        />
        <StatCard
          icon={TrendingUp}
          label="Utilization"
          value={metrics.utilizationRate}
          unit="%"
          color="text-amber-400"
        />
      </div>

      {/* Efficiency Bar */}
      <div className="bg-slate-700 bg-opacity-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-white">System Efficiency</span>
          <span className="text-sm font-bold text-green-400">{metrics.systemEfficiency}%</span>
        </div>
        <div className="w-full bg-slate-600 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-500 to-teal-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${metrics.systemEfficiency}%` }}
          />
        </div>
      </div>

      {/* Alerts Section */}
      {metrics.alerts > 0 && (
        <div className="bg-red-950 border border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-semibold text-red-200">
              {metrics.alerts} Active Alert{metrics.alerts !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="text-xs text-red-300">
            {metrics.alerts === 1
              ? 'BPDB Gas Plants operating below optimal capacity'
              : 'Check rental power plants and BPDB fuel supply status'}
          </div>
        </div>
      )}

      {/* Footer Stats */}
      <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-slate-700 text-xs">
        <div className="text-center">
          <div className="text-slate-400 mb-1">Peak Demand</div>
          <div className="text-white font-bold">14,800 MW</div>
        </div>
        <div className="text-center">
          <div className="text-slate-400 mb-1">Min Load</div>
          <div className="text-white font-bold">8,200 MW</div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="mt-4 text-xs text-slate-500 text-center">
        Updated: Just now
      </div>
    </div>
  );
};

export default Dashboard;
