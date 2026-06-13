/**
 * ============================================================================
 * OFFICIAL DATA SOURCE — Bangladesh Power Sector
 * ============================================================================
 * 
 * This file is the SINGLE SOURCE OF TRUTH for all dashboard metrics, system
 * status, and tariff data displayed on the BD Power Tree website.
 *
 * ⚡ DATA GOVERNANCE
 * -  Every value here must come from a verified/official government or
 *    regulatory source.
 * -  When updating any field, also update the corresponding `source`,
 *    `sourceUrl`, and `lastVerified` metadata.
 * -  The frontend components read from these exports — never hardcode data
 *    in UI files.
 *
 * 📋 SOURCES
 * -  BPDB Daily Generation Report  → https://www.bpdb.gov.bd
 * -  PGCB Real-Time Data           → https://pgcb.net.bd
 * -  BERC Tariff Gazette           → https://berc.org.bd
 * -  Petrobangla Annual Report     → https://petrobangla.gov.bd
 * -  BPC Import Statistics         → https://bpc.gov.bd
 * -  Power Division / MoPEMR       → https://power.gov.bd
 *
 * 🔄 HOW TO UPDATE
 *    1. Locate the relevant section below.
 *    2. Change the `value` field to the new official number.
 *    3. Update `lastVerified` to today's date (ISO 8601).
 *    4. Update `sourceUrl` if the reference page changed.
 *    5. Commit with a message like: "data: update peakDemand from PGCB Jun 2026"
 *
 * ============================================================================
 */

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────

export interface OfficialMetric {
  /** Machine-readable key */
  key: string;
  /** Human-readable label */
  label: string;
  /** The official numeric value */
  value: number;
  /** Display unit */
  unit: string;
  /** Official data source name */
  source: string;
  /** URL to verify the data */
  sourceUrl: string;
  /** ISO 8601 date when this was last verified against the official source */
  lastVerified: string;
  /** Optional note / context */
  note?: string;
}

export interface SystemStatusData {
  /** Grid operational status: 'operational' | 'degraded' | 'critical' */
  gridStatus: 'operational' | 'degraded' | 'critical';
  /** Grid frequency in Hz */
  frequency: number;
  /** Transmission voltage level (kV) */
  voltage: number;
  /** Data source */
  source: string;
  sourceUrl: string;
  lastVerified: string;
}

export interface TariffSlab {
  /** Range label, e.g. "0–75 Unit" or "Flat Rate" */
  range: string;
  /** Price per Unit in BDT (Taka) */
  pricePerKwh: number;
  /** Optional demand charge per kW (for industrial/commercial) */
  demandCharge?: number;
}

export interface CustomerTariff {
  /** Customer category key */
  key: string;
  /** Display label */
  label: string;
  /** Short description */
  description: string;
  /** Icon name from lucide-react */
  icon: string;
  /** Accent color (hex) */
  color: string;
  /** Tariff slabs / tiers */
  slabs: TariffSlab[];
  /** Min charge applicable */
  minimumCharge?: number;
  /** Source and verification */
  source: string;
  sourceUrl: string;
  lastVerified: string;
}

// ──────────────────────────────────────────────────────────────────────────────
// 1. SYSTEM STATUS — sourced from PGCB / NLDC real-time dashboard
// ──────────────────────────────────────────────────────────────────────────────

export const SYSTEM_STATUS: SystemStatusData = {
  gridStatus: 'operational',
  frequency: 50.03,
  voltage: 400,
  source: 'PGCB / NLDC',
  sourceUrl: 'https://pgcb.net.bd',
  lastVerified: '2026-06-13',
};

// ──────────────────────────────────────────────────────────────────────────────
// 2. DASHBOARD METRICS — sourced from BPDB / PGCB / Petrobangla / BPC
// ──────────────────────────────────────────────────────────────────────────────

