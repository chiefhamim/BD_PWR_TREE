'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Globe, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TickerItem {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  prefix: string;
}

export default function CommodityTicker() {
  const [items, setItems] = useState<TickerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { language, setLanguage, t, formatNum } = useLanguage();

  const fetchMarketData = async () => {
    try {
      const res = await fetch('/api/market-data');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error('Failed to fetch market data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    const pollInterval = setInterval(fetchMarketData, 86400000); // Poll every 24 hours
    return () => clearInterval(pollInterval);
  }, []);

  const usdToBdt = items.find(i => i.id === 'BDT=X')?.value || 117.5;

  return (
    <div
      className="pointer-events-auto absolute top-0 left-0 right-0 flex items-center justify-center z-50 h-10 shadow-lg"
      style={{
        background: 'rgba(8, 12, 20, 0.95)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
        backdropFilter: 'blur(24px)',
      }}
    >
      <div className="flex w-full items-center gap-6 px-6 text-xs font-medium relative h-full">
        
        {/* Left Control Section */}
        <div className="flex items-center gap-4 shrink-0 z-10 bg-[rgba(8,12,20,0.95)] pr-2 shadow-[12px_0_15px_-5px_rgba(8,12,20,0.95)]">
          <div className="flex items-center gap-2 text-slate-300">
            <Globe className="w-4 h-4 text-blue-400 animate-pulse" />
            <span className="uppercase tracking-widest text-[10px] font-bold">
              {t('Live Markets')}
            </span>
          </div>

          {/* Currency Tabs */}
          <div className="flex items-center bg-slate-800/60 p-0.5 rounded-lg border border-slate-700/50">
            <button
              onClick={() => setLanguage('EN')}
              className={`px-3 py-1 rounded-md text-[10px] font-bold tracking-widest transition-colors ${language === 'EN' ? 'bg-blue-500/20 text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              US
            </button>
            <button
              onClick={() => setLanguage('BN')}
              className={`px-3 py-1 rounded-md text-[10px] font-bold tracking-widest transition-colors ${language === 'BN' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              BD
            </button>
          </div>
        </div>

        {/* Ticker Items */}
        <div className="flex-1 overflow-hidden mask-edges group">
          {loading ? (
            <div className="flex items-center gap-2 text-slate-500">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span className="text-[10px] uppercase tracking-wider">Connecting to exchange...</span>
            </div>
          ) : (
            <div className="flex w-max items-center gap-6 animate-marquee group-hover:[animation-play-state:paused] pr-6">
              {[...items, ...items].map((item, index) => {
                const isPositive = item.change >= 0;
                const isForex = item.id === 'BDT=X' || item.id === 'EURBDT=X' || item.id === 'USDT-EUR';
                
                let displayValue = item.value;
                let displayPrefix = item.prefix;

                if (!isForex) {
                  if (language === 'BN') {
                    if (item.id === 'BD_GOLD_22K') {
                      displayValue = item.value;
                      displayPrefix = '৳';
                      // Keep unit as t(item.unit) which is '/ ভরি'
                    } else {
                      displayValue = item.value * usdToBdt;
                      displayPrefix = '৳';
                    }
                  } else {
                    if (item.id === 'BD_GOLD_22K') {
                      // 1 vori = 11.6638 grams
                      // Convert BDT per vori to USD per gram
                      displayValue = (item.value / usdToBdt) / 11.6638;
                      displayPrefix = '$';
                    } else {
                      displayValue = item.value;
                      displayPrefix = '$';
                    }
                  }
                }

                let targetUrl = `https://finance.yahoo.com/quote/${item.id}`;
                if (item.id === 'BD_GOLD_22K') {
                  targetUrl = 'https://www.alaminjewellers.com/gold-price/';
                } else if (item.id === 'BDT=X' || item.id === 'EURBDT=X') {
                  targetUrl = 'https://www.bb.org.bd/en/index.php/econdata/exchangerate';
                }

                return (
                  <a
                    key={`${item.id}-${index}`}
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-all cursor-pointer group/item"
                  >
                    <span className="text-slate-400 font-semibold tracking-tight transition-all duration-300 group-hover/item:text-slate-300">
                      {t(item.name)}
                    </span>
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all duration-300"
                      style={{
                        background: isPositive ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                        border: `1px solid ${isPositive ? 'rgba(52, 211, 153, 0.2)' : 'rgba(248, 113, 113, 0.2)'}`,
                        color: isPositive ? '#34d399' : '#fca5a5',
                      }}
                    >
                      <span className="font-bold font-mono text-[11px] transition-all duration-300">
                        {displayPrefix}{formatNum(displayValue, 2)}
                      </span>
                      {item.unit && (
                        <span className="text-[9px] opacity-70 font-mono transition-all duration-300">
                          {item.id === 'BD_GOLD_22K' && language === 'EN' ? '/ gram' : t(item.unit)}
                        </span>
                      )}
                      <span className="text-[9px] font-bold ml-1 opacity-90">
                        {isPositive ? '+' : ''}{formatNum(Math.abs(item.change), 2)}%
                      </span>
                      {isPositive ? (
                        <TrendingUp className="w-3 h-3 ml-0.5" />
                      ) : (
                        <TrendingDown className="w-3 h-3 ml-0.5" />
                      )}
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
