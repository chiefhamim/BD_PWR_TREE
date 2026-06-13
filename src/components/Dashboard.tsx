import React, { useState } from 'react';
import { Zap, DollarSign, Gauge, Activity, Battery, ShieldCheck, X, Droplet, Flame, AlertTriangle, Landmark } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getDashboardStats, DETAIL_MAP as OFFICIAL_DETAIL_MAP, SYSTEM_STATUS } from '@/data/officialData';

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

// All defaults now flow from the single source of truth
const DEFAULT_STATS: DashboardStats = getDashboardStats();

// Detail map also sourced from officialData — convert to the shape the UI expects
const DETAIL_MAP: Record<string, { title: string, desc: string, source: string, sourceUrl: string, details: { label: string, value: string }[] }> = Object.fromEntries(
  Object.entries(OFFICIAL_DETAIL_MAP).map(([key, entry]) => [
    key,
    {
      title: entry.title,
      desc: entry.desc,
      source: entry.source,
      sourceUrl: entry.sourceUrl,
      details: entry.details,
    },
  ])
);

const MetricCard = ({ metric, t, formatNum, setActiveDetail, fontClass }: any) => (
  <div 
    onClick={() => setActiveDetail(metric.label)}
    className={`group relative flex flex-col items-center justify-center min-w-[120px] px-3 py-3 cursor-pointer overflow-hidden rounded-2xl bg-slate-800/40 border border-slate-700/30 transition-all duration-300 ${fontClass} hover:bg-slate-800/80 hover:border-white/10 text-center`}
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
);