export const DASHBOARD_METRICS: Record<string, OfficialMetric> = {
  totalGeneration: {
    key: 'totalGeneration',
    label: 'Active Gen',
    value: 14400,
    unit: 'MW',
    source: 'PGCB Daily Report',
    sourceUrl: 'https://pgcb.net.bd',
    lastVerified: '2026-06-13',
    note: 'Real-time generation fed into the national grid',
  },
  totalCapacity: {
    key: 'totalCapacity',
    label: 'Installed',
    value: 31194,
    unit: 'MW',
    source: 'BPDB Annual Report 2024-25',
    sourceUrl: 'https://www.bpdb.gov.bd',
    lastVerified: '2026-06-13',
    note: 'Total nameplate capacity of all connected plants',
  },
  peakDemand: {
    key: 'peakDemand',
    label: 'Peak Est',
    value: 15648,
    unit: 'MW',
    source: 'PGCB Daily Demand Forecast',
    sourceUrl: 'https://pgcb.net.bd',
    lastVerified: '2026-06-13',
    note: 'Estimated maximum demand during evening peak hours',
  },
  renewable: {
    key: 'renewable',
    label: 'Green Mix',
    value: 1194,
    unit: 'MW',
    source: 'SREDA / Power Division',
    sourceUrl: 'https://power.gov.bd',
    lastVerified: '2026-06-13',
    note: 'Total installed renewable capacity (solar + hydro + wind)',
  },
    unitPrice: {
    key: 'unitPrice',
    label: 'Bulk Price',
    value: 8.95,
    unit: '৳/Unit',
    source: 'BERC Tariff Order 2024',
    sourceUrl: 'https://berc.org.bd',
    lastVerified: '2026-06-13',
    note: 'Weighted average bulk selling price to distribution companies',
  },
  capacityCharge: {
    key: 'capacityCharge',
    label: 'Cap. Charge',
    value: 76.71,
    unit: 'koti ৳',
    source: 'BPDB Financial Statement',
    sourceUrl: 'https://www.bpdb.gov.bd',
    lastVerified: '2026-06-13',
    note: 'Daily capacity charge paid to IPPs and rental plants (in crore BDT)',
  },
  systemLoss: {
    key: 'systemLoss',
    label: 'Sys Loss',
    value: 7.74,
    unit: '%',
    source: 'BPDB Annual Report 2024-25',
    sourceUrl: 'https://www.bpdb.gov.bd',
    lastVerified: '2026-06-13',
    note: 'Combined T&D loss across national grid',
  },
  gasSupply: {
    key: 'gasSupply',
    label: 'Gas Supply',
    value: 2200,
    unit: 'MMcfd',
    source: 'Petrobangla Daily Gas Report',
    sourceUrl: 'https://petrobangla.gov.bd',
    lastVerified: '2026-06-13',
    note: 'Total gas supplied daily including domestic + LNG',
  },
  fuelImport: {
    key: 'fuelImport',
    label: 'Fuel Import',
    value: 49.3,
    unit: 'KMT',
    source: 'BPC Import Statistics',
    sourceUrl: 'https://bpc.gov.bd',
    lastVerified: '2026-06-13',
    note: 'Annual fossil fuel imports (Coal + HFO + HSD)',
  },
};

/**
 * Helper: get a flat stats object suitable for the Dashboard component.
 * This is the ONLY way the Dashboard should get its data.
 */
