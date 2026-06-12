import React, { useState } from 'react';
import { Zap, DollarSign, Gauge, Activity, Battery, ShieldCheck, X, Droplet, Flame, AlertTriangle, Landmark } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DashboardStats {
  totalGeneration: number;
  totalCapacity: number;
  peakDemand: number;
  renewable: number;
  unitPrice: number;
  capacityCharge: number;
  systemLoss: number;
  gasSupply: number;
  fuelImport: number;
}

interface DashboardProps {
  stats?: DashboardStats;
}

const DEFAULT_STATS: DashboardStats = {
  totalGeneration: 14400,
  totalCapacity: 31194,
  peakDemand: 15648,
  renewable: 1194,
  unitPrice: 8.95,
  capacityCharge: 280,
  systemLoss: 7.74,
  gasSupply: 2200,
  fuelImport: 18,
};

const DETAIL_MAP: Record<string, { title: string, desc: string, details: { label: string, value: string }[] }> = {
  'Active Gen': {
    title: 'Active Generation',
    desc: 'Real-time power being generated and fed into the national grid.',
    details: [
      { label: 'Current Output', value: '14,400 MW' },
      { label: 'Day Peak', value: '14,800 MW' },
      { label: 'Base Load', value: '9,500 MW' }
    ]
  },
  'Installed': {
    title: 'Installed Capacity',
    desc: 'Total nameplate capacity of all power plants connected to the grid.',
    details: [
      { label: 'Total Capacity', value: '31,194 MW' },
      { label: 'Derated Capacity', value: '29,500 MW' },
      { label: 'Reserve Margin', value: '42%' }
    ]
  },
  'Peak Est': {
    title: 'Peak Demand Estimate',
    desc: 'Estimated maximum demand for the current day during evening peak hours.',
    details: [
      { label: 'Evening Peak', value: '15,648 MW' },
      { label: 'Time Estimate', value: '19:00 - 21:00' },
      { label: 'Previous Day', value: '15,400 MW' }
    ]
  },
  'Bulk Price': {
    title: 'Average Bulk Price',
    desc: 'The weighted average bulk electricity selling price to distribution companies.',
    details: [
      { label: 'Bulk Tariff', value: '8.95 ৳/kWh' },
      { label: 'Retail Avg', value: '8.25 ৳/kWh' },
      { label: 'Subsidy Est', value: '1.20 ৳/kWh' }
    ]
  },
  'Sys Loss': {
    title: 'System Loss',
    desc: 'Combined Transmission and Distribution (T&D) losses across the national grid.',
    details: [
      { label: 'Overall Loss', value: '7.74%' },
      { label: 'Transmission', value: '2.50%' },
      { label: 'Distribution', value: '5.24%' }
    ]
  },
  'Green Mix': {
    title: 'Renewable Energy Mix',
    desc: 'Percentage of total installed capacity derived from renewable sources.',
    details: [
      { label: 'Total Green', value: '1,194 MW' },
      { label: 'Solar Share', value: '850 MW' },
      { label: 'Hydro Share', value: '230 MW' }
    ]
  },
  'Gas Supply': {
    title: 'National Gas Supply',
    desc: 'Total natural gas supplied daily to the national grid by Petrobangla and LNG terminals.',
    details: [
      { label: 'Total Supply', value: '2,200 MMcfd' },
      { label: 'Power Sector Use', value: '950 MMcfd' },
      { label: 'LNG Import', value: '600 MMcfd' }
    ]
  },
  'Fuel Import': {
    title: 'Primary Fuel Imports',
    desc: 'Annual import volume of major fossil fuels (Coal, HFO, HSD) for power generation.',
    details: [
      { label: 'Coal Imports', value: '18 MMTPA' },
      { label: 'Furnace Oil', value: '4.5 MMTPA' },
      { label: 'Diesel', value: '1.2 MMTPA' }
    ]
  },
  'Load Shed': {
    title: 'Estimated Load Shedding',
    desc: 'The power deficit between evening peak demand and active generation.',
    details: [
      { label: 'Current Deficit', value: '1,248 MW' },
      { label: 'Rural Areas', value: '850 MW' },
      { label: 'Urban Areas', value: '398 MW' }
    ]
  },
  'Cap. Charge': {
    title: 'Annual Capacity Charge',
    desc: 'Fixed payments to IPPs and rental power plants to keep them on standby.',
    details: [
      { label: 'Annual Cost', value: '28,000 koti ৳' },
      { label: 'IPPs Share', value: '15,000 koti ৳' },
      { label: 'Rentals Share', value: '13,000 koti ৳' }
    ]
  }
};