const Dashboard: React.FC<DashboardProps> = ({ stats = DEFAULT_STATS }) => {
  const [activeDetail, setActiveDetail] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { t, formatNum, language, currency, exchangeRate } = useLanguage();
  const fontClass = language === 'BN' ? 'font-bengali' : 'font-sans';

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={fontClass}>
      {/* Details Popup Modal */}
      {activeDetail && DETAIL_MAP[activeDetail] && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-[2px] animate-fade-in pointer-events-auto"
          onClick={() => setActiveDetail(null)}
        >
          <div 
            className="relative w-full max-w-[420px] bg-slate-900/95 backdrop-blur-md border border-slate-700/60 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Area */}
            <div className="px-6 py-5 bg-slate-800/30 border-b border-slate-700/60 flex justify-between items-start">
              <div>
                <h3 className="text-[17px] font-semibold text-slate-100 tracking-wide mb-1.5">{t(DETAIL_MAP[activeDetail].title)}</h3>
                <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
                  <span className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {t('Live')}
                  </span>
                  <span>•</span>
                  <span>{t('Source')}: <a href={DETAIL_MAP[activeDetail].sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors underline decoration-slate-600 underline-offset-2">{DETAIL_MAP[activeDetail].source}</a></span>
                </div>
              </div>
              <button 
                onClick={() => setActiveDetail(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Description Area */}
            <div className="px-6 pt-5 pb-2">
              <p className="text-[13px] leading-relaxed text-slate-300 font-normal">
                {t(DETAIL_MAP[activeDetail].desc)}
              </p>
            </div>

            {/* Content Area */}
            <div className="px-6 pb-6 pt-4">
              <div className="flex flex-col gap-0.5">
                {DETAIL_MAP[activeDetail].details.map((item, idx) => {
                  let finalValue = t(item.value);
                  
                  // Apply dynamic currency conversion using the real exchange rate
                  if (currency === 'USD') {
                    if (finalValue.includes('৳/Unit')) {
                       finalValue = finalValue
                          .replace(/[0-9.]+/g, (m) => formatNum(parseFloat(m) / exchangeRate, 3))
                          .replace('৳/Unit', '$/Unit');
                    } else if (finalValue.includes('koti ৳')) {
                       finalValue = finalValue
                          .replace(/[0-9,.]+/g, (m) => {
                             const numCroreBDT = parseFloat(m.replace(/,/g, ''));
                             const numBDT = numCroreBDT * 10000000;
                             const numUSD = numBDT / exchangeRate;
                             return formatNum(numUSD / 1000000, 2);
                          })
                          .replace('koti ৳', 'M $');
                    } else {
                       // Still fallback formats for standard numeric
                       finalValue = finalValue
                          .replace(/[0-9,.]+/g, (m) => formatNum(parseFloat(m.replace(/,/g, ''))))
                          .replace('MW', t('MW'));
                    }
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
                     
                     if (language !== 'EN' && finalValue.includes('MMcfd')) {
                        finalValue = finalValue.replace(/[0-9,.]+/g, (m) => formatNum(parseFloat(m.replace(/,/g, '')) / 10)).replace('MMcfd', t('Koti cfd'));
                     } else if (language !== 'EN' && (finalValue.includes('MMTPA') || finalValue.includes('MMT'))) {
                        finalValue = finalValue.replace(/[0-9,.]+/g, (m) => formatNum(parseFloat(m.replace(/,/g, '')) / 10)).replace(/MMTPA|MMT/g, t('Koti MT'));
                     } else {
                        finalValue = finalValue
                           .replace(/[0-9,.]+/g, (m) => formatNum(parseFloat(m.replace(/,/g, ''))))
                           .replace('MW', t('MW'))
                           .replace('Lakh ৳', t('Lakh ৳'))
                           .replace('koti ৳', t('koti ৳'))
                           .replace('৳/Unit', t('৳/Unit'));
                     }
                  }

                  return (
                    <div key={idx} className="flex justify-between items-center py-2.5 border-b border-slate-700/40 last:border-0 group">
                      <span className="text-[13px] font-medium text-slate-400 group-hover:text-slate-300 transition-colors">{t(item.label)}</span>
                      <span className="text-[14px] font-semibold text-slate-100 font-mono tracking-tight group-hover:text-white transition-colors">
                        {finalValue}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Close Button Footer */}
            <div className="p-4 bg-slate-800/40 border-t border-slate-700/60 text-center">
              <button 
                onClick={() => setActiveDetail(null)}
                className="w-full py-2.5 rounded-lg text-[11px] font-black text-rose-400 tracking-[0.2em] uppercase hover:text-white hover:bg-rose-500/20 border border-transparent hover:border-rose-500/30 transition-all duration-300"
              >
                {t('Close Panel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard Dock */}
      <div className="absolute bottom-6 left-0 right-0 z-20 pointer-events-none flex justify-center w-full px-4 xl:px-8">
        
        <div className="pointer-events-auto flex flex-col xl:flex-row items-center justify-between gap-4 xl:gap-8 bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-[32px] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)] w-full max-w-[1800px]">
          
          {/* Left 5 Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 flex-1 w-full xl:w-auto">
            {[
              { icon: Zap, label: "Active Gen", emoji: "⚡", value: stats.totalGeneration, unit: "MW", color: "#2dd4bf" },
              { icon: Gauge, label: "Installed", emoji: "🏭", value: stats.totalCapacity, unit: "MW", color: "#60a5fa" },
              { icon: Activity, label: "Peak Est", emoji: "📈", value: stats.peakDemand, unit: "MW", color: "#fbbf24" },
              { icon: AlertTriangle, label: "Load Shed", emoji: "⚠️", value: Math.max(0, stats.peakDemand - stats.totalGeneration), unit: "MW", color: "#ef4444" },
              { icon: Droplet, label: "Gas Supply", emoji: "🔥", value: language === 'EN' ? stats.gasSupply : stats.gasSupply / 10, unit: language === 'EN' ? "MMcfd" : "Koti cfd", color: "#38bdf8", maxFractions: 1 },
            ].map((metric, idx) => (
              <MetricCard key={`left-${idx}`} metric={metric} t={t} formatNum={formatNum} setActiveDetail={setActiveDetail} fontClass={fontClass} />
            ))}
          </div>

          {/* Center Status Indicator - New Command Center Style */}
          <div 
            className="shrink-0 group relative flex flex-col items-center justify-center min-w-[220px] px-8 py-3.5 cursor-pointer overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 transition-all duration-500 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] text-center w-full md:w-auto shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            onClick={() => setActiveDetail('System Status')}
          >
            {/* Inner Glow and Top Accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-1/2 h-4 bg-emerald-500/20 blur-xl rounded-full opacity-50 group-hover:opacity-80 transition-opacity" />
            
            {/* Hover Sweep */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/0 via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Custom Modern Tooltip */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-900 border border-slate-700/80 text-emerald-400 text-[10px] uppercase tracking-widest font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 transform translate-y-1 group-hover:translate-y-0">
              {t('View System Details')}
            </div>
            
            <div className="relative z-10 flex flex-col items-center justify-center w-full">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                </span>
                <span className="text-[10px] font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-500 uppercase tracking-[0.2em]">{t('System Live')}</span>
              </div>

              <div className="flex items-center justify-center gap-2 text-emerald-400 font-mono text-[22px] font-black tracking-tight mb-1 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)] group-hover:text-emerald-300 transition-colors">
                <ShieldCheck className="w-5 h-5 opacity-80" />
                {formatNum(SYSTEM_STATUS.frequency)} <span className="text-emerald-500/50 text-[12px] font-sans ml-0.5">{t('Hz')}</span>
              </div>
              
              <div className="flex items-center justify-between w-full gap-5 px-2 mt-1 border-t border-slate-800/80 pt-2">
                <div className="flex flex-col items-center">
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">{t('Voltage')}</span>
                  <span className="text-[12px] font-mono text-slate-200 font-bold group-hover:text-white transition-colors">400<span className="text-slate-400 text-[10px] ml-0.5">{t('kV')}</span></span>
                </div>
                <div className="w-px h-5 bg-slate-800" />
                <div className="flex flex-col items-center">
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">{t('Updated')}</span>
                  <span className="text-[11px] font-mono text-slate-300 font-medium tracking-wider group-hover:text-white transition-colors">{mounted ? new Date().toLocaleTimeString(language === 'EN' ? 'en-US' : 'bn-BD', { hour: '2-digit', minute: '2-digit', hour12: true }) : '--:--'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right 5 Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 flex-1 w-full xl:w-auto">
            {[
              { icon: Flame, label: "Fuel Import", emoji: "🛢️", value: language === 'EN' ? stats.fuelImport : stats.fuelImport / 10, unit: language === 'EN' ? "KMT" : "Lakh MT", color: "#f87171", maxFractions: 1 },
              { icon: DollarSign, label: "Bulk Price", emoji: "💰", value: currency === 'USD' ? stats.unitPrice / exchangeRate : stats.unitPrice, unit: currency === 'USD' ? "$/Unit" : "৳/Unit", color: "#a78bfa", maxFractions: currency === 'USD' ? 3 : 2 },
              { icon: Landmark, label: "Cap. Charge", emoji: "🏦", value: currency === 'USD' ? (76.71 * 1e7) / (exchangeRate * 1e6) : 76.71, unit: currency === 'USD' ? "M $" : "koti ৳", color: "#f43f5e", maxFractions: 2 },
              { icon: Activity, label: "Sys Loss", emoji: "📉", value: stats.systemLoss, unit: "%", color: "#fb7185" },
              { icon: Battery, label: "Green Mix", emoji: "🌿", value: (stats.renewable / stats.totalCapacity) * 100, unit: "%", color: "#34d399" },
            ].map((metric, idx) => (
              <MetricCard key={`right-${idx}`} metric={metric} t={t} formatNum={formatNum} setActiveDetail={setActiveDetail} fontClass={fontClass} />
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
