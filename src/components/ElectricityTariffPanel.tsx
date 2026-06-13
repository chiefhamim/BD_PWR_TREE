'use client';

import React, { useState } from 'react';
import {
  Home,
  Building,
  Wrench,
  Factory,
  Zap,
  Sprout,
  Lamp,
  Heart,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Shield,
  X,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CUSTOMER_TARIFFS, type CustomerTariff } from '@/data/officialData';

const ICON_MAP: Record<string, React.FC<{ className?: string; style?: React.CSSProperties }>> = {
  home: Home,
  building: Building,
  wrench: Wrench,
  factory: Factory,
  zap: Zap,
  sprout: Sprout,
  lamp: Lamp,
  heart: Heart,
};

export default function ElectricityTariffPanel({ onOpenChange }: { onOpenChange?: (isOpen: boolean) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const { t, formatNum, language } = useLanguage();
  const fontClass = language === 'BN' ? 'font-bengali' : 'font-sans';

  const toggleCategory = (key: string) => {
    setExpandedCategory(prev => (prev === key ? null : key));
  };

  const formatPrice = (price: number): string => {
    if (language === 'EN') {
      return `$${formatNum(price / 117.5, 4)}`;
    }
    return `৳${formatNum(price, 2)}`;
  };

  const formatPriceUnit = (): string => {
    return language === 'EN' ? '/Unit' : '/ইউনিট';
  };

  return (
    <>
      {/* Trigger Button — sits in the UI overlay */}
      <button
        onClick={() => handleOpenChange(true)}
        className={`group flex items-center gap-3 px-5 py-3 rounded-full transition-all duration-300 hover:scale-105 active:scale-[0.98] ${fontClass} relative overflow-hidden`}
        style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          boxShadow: '0 0 20px rgba(245, 158, 11, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        }}
        title={t('Electricity Tariff')}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="relative">
            <Zap className="w-5 h-5 text-amber-400 group-hover:text-amber-300 transition-colors drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </div>
          <span className="text-[12px] font-black text-amber-50 uppercase tracking-widest drop-shadow-md">
            {t('Tariff Rates')}
          </span>
        </div>
      </button>

      {/* Full-screen Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in"
          style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) handleOpenChange(false); }}
        >
          <div
            className={`relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-3xl animate-slide-up ${fontClass}`}
            style={{
              background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(8, 12, 20, 0.99) 100%)',
              border: '1px solid rgba(148, 163, 184, 0.12)',
              boxShadow: '0 25px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255,255,255,0.03) inset',
            }}
          >
            {/* Top gradient bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />

            {/* Header */}
            <div className="sticky top-0 z-10 px-6 pt-6 pb-4" style={{ background: 'rgba(15, 23, 42, 0.98)', backdropFilter: 'blur(16px)' }}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                      <Zap className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-white tracking-tight">
                        {t('Electricity Tariff')}
                      </h2>
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">
                        {t('All Customer Categories')}
                      </p>
                    </div>
                  </div>

                  {/* Source badge */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest"
                      style={{ background: 'rgba(52, 211, 153, 0.08)', border: '1px solid rgba(52, 211, 153, 0.15)', color: 'rgb(52, 211, 153)' }}
                    >
                      <Shield className="w-3 h-3" />
                      {t('Official Data')}
                    </div>
                    <a
                      href="https://berc.org.bd"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-slate-500 hover:text-blue-400 transition-colors"
                      style={{ background: 'rgba(148, 163, 184, 0.06)', border: '1px solid rgba(148, 163, 184, 0.1)' }}
                    >
                      {t('Source')}: BERC
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenChange(false)}
                  className="p-2 rounded-xl bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700/80 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto px-6 pb-6 space-y-2.5" style={{ maxHeight: 'calc(85vh - 160px)' }}>
              {CUSTOMER_TARIFFS.map((tariff) => (
                <TariffCard
                  key={tariff.key}
                  tariff={tariff}
                  isExpanded={expandedCategory === tariff.key}
                  onToggle={() => toggleCategory(tariff.key)}
                  formatPrice={formatPrice}
                  formatPriceUnit={formatPriceUnit}
                  t={t}
                  formatNum={formatNum}
                  language={language}
                />
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-800/60 text-center">
              <p className="text-[9px] text-slate-600 font-medium uppercase tracking-wider">
                {t('Tariff effective per BERC Gazette')} · {t('Last Verified')}: {language === 'BN' ? '১৩ জুন ২০২৬' : 'June 13, 2026'}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Sub-component: Individual Tariff Card ───────────────────────────────────

interface TariffCardProps {
  tariff: CustomerTariff;
  isExpanded: boolean;
  onToggle: () => void;
  formatPrice: (price: number) => string;
  formatPriceUnit: () => string;
  t: (key: string) => string;
  formatNum: (num: number, maxFractions?: number) => string;
  language: string;
}

function TariffCard({
  tariff,
  isExpanded,
  onToggle,
  formatPrice,
  formatPriceUnit,
  t,
  formatNum,
  language,
}: TariffCardProps) {
  const IconComponent = ICON_MAP[tariff.icon] || Zap;
  const primaryRate = tariff.slabs[0]?.pricePerKwh ?? 0;
  const hasMultipleSlabs = tariff.slabs.length > 1;

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: isExpanded
          ? 'rgba(148, 163, 184, 0.06)'
          : 'rgba(148, 163, 184, 0.03)',
        border: `1px solid ${isExpanded ? `${tariff.color}25` : 'rgba(148, 163, 184, 0.06)'}`,
      }}
    >
      {/* Clickable Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 group transition-all duration-300 hover:bg-white/[0.02]"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
            style={{
              background: `${tariff.color}15`,
              border: `1px solid ${tariff.color}25`,
              boxShadow: isExpanded ? `0 0 16px ${tariff.color}20` : 'none',
            }}
          >
            <IconComponent className="w-5 h-5" style={{ color: tariff.color }} />
          </div>
          <div className="text-left">
            <div className="text-sm font-bold text-white group-hover:text-white transition-colors tracking-tight">
              {t(tariff.label)}
            </div>
            <div className="text-[10px] text-slate-500 font-medium mt-0.5">
              {t(tariff.description)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Prominent rate display */}
          <div className="text-right mr-1">
            <div className="text-base font-black font-mono tracking-tight" style={{ color: tariff.color }}>
              {formatPrice(primaryRate)}
            </div>
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
              {formatPriceUnit()}
              {hasMultipleSlabs && ` ${t('(starts)')}`}
            </div>
          </div>
          <div className="text-slate-500 transition-transform duration-300" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </button>

      {/* Expandable Slab Details */}
      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: isExpanded ? '600px' : '0', opacity: isExpanded ? 1 : 0 }}
      >
        <div className="px-4 pb-4 pt-1">
          {/* Slab table */}
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(148, 163, 184, 0.08)' }}>
            {/* Table Header */}
            <div
              className="grid gap-1 px-4 py-2.5 text-[9px] font-bold uppercase tracking-widest text-slate-500"
              style={{
                gridTemplateColumns: tariff.slabs[0]?.demandCharge !== undefined ? '1fr 1fr 1fr' : '1fr 1fr',
                background: 'rgba(15, 23, 42, 0.6)',
              }}
            >
              <span>{t('Slab / Tier')}</span>
              <span className="text-right">{t('Energy Charge')}</span>
              {tariff.slabs[0]?.demandCharge !== undefined && (
                <span className="text-right">{t('Demand Charge')}</span>
              )}
            </div>

            {/* Slab Rows */}
            {tariff.slabs.map((slab, idx) => (
              <div
                key={idx}
                className="grid gap-1 px-4 py-3 transition-colors hover:bg-white/[0.02]"
                style={{
                  gridTemplateColumns: slab.demandCharge !== undefined ? '1fr 1fr 1fr' : '1fr 1fr',
                  borderTop: '1px solid rgba(148, 163, 184, 0.05)',
                }}
              >
                <span className="text-xs text-slate-300 font-semibold">
                  {t(slab.range)}
                </span>
                <span className="text-xs font-bold font-mono text-right" style={{ color: tariff.color }}>
                  {formatPrice(slab.pricePerKwh)}
                </span>
                {slab.demandCharge !== undefined && (
                  <span className="text-xs font-mono text-right text-slate-400">
                    {language === 'EN'
                      ? `$${formatNum(slab.demandCharge / 117.5, 2)}/kW`
                      : `৳${formatNum(slab.demandCharge, 0)}/kW`
                    }
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Minimum charge footnote */}
          {tariff.minimumCharge && (
            <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-slate-500">
              <span className="text-amber-500/70">⚡</span>
              {t('Minimum monthly charge')}: {language === 'EN' ? `$${formatNum(tariff.minimumCharge / 117.5, 2)}` : `৳${formatNum(tariff.minimumCharge, 0)}`}
            </div>
          )}

          {/* Verified source line */}
          <div className="mt-2 flex items-center gap-1.5 text-[9px] text-slate-600 font-mono">
            <Shield className="w-3 h-3 text-emerald-500/50" />
            <span>{t('Source')}: {tariff.source}</span>
            <span className="text-slate-700">·</span>
            <span>{t('Verified')}: {tariff.lastVerified}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