const Dashboard: React.FC<DashboardProps> = ({ stats = DEFAULT_STATS }) => {
  const [activeDetail, setActiveDetail] = useState<string | null>(null);
  const { t, formatNum, language } = useLanguage();
  const fontClass = language === 'BN' ? 'font-bengali' : 'font-sans';

  return (
    <div className={fontClass}>
      {/* Details Popup Modal */}
      {activeDetail && DETAIL_MAP[activeDetail] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in pointer-events-auto">
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-500" />
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-black text-white tracking-tight">{t(DETAIL_MAP[activeDetail].title)}</h3>
                  <div className="flex items-center gap-1.5 mt-1.5 mb-2.5 text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                    <span className="text-emerald-500/80">{t('Source')}: <a href="https://bpdb.gov.bd" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 underline decoration-emerald-500/30 underline-offset-2 transition-colors">BPDB / PGCB</a></span>
                    <span className="text-slate-700">•</span>
                    <span>{t('Updated')}: {new Date().toLocaleTimeString(language === 'EN' ? 'en-US' : 'bn-BD', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-xs text-slate-400">{t(DETAIL_MAP[activeDetail].desc)}</p>
                </div>
                <button 
                  onClick={() => setActiveDetail(null)}
                  className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2 mt-6">
                {DETAIL_MAP[activeDetail].details.map((item, idx) => {
                  let finalValue = item.value;
                  if (language === 'EN' && finalValue.includes('৳/kWh')) {
                     finalValue = finalValue
                        .replace(/[0-9.]+/g, (m) => formatNum(parseFloat(m) / 117.5, 3))
                        .replace('৳/kWh', '$/kWh');
                  } else if (language === 'EN' && finalValue.includes('koti ৳')) {
                     finalValue = finalValue
                        .replace(/[0-9,]+/g, (m) => formatNum(parseFloat(m.replace(/,/g, '')) / 11750, 2))
                        .replace('koti ৳', 'B $');
                  } else {
                     if (language !== 'EN' && finalValue.includes('koti ৳')) {
                        const numericMatch = finalValue.match(/[0-9,.]+/);
                        if (numericMatch) {
                           let num = parseFloat(numericMatch[0].replace(/,/g, ''));
                           if (num > 0 && num < 1) {
                              num = num * 100;
                              finalValue = finalValue.replace(/[0-9,.]+/, num.toString()).replace('koti ৳', 'Lakh ৳');
                           }
                        }
                     }
                     
                     finalValue = finalValue
                        .replace(/[0-9,.]+/g, (m) => formatNum(parseFloat(m.replace(/,/g, ''))))
                        .replace('MW', t('MW'))
                        .replace('MMcfd', t('MMcfd'))
                        .replace('MMTPA', t('MMTPA'))
                        .replace('Lakh ৳', t('Lakh ৳'))
                        .replace('koti ৳', t('koti ৳'))
                        .replace('৳/kWh', t('৳/kWh'));
                  }

                  return (
                    <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-800/50 border border-slate-700/30">
                      <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">{t(item.label)}</span>
                      <span className="text-sm font-black text-white font-mono">
                        {finalValue}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="p-4 bg-slate-800/30 border-t border-slate-700/50 text-center">
              <button 
                onClick={() => setActiveDetail(null)}
                className="text-xs font-bold text-blue-400 tracking-widest uppercase hover:text-blue-300 transition-colors"
              >
                {t('Close Panel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard Dock */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-[95vw] md:w-auto pointer-events-auto animate-fade-in flex flex-col items-center">
        
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-[32px] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.6)] w-full">
          
          {/* Status Indicator Pill */}
          <div className="group relative flex flex-col items-center justify-center px-6 py-3 bg-emerald-500/10 rounded-[24px] border border-emerald-500/20 shrink-0 h-full w-full md:w-auto overflow-hidden">
            {/* Radar Sweep Effect */}
            <div className="absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,rgba(16,185,129,0)_0%,rgba(16,185,129,0.1)_50%,rgba(16,185,129,0)_100%)] animate-[spin_4s_linear_infinite] opacity-50" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.15),transparent_70%)]" />

            <div className="relative z-10 flex flex-col items-center w-full">
              <div className="flex items-center gap-1.5 mb-1.5 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/20 shadow-sm">
                <div className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </div>
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">{t('System Live')}</span>
              </div>

              <div className="text-[10px] font-black text-emerald-500/70 uppercase tracking-widest mb-0.5 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">{t('Grid Sync')}</div>
              <div className="flex items-center gap-1.5 text-emerald-300 font-mono text-[14px] font-bold mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                {formatNum(50.03)} {t('Hz')}
              </div>
              
              <div className="w-full h-px bg-emerald-500/20 mb-2" />
              
              <div className="flex items-center justify-between w-full gap-4 px-1">
                <div className="flex flex-col items-center">
                  <span className="text-[8px] text-emerald-500/70 uppercase tracking-widest font-bold mb-0.5">{t('Voltage')}</span>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">400 {t('kV')}</span>
                </div>
                <div className="w-px h-5 bg-emerald-500/20" />
                <div className="flex flex-col items-center">
                  <span className="text-[8px] text-emerald-500/70 uppercase tracking-widest font-bold mb-0.5">{t('Updated')}</span>
                  <span className="text-[9px] font-mono text-emerald-400 font-bold tracking-wider">{new Date().toLocaleTimeString(language === 'EN' ? 'en-US' : 'bn-BD', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Container Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 w-full">
            {[
              { icon: Zap, label: "Active Gen", value: stats.totalGeneration, unit: "MW", color: "#2dd4bf" },
              { icon: Gauge, label: "Installed", value: stats.totalCapacity, unit: "MW", color: "#60a5fa" },
              { icon: Activity, label: "Peak Est", value: stats.peakDemand, unit: "MW", color: "#fbbf24" },
              { icon: AlertTriangle, label: "Load Shed", value: Math.max(0, stats.peakDemand - stats.totalGeneration), unit: "MW", color: "#ef4444" },
              { icon: Droplet, label: "Gas Supply", value: stats.gasSupply, unit: "MMcfd", color: "#38bdf8" },
              
              { icon: Flame, label: "Fuel Import", value: stats.fuelImport, unit: "MMT", color: "#f87171" },
              { icon: DollarSign, label: "Bulk Price", value: language === 'EN' ? stats.unitPrice / 117.5 : stats.unitPrice, unit: language === 'EN' ? "$/kWh" : "৳/kWh", color: "#a78bfa", maxFractions: language === 'EN' ? 3 : 2 },
              { icon: Landmark, label: "Cap. Charge", value: language === 'EN' ? 28000 / 11750 : 280, unit: language === 'EN' ? "B $" : "koti ৳", color: "#f43f5e", maxFractions: 2 },
              { icon: Activity, label: "Sys Loss", value: stats.systemLoss, unit: "%", color: "#fb7185" },
              { icon: Battery, label: "Green Mix", value: (stats.renewable / stats.totalCapacity) * 100, unit: "%", color: "#34d399" },
            ].map((metric, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveDetail(metric.label)}
                className={`group relative flex flex-col items-center justify-center min-w-[120px] px-3 py-3 cursor-pointer overflow-hidden rounded-2xl bg-slate-800/40 border border-slate-700/30 transition-all duration-300 ${fontClass} hover:bg-slate-800/80 hover:border-white/10`}
              >
                {/* New Hover Effect Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* New Hover Effect Bottom Line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/4 h-[2px] opacity-0 group-hover:w-full group-hover:opacity-100 transition-all duration-500 ease-out" style={{ backgroundImage: `linear-gradient(to right, transparent, ${metric.color}, transparent)` }} />

                <div className="relative z-10 flex items-center gap-1.5 mb-1.5">
                  <metric.icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" style={{ color: metric.color }} />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-200 transition-colors">{t(metric.label)}</span>
                </div>
                <div className="relative z-10 flex items-baseline gap-1">
                  <span className="text-lg font-black text-white tracking-tight font-mono group-hover:text-white transition-colors drop-shadow-md">
                    {typeof metric.value === 'number' ? formatNum(metric.value, metric.maxFractions || 2) : metric.value}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-300 transition-colors">{t(metric.unit)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}} />
      </div>
    </div>
  );
};

export default Dashboard;