export function getDashboardStats() {
  return {
    totalGeneration: DASHBOARD_METRICS.totalGeneration.value,
    totalCapacity: DASHBOARD_METRICS.totalCapacity.value,
    peakDemand: DASHBOARD_METRICS.peakDemand.value,
    renewable: DASHBOARD_METRICS.renewable.value,
    unitPrice: DASHBOARD_METRICS.unitPrice.value,
    capacityCharge: DASHBOARD_METRICS.capacityCharge.value,
    systemLoss: DASHBOARD_METRICS.systemLoss.value,
    gasSupply: DASHBOARD_METRICS.gasSupply.value,
    fuelImport: DASHBOARD_METRICS.fuelImport.value,
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// 3. DASHBOARD DETAIL MAP — sourced from official reports
//    These populate the detail popup modals for each metric card.
// ──────────────────────────────────────────────────────────────────────────────

export interface DetailMapEntry {
  title: string;
  desc: string;
  source: string;
  sourceUrl: string;
  lastVerified: string;
  details: { label: string; value: string }[];
}

export const DETAIL_MAP: Record<string, DetailMapEntry> = {
  'Active Gen': {
    title: 'Active Generation',
    desc: 'Real-time power being generated and fed into the national grid.',
    source: 'PGCB / NLDC',
    sourceUrl: 'https://pgcb.net.bd',
    lastVerified: '2026-06-13',
    details: [
      { label: 'Current Output', value: '14,400 MW' },
      { label: 'Day Peak', value: '14,800 MW' },
      { label: 'Base Load', value: '9,500 MW' },
    ],
  },
  'Installed': {
    title: 'Installed Capacity',
    desc: 'Total nameplate capacity of all power plants connected to the grid.',
    source: 'BPDB Annual Report',
    sourceUrl: 'https://www.bpdb.gov.bd',
    lastVerified: '2026-06-13',
    details: [
      { label: 'Total Capacity', value: '31,194 MW' },
      { label: 'Derated Capacity', value: '29,500 MW' },
      { label: 'Reserve Margin', value: '42%' },
    ],
  },
  'Peak Est': {
    title: 'Peak Demand Estimate',
    desc: 'Estimated maximum demand for the current day during evening peak hours.',
    source: 'PGCB Daily Forecast',
    sourceUrl: 'https://pgcb.net.bd',
    lastVerified: '2026-06-13',
    details: [
      { label: 'Evening Peak', value: '15,648 MW' },
      { label: 'Time Estimate', value: '19:00 - 21:00' },
      { label: 'Previous Day', value: '15,400 MW' },
    ],
  },
  'Bulk Price': {
    title: 'Average Bulk Price',
    desc: 'The weighted average bulk electricity selling price to distribution companies.',
    source: 'BERC Tariff Order',
    sourceUrl: 'https://berc.org.bd',
    lastVerified: '2026-06-13',
    details: [
      { label: 'Bulk Tariff', value: '8.95 ৳/Unit' },
      { label: 'Retail Avg', value: '8.25 ৳/Unit' },
      { label: 'Subsidy Est', value: '1.20 ৳/Unit' },
    ],
  },
  'Sys Loss': {
    title: 'System Loss',
    desc: 'Combined Transmission and Distribution (T&D) losses across the national grid.',
    source: 'BPDB Annual Report',
    sourceUrl: 'https://www.bpdb.gov.bd',
    lastVerified: '2026-06-13',
    details: [
      { label: 'Overall Loss', value: '7.74%' },
      { label: 'Transmission', value: '2.50%' },
      { label: 'Distribution', value: '5.24%' },
    ],
  },
  'Green Mix': {
    title: 'Renewable Energy Mix',
    desc: 'Percentage of total installed capacity derived from renewable sources.',
    source: 'SREDA / Power Division',
    sourceUrl: 'https://power.gov.bd',
    lastVerified: '2026-06-13',
    details: [
      { label: 'Total Green', value: '1,194 MW' },
      { label: 'Solar Share', value: '850 MW' },
      { label: 'Hydro Share', value: '230 MW' },
    ],
  },
  'Gas Supply': {
    title: 'National Gas Supply',
    desc: 'Total natural gas supplied daily to the national grid by Petrobangla and LNG terminals.',
    source: 'Petrobangla',
    sourceUrl: 'https://petrobangla.gov.bd',
    lastVerified: '2026-06-13',
    details: [
      { label: 'Daily Volume', value: '2,200 MMcf' },
      { label: 'Monthly Volume', value: '66,000 MMcf' },
      { label: 'Yearly Volume', value: '803,000 MMcf' },
      { label: 'Power Sector Use', value: '950 MMcf/day' },
      { label: 'LNG Import', value: '600 MMcf/day' },
    ],
  },
  'Fuel Import': {
    title: 'Primary Fuel Imports',
    desc: 'Annual import volume of major fossil fuels (Coal, HFO, HSD) for power generation.',
    source: 'BPC',
    sourceUrl: 'https://bpc.gov.bd',
    lastVerified: '2026-06-13',
    details: [
      { label: 'Daily Import', value: '49.3 KMT' },
      { label: 'Monthly Import', value: '1.5 MMT' },
      { label: 'Yearly Import', value: '18 MMT' },
      { label: 'Coal Imports', value: '18 MMTPA' },
      { label: 'Furnace Oil', value: '4.5 MMTPA' },
    ],
  },
  'Load Shed': {
    title: 'Estimated Load Shedding',
    desc: 'The power deficit between evening peak demand and active generation.',
    source: 'PGCB / NLDC',
    sourceUrl: 'https://pgcb.net.bd',
    lastVerified: '2026-06-13',
    details: [
      { label: 'Current Deficit', value: '1,248 MW' },
      { label: 'Rural Areas', value: '850 MW' },
      { label: 'Urban Areas', value: '398 MW' },
    ],
  },
  'System Status': {
    title: 'National Grid Status',
    desc: 'Real-time frequency and voltage parameters of the Bangladesh National Grid.',
    source: 'NLDC Live Dashboard',
    sourceUrl: 'https://pgcb.net.bd',
    lastVerified: '2026-06-13',
    details: [
      { label: 'Grid Frequency', value: '50.0 Hz (Target)' },
      { label: 'Transmission Voltage', value: '400kV / 230kV' },
      { label: 'Distribution Voltage', value: '132kV / 33kV / 11kV' },
      { label: 'Consumer Voltage', value: '230V (Single) / 400V (3-Phase)' },
    ],
  },
  'Cap. Charge': {
    title: 'Capacity Charge',
    desc: 'Fixed payments to IPPs and rental power plants to keep them on standby.',
    source: 'BPDB Financial Statement',
    sourceUrl: 'https://www.bpdb.gov.bd',
    lastVerified: '2026-06-13',
    details: [
      { label: 'Daily Cost', value: '76.71 koti ৳' },
      { label: 'Monthly Cost', value: '2,333 koti ৳' },
      { label: 'Yearly Cost', value: '28,000 koti ৳' },
    ],
  },
};


// ──────────────────────────────────────────────────────────────────────────────
// 4. ELECTRICITY TARIFF BY CUSTOMER CATEGORY
//    Source: BERC Tariff Order (Gazette) — Bangladesh Energy Regulatory Commission
//    Reference: https://berc.org.bd
//    Effective: February 2024 onward
// ──────────────────────────────────────────────────────────────────────────────

export const CUSTOMER_TARIFFS: CustomerTariff[] = [
  {
    key: 'residential',
    label: 'Residential',
    description: 'Households and domestic meter connections',
    icon: 'home',
    color: '#60a5fa',
    minimumCharge: 75,
    slabs: [
      { range: '0–75 Unit', pricePerKwh: 4.19 },
      { range: '76–200 Unit', pricePerKwh: 5.72 },
      { range: '201–300 Unit', pricePerKwh: 6.00 },
      { range: '301–400 Unit', pricePerKwh: 6.34 },
      { range: '401–600 Unit', pricePerKwh: 9.94 },
      { range: '601+ Unit', pricePerKwh: 11.46 },
    ],
    source: 'BERC Tariff Order 2024',
    sourceUrl: 'https://berc.org.bd',
    lastVerified: '2026-06-13',
  },
  {
    key: 'commercial',
    label: 'Commercial',
    description: 'Shops, offices, malls, and service sector',
    icon: 'building',
    color: '#a78bfa',
    slabs: [
      { range: 'Flat Rate', pricePerKwh: 9.30, demandCharge: 45 },
    ],
    source: 'BERC Tariff Order 2024',
    sourceUrl: 'https://berc.org.bd',
    lastVerified: '2026-06-13',
  },
  {
    key: 'industrial-small',
    label: 'Small Industry',
    description: 'Connected load up to 120 kW',
    icon: 'wrench',
    color: '#fbbf24',
    slabs: [
      { range: 'Flat Rate', pricePerKwh: 8.62, demandCharge: 40 },
    ],
    source: 'BERC Tariff Order 2024',
    sourceUrl: 'https://berc.org.bd',
    lastVerified: '2026-06-13',
  },
  {
    key: 'industrial-medium',
    label: 'Medium Industry',
    description: 'Connected load 120 kW – 5 MW',
    icon: 'factory',
    color: '#f97316',
    slabs: [
      { range: 'Peak Hours', pricePerKwh: 10.40, demandCharge: 45 },
      { range: 'Off-Peak', pricePerKwh: 7.10, demandCharge: 45 },
      { range: 'Flat Rate', pricePerKwh: 8.63, demandCharge: 45 },
    ],
    source: 'BERC Tariff Order 2024',
    sourceUrl: 'https://berc.org.bd',
    lastVerified: '2026-06-13',
  },
  {
    key: 'industrial-large',
    label: 'Large Industry',
    description: 'Connected load above 5 MW (132 kV+)',
    icon: 'zap',
    color: '#ef4444',
    slabs: [
      { range: 'Peak Hours', pricePerKwh: 10.05, demandCharge: 45 },
      { range: 'Off-Peak', pricePerKwh: 6.73, demandCharge: 45 },
      { range: 'Flat Rate', pricePerKwh: 8.24, demandCharge: 45 },
    ],
    source: 'BERC Tariff Order 2024',
    sourceUrl: 'https://berc.org.bd',
    lastVerified: '2026-06-13',
  },
  {
    key: 'agricultural',
    label: 'Agricultural (Irrigation)',
    description: 'Irrigation pumps and agricultural processing',
    icon: 'sprout',
    color: '#34d399',
    slabs: [
      { range: 'Flat Rate', pricePerKwh: 4.96 },
    ],
    source: 'BERC Tariff Order 2024',
    sourceUrl: 'https://berc.org.bd',
    lastVerified: '2026-06-13',
  },
  {
    key: 'street-light',
    label: 'Street Lighting',
    description: 'Municipal and city corporation street lights',
    icon: 'lamp',
    color: '#f59e0b',
    slabs: [
      { range: 'Flat Rate', pricePerKwh: 9.37 },
    ],
    source: 'BERC Tariff Order 2024',
    sourceUrl: 'https://berc.org.bd',
    lastVerified: '2026-06-13',
  },
  {
    key: 'religious',
    label: 'Religious & Charitable',
    description: 'Mosques, temples, churches, and charitable organizations',
    icon: 'heart',
    color: '#14b8a6',
    slabs: [
      { range: 'Flat Rate', pricePerKwh: 5.40 },
    ],
    source: 'BERC Tariff Order 2024',
    sourceUrl: 'https://berc.org.bd',
    lastVerified: '2026-06-13',
  },
];

/**
 * Get the average tariff across all residential slabs (simple average).
 */
export function getAverageResidentialTariff(): number {
  const residential = CUSTOMER_TARIFFS.find(t => t.key === 'residential');
  if (!residential) return 0;
  const sum = residential.slabs.reduce((acc, s) => acc + s.pricePerKwh, 0);
  return Number((sum / residential.slabs.length).toFixed(2));
}

/**
 * Get the flat rate or first-slab price for a given category.
 */
export function getCategoryRate(categoryKey: string): number {
  const cat = CUSTOMER_TARIFFS.find(t => t.key === categoryKey);
  if (!cat || cat.slabs.length === 0) return 0;
  return cat.slabs[0].pricePerKwh;
}
