'use client';

import { Node, Edge } from 'reactflow';

export interface NodeData {
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
  icon?:
    | 'factory'
    | 'zap'
    | 'network'
    | 'building'
    | 'users'
    | 'leaf'
    | 'trending'
    | 'cpu'
    | 'droplet'
    | 'alert';
  description?: string;
  parentId?: string;
}

// ============================================================================
// NODES DEFINITION
// ============================================================================

export const powerSectorNodes: Node<NodeData>[] = [
  // ========== GOVERNMENT & POLICY LAYER ==========
  {
    id: 'mpemr',
    type: 'customNode',
    data: {
      label: 'Ministry of Power, Energy & Mineral Resources',
      kpiValue: 1,
      kpiUnit: 'Ministry',
      category: 'government',
      icon: 'building',
      status: 'normal',
      lastUpdated: 'Today',
      description: 'National policy oversight for energy sector',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'powerDiv',
    type: 'customNode',
    data: {
      label: 'Power Division',
      kpiValue: 2800,
      kpiUnit: 'MW Supervised',
      category: 'government',
      icon: 'trending',
      status: 'normal',
      lastUpdated: 'Today',
      description: 'Oversees generation, transmission, and distribution',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'energyDiv',
    type: 'customNode',
    data: {
      label: 'Energy Division',
      kpiValue: 1200,
      kpiUnit: 'MW Supervised',
      category: 'government',
      icon: 'zap',
      status: 'normal',
      lastUpdated: 'Today',
      description: 'Renewable energy and fuel import coordination',
    },
    position: { x: 0, y: 0 },
  },

  // ========== REGULATOR LAYER ==========
  {
    id: 'berc',
    type: 'customNode',
    data: {
      label: 'Bangladesh Energy Regulatory Commission',
      kpiValue: 47,
      kpiUnit: 'Tariff Changes/Year',
      category: 'regulator',
      icon: 'cpu',
      status: 'normal',
      lastUpdated: 'Today',
      description: 'Independent electricity and gas regulator',
    },
    position: { x: 0, y: 0 },
  },

  // ========== GENERATION LAYER: STATE OWNED ==========
  {
    id: 'bpdb',
    type: 'customNode',
    data: {
      label: 'BPDB (Bangladesh Power Development Board)',
      kpiValue: 6600,
      kpiUnit: 'MW Capacity',
      category: 'generation',
      icon: 'factory',
      status: 'normal',
      lastUpdated: 'Today',
      description: 'State-owned generation utility',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'bpdb-coal',
    type: 'customNode',
    data: {
      label: 'BPDB Coal Plants',
      kpiValue: 2800,
      kpiUnit: 'MW',
      category: 'generation',
      icon: 'factory',
      status: 'normal',
      lastUpdated: 'Today',
      description: 'Barapukuria, Rangpur coal facilities',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'bpdb-gas',
    type: 'customNode',
    data: {
      label: 'BPDB Gas Plants',
      kpiValue: 3200,
      kpiUnit: 'MW',
      category: 'generation',
      icon: 'factory',
      status: 'warning',
      lastUpdated: 'Today',
      description: 'Natural gas powered generating stations',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'bpdb-hydro',
    type: 'customNode',
    data: {
      label: 'BPDB Hydro Plants',
      kpiValue: 230,
      kpiUnit: 'MW',
      category: 'generation',
      icon: 'droplet',
      status: 'normal',
      lastUpdated: 'Today',
      description: 'Kaptai and Teesta hydroelectric facilities',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'bpdb-renewable',
    type: 'customNode',
    data: {
      label: 'BPDB Solar & Wind',
      kpiValue: 370,
      kpiUnit: 'MW',
      category: 'generation',
      icon: 'leaf',
      status: 'normal',
      lastUpdated: 'Today',
      description: 'Solar and wind energy initiatives',
    },
    position: { x: 0, y: 0 },
  },

  // ========== GENERATION LAYER: IPP (Independent Power Producers) ==========
  {
    id: 'summit-power',
    type: 'customNode',
    data: {
      label: 'Summit Power',
      kpiValue: 1500,
      kpiUnit: 'MW',
      category: 'generation',
      icon: 'factory',
      status: 'normal',
      lastUpdated: 'Today',
      description: 'Major private power producer',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'united-power',
    type: 'customNode',
    data: {
      label: 'United Power',
      kpiValue: 1200,
      kpiUnit: 'MW',
      category: 'generation',
      icon: 'factory',
      status: 'normal',
      lastUpdated: 'Today',
      description: 'Major private power producer',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'confidence-power',
    type: 'customNode',
    data: {
      label: 'Confidence Power',
      kpiValue: 600,
      kpiUnit: 'MW',
      category: 'generation',
      icon: 'factory',
      status: 'normal',
      lastUpdated: 'Today',
      description: 'Major private power producer',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'other-ipps',
    type: 'customNode',
    data: {
      label: 'Other IPPs & Private Generators',
      kpiValue: 2100,
      kpiUnit: 'MW',
      category: 'generation',
      icon: 'factory',
      status: 'normal',
      lastUpdated: 'Today',
      description: 'Various smaller independent producers',
    },
    position: { x: 0, y: 0 },
  },

  // ========== GENERATION LAYER: RENTAL & EMERGENCY ==========
  {
    id: 'rental-power',
    type: 'customNode',
    data: {
      label: 'Rental Power Plants',
      kpiValue: 800,
      kpiUnit: 'MW',
      category: 'generation',
      icon: 'factory',
      status: 'warning',
      lastUpdated: 'Today',
      description: 'Short-term emergency power capacity',
    },
    position: { x: 0, y: 0 },
  },

  // ========== GENERATION LAYER: CROSS-BORDER IMPORTS ==========
  {
    id: 'adani-godda',
    type: 'customNode',
    data: {
      label: 'Adani Godda (India Import)',
      kpiValue: 500,
      kpiUnit: 'MW',
      category: 'generation',
      icon: 'trending',
      status: 'normal',
      lastUpdated: 'Today',
      description: 'Coal-based import from India',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'tripura-import',
    type: 'customNode',
    data: {
      label: 'Tripura Import (India)',
      kpiValue: 300,
      kpiUnit: 'MW',
      category: 'generation',
      icon: 'trending',
      status: 'normal',
      lastUpdated: 'Today',
      description: 'Hydro power import from Tripura',
    },
    position: { x: 0, y: 0 },
  },

  // ========== FUEL SUPPLY LAYER ==========
  {
    id: 'petrobangla',
    type: 'customNode',
    data: {
      label: 'Petrobangla',
      kpiValue: 1850,
      kpiUnit: 'MMcfd Gas',
      category: 'fuel',
      icon: 'droplet',
      status: 'warning',
      lastUpdated: 'Today',
      description: 'State-owned gas supplier and producer',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'rpgcl',
    type: 'customNode',
    data: {
      label: 'RPGCL (LNG Terminal)',
      kpiValue: 5.5,
      kpiUnit: 'MMTPA',
      category: 'fuel',
      icon: 'droplet',
      status: 'normal',
      lastUpdated: 'Today',
      description: 'Liquefied natural gas importer and regasifier',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'coal-suppliers',
    type: 'customNode',
    data: {
      label: 'Coal Suppliers',
      kpiValue: 18,
      kpiUnit: 'Million Tonnes/Year',
      category: 'fuel',
      icon: 'trending',
      status: 'normal',
      lastUpdated: 'Today',
      description: 'Imported coal from international markets',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'renewable-fuel',
    type: 'customNode',
    data: {
      label: 'Renewable Energy Sources',
      kpiValue: 1500,
      kpiUnit: 'MW Target',
      category: 'fuel',
      icon: 'leaf',
      status: 'normal',
      lastUpdated: 'Today',
      description: 'Solar, wind, and biomass resources',
    },
    position: { x: 0, y: 0 },
  },

  // ========== TRANSMISSION LAYER ==========
  {
    id: 'pgcb',
    type: 'customNode',
    data: {
      label: 'PGCB (National Grid)',
      kpiValue: 24000,
      kpiUnit: 'Circuit KM',
      category: 'transmission',
      icon: 'network',
      status: 'normal',
      lastUpdated: 'Today',
      description: 'Transmission backbone of Bangladesh power system',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'nldc',
    type: 'customNode',
    data: {
      label: 'NLDC (National Load Despatch Centre)',
      kpiValue: 14000,
      kpiUnit: 'MW Real-time',
      category: 'transmission',
      icon: 'cpu',
      status: 'normal',
      lastUpdated: 'Today',
      description: 'Real-time grid operations and frequency control',
    },
    position: { x: 0, y: 0 },
  },

  // ========== DISTRIBUTION LAYER ==========
  {
    id: 'dpdc',
    type: 'customNode',
    data: {
      label: 'DPDC (Dhaka South Distribution)',
      kpiValue: 3200,
      kpiUnit: 'MW Peak',
      category: 'distribution',
      icon: 'network',
      status: 'normal',
      lastUpdated: 'Today',
      description: 'Distribution company serving Dhaka south and suburbs',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'desco',
    type: 'customNode',
    data: {
      label: 'DESCO (Dhaka North Distribution)',
      kpiValue: 2800,
      kpiUnit: 'MW Peak',
      category: 'distribution',
      icon: 'network',
      status: 'normal',
      lastUpdated: 'Today',
      description: 'Distribution company serving Dhaka north and suburbs',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'breb',
    type: 'customNode',
    data: {
      label: 'BREB (Rural Electrification Board)',
      kpiValue: 1500,
      kpiUnit: 'MW Peak',
      category: 'distribution',
      icon: 'network',
      status: 'normal',
      lastUpdated: 'Today',
      description: '80 Palli Bidyut Samities serving rural areas',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'nesco',
    type: 'customNode',
    data: {
      label: 'NESCO (North Distribution)',
      kpiValue: 1200,
      kpiUnit: 'MW Peak',
      category: 'distribution',
      icon: 'network',
      status: 'normal',
      lastUpdated: 'Today',
      description: 'Distribution company serving northern regions',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'wzpdc',
    type: 'customNode',
    data: {
      label: 'WZPDC (West/South Distribution)',
      kpiValue: 1100,
      kpiUnit: 'MW Peak',
      category: 'distribution',
      icon: 'network',
      status: 'normal',
      lastUpdated: 'Today',
      description: 'Distribution company serving western and southern regions',
    },
    position: { x: 0, y: 0 },
  },

  // ========== CONSUMER LAYER ==========
  {
    id: 'industrial-consumer',
    type: 'customNode',
    data: {
      label: 'Industrial Consumers',
      kpiValue: 4800,
      kpiUnit: 'MW Demand',
      category: 'consumer',
      icon: 'factory',
      status: 'normal',
      lastUpdated: 'Today',
      description: 'Garments, textile, cement, and manufacturing sectors',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'commercial-consumer',
    type: 'customNode',
    data: {
      label: 'Commercial Consumers',
      kpiValue: 2400,
      kpiUnit: 'MW Demand',
      category: 'consumer',
      icon: 'building',
      status: 'normal',
      lastUpdated: 'Today',
      description: 'Retail, offices, hospitals, and service sectors',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'agricultural-consumer',
    type: 'customNode',
    data: {
      label: 'Agricultural Consumers',
      kpiValue: 1800,
      kpiUnit: 'MW Demand',
      category: 'consumer',
      icon: 'leaf',
      status: 'normal',
      lastUpdated: 'Today',
      description: 'Irrigation pumps and agricultural processing',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'residential-consumer',
    type: 'customNode',
    data: {
      label: 'Residential Consumers',
      kpiValue: 5600,
      kpiUnit: 'MW Demand',
      category: 'consumer',
      icon: 'users',
      status: 'normal',
      lastUpdated: 'Today',
      description: '35+ million household connections',
    },
    position: { x: 0, y: 0 },
  },
];

// ============================================================================
// EDGES DEFINITION
// ============================================================================

export const powerSectorEdges: Edge[] = [
  // Policy hierarchy
  { id: 'mpemr-powerDiv', source: 'mpemr', target: 'powerDiv' },
  { id: 'mpemr-energyDiv', source: 'mpemr', target: 'energyDiv' },
  { id: 'mpemr-berc', source: 'mpemr', target: 'berc' },

  // Power Division to generation
  { id: 'powerDiv-bpdb', source: 'powerDiv', target: 'bpdb' },
  { id: 'powerDiv-pgcb', source: 'powerDiv', target: 'pgcb' },
  { id: 'powerDiv-dpdc', source: 'powerDiv', target: 'dpdc' },

  // BPDB to its sub-units
  { id: 'bpdb-coal', source: 'bpdb', target: 'bpdb-coal' },
  { id: 'bpdb-gas', source: 'bpdb', target: 'bpdb-gas' },
  { id: 'bpdb-hydro', source: 'bpdb', target: 'bpdb-hydro' },
  { id: 'bpdb-renewable', source: 'bpdb', target: 'bpdb-renewable' },

  // Generation to transmission (BPDB units)
  {
    id: 'edge-coal-pgcb',
    source: 'bpdb-coal',
    target: 'pgcb',
    data: { flowVolume: 2800, flowType: 'power', animated: true, label: '2,800 MW' },
  },
  {
    id: 'edge-gas-pgcb',
    source: 'bpdb-gas',
    target: 'pgcb',
    data: { flowVolume: 3200, flowType: 'power', animated: true, label: '3,200 MW' },
  },
  {
    id: 'edge-hydro-pgcb',
    source: 'bpdb-hydro',
    target: 'pgcb',
    data: { flowVolume: 230, flowType: 'power', animated: true, label: '230 MW' },
  },
  {
    id: 'edge-renewable-pgcb',
    source: 'bpdb-renewable',
    target: 'pgcb',
    data: { flowVolume: 370, flowType: 'power', animated: true, label: '370 MW' },
  },

  // IPP Generation to transmission
  {
    id: 'edge-summit-pgcb',
    source: 'summit-power',
    target: 'pgcb',
    data: { flowVolume: 1500, flowType: 'power', animated: true, label: '1,500 MW' },
  },
  {
    id: 'edge-united-pgcb',
    source: 'united-power',
    target: 'pgcb',
    data: { flowVolume: 1200, flowType: 'power', animated: true, label: '1,200 MW' },
  },
  {
    id: 'edge-confidence-pgcb',
    source: 'confidence-power',
    target: 'pgcb',
    data: { flowVolume: 600, flowType: 'power', animated: true, label: '600 MW' },
  },
  {
    id: 'edge-other-ipps-pgcb',
    source: 'other-ipps',
    target: 'pgcb',
    data: { flowVolume: 2100, flowType: 'power', animated: true, label: '2,100 MW' },
  },

  // Rental Power
  {
    id: 'edge-rental-pgcb',
    source: 'rental-power',
    target: 'pgcb',
    data: { flowVolume: 800, flowType: 'power', animated: true, label: '800 MW' },
  },

  // Cross-border imports
  {
    id: 'edge-adani-pgcb',
    source: 'adani-godda',
    target: 'pgcb',
    data: { flowVolume: 500, flowType: 'power', animated: true, label: '500 MW' },
  },
  {
    id: 'edge-tripura-pgcb',
    source: 'tripura-import',
    target: 'pgcb',
    data: { flowVolume: 300, flowType: 'power', animated: true, label: '300 MW' },
  },

  // Fuel supply to generation
  {
    id: 'edge-petrobangla-gas',
    source: 'petrobangla',
    target: 'bpdb-gas',
    data: { flowVolume: 1850, flowType: 'fuel', label: '1,850 MMcfd' },
  },
  {
    id: 'edge-rpgcl-gas',
    source: 'rpgcl',
    target: 'bpdb-gas',
    data: { flowVolume: 1200, flowType: 'fuel', label: '5.5 MMTPA' },
  },
  {
    id: 'edge-coal-supply',
    source: 'coal-suppliers',
    target: 'bpdb-coal',
    data: { flowVolume: 1800, flowType: 'fuel', label: '18 MT/Year' },
  },
  {
    id: 'edge-renewable-supply',
    source: 'renewable-fuel',
    target: 'bpdb-renewable',
    data: { flowVolume: 600, flowType: 'fuel', label: 'Solar/Wind' },
  },

  // Transmission to distribution
  { id: 'pgcb-nldc', source: 'pgcb', target: 'nldc' },
  { id: 'nldc-dpdc', source: 'nldc', target: 'dpdc' },
  { id: 'nldc-desco', source: 'nldc', target: 'desco' },
  { id: 'nldc-breb', source: 'nldc', target: 'breb' },
  { id: 'nldc-nesco', source: 'nldc', target: 'nesco' },
  { id: 'nldc-wzpdc', source: 'nldc', target: 'wzpdc' },

  // Distribution to consumers (sample - major flows)
  {
    id: 'edge-dpdc-industrial',
    source: 'dpdc',
    target: 'industrial-consumer',
    data: { flowVolume: 1600, flowType: 'power', label: '1,600 MW' },
  },
  {
    id: 'edge-dpdc-commercial',
    source: 'dpdc',
    target: 'commercial-consumer',
    data: { flowVolume: 800, flowType: 'power', label: '800 MW' },
  },
  {
    id: 'edge-dpdc-residential',
    source: 'dpdc',
    target: 'residential-consumer',
    data: { flowVolume: 1800, flowType: 'power', label: '1,800 MW' },
  },

  {
    id: 'edge-desco-industrial',
    source: 'desco',
    target: 'industrial-consumer',
    data: { flowVolume: 1200, flowType: 'power', label: '1,200 MW' },
  },
  {
    id: 'edge-desco-residential',
    source: 'desco',
    target: 'residential-consumer',
    data: { flowVolume: 1600, flowType: 'power', label: '1,600 MW' },
  },

  {
    id: 'edge-breb-agricultural',
    source: 'breb',
    target: 'agricultural-consumer',
    data: { flowVolume: 1200, flowType: 'power', label: '1,200 MW' },
  },
  {
    id: 'edge-breb-residential',
    source: 'breb',
    target: 'residential-consumer',
    data: { flowVolume: 800, flowType: 'power', label: '800 MW' },
  },

  {
    id: 'edge-nesco-industrial',
    source: 'nesco',
    target: 'industrial-consumer',
    data: { flowVolume: 800, flowType: 'power', label: '800 MW' },
  },
  {
    id: 'edge-nesco-commercial',
    source: 'nesco',
    target: 'commercial-consumer',
    data: { flowVolume: 400, flowType: 'power', label: '400 MW' },
  },

  {
    id: 'edge-wzpdc-commercial',
    source: 'wzpdc',
    target: 'commercial-consumer',
    data: { flowVolume: 200, flowType: 'power', label: '200 MW' },
  },
  {
    id: 'edge-wzpdc-industrial',
    source: 'wzpdc',
    target: 'industrial-consumer',
    data: { flowVolume: 200, flowType: 'power', label: '200 MW' },
  },
  {
    id: 'edge-wzpdc-residential',
    source: 'wzpdc',
    target: 'residential-consumer',
    data: { flowVolume: 400, flowType: 'power', label: '400 MW' },
  },

  // Regulator connections (advisory)
  { id: 'berc-bpdb', source: 'berc', target: 'bpdb' },
  { id: 'berc-dpdc', source: 'berc', target: 'dpdc' },
  { id: 'berc-desco', source: 'berc', target: 'desco' },
];

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  nodes: powerSectorNodes,
  edges: powerSectorEdges,
};
