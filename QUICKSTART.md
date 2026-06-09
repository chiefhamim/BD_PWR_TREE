# Quick Start Guide - Bangladesh Power Sector Dashboard

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation & Running

```bash
cd /workspaces/BD_PWR_TREE

# Install dependencies (already done)
npm install

# Run development server
npm run dev

# Open in browser
# → http://localhost:3000
```

## 📁 Project Structure Overview

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main app page with ReactFlowProvider
│   └── globals.css         # Global styles, animations, React Flow tweaks
│
├── components/
│   ├── TreeView.tsx        # Main interactive canvas (2000+ lines)
│   │                       # - React Flow setup & configuration
│   │                       # - Header, legend, flow type indicators
│   │                       # - Drill-down panel with details
│   │                       # - Interactive tips and status displays
│   │
│   ├── nodes/
│   │   └── EntityNode.tsx  # Custom node component (200+ lines)
│   │                       # - Category-based color coding
│   │                       # - Lucide icons
│   │                       # - KPI metric display
│   │                       # - Status badges & alert states
│   │
│   └── edges/
│       └── FlowEdge.tsx    # Custom edge component (150+ lines)
│                           # - Dynamic stroke width (1-12px)
│                           # - Flow type styling
│                           # - Animated dash patterns
│
├── data/
│   └── powerSectorData.ts  # Complete dataset (750+ lines)
│                           # - 33 nodes covering all power sector entities
│                           # - 45+ edges with realistic power flows
│                           # - KPI values, icons, status, timestamps
│
├── utils/
│   └── layout.ts           # Dagre layout algorithm (50+ lines)
│                           # - Auto-calculates X/Y coordinates
│                           # - Top-to-bottom hierarchical layout
│                           # - Prevents overlapping
│
└── store/
    └── gridStore.ts        # Zustand state management (optional)
```

## 🎯 Key Features Implemented

### 1. Professional Visualization
- ✅ Custom styled nodes with glassmorphism effects
- ✅ Category-based color scheme (7 types)
- ✅ Lucide icons for quick identification
- ✅ Blueprint-style dark background with dots grid
- ✅ Dynamic edge thickness based on MW capacity

### 2. Rich Data Hierarchy
- ✅ **Government Layer**: MPEMR, Power Division, Energy Division
- ✅ **Regulator**: BERC
- ✅ **Generation**: BPDB (Coal/Gas/Hydro/Solar) + 7 IPPs + Rental + Cross-border
- ✅ **Fuel Supply**: Petrobangla, RPGCL, Coal Suppliers, Renewables
- ✅ **Transmission**: PGCB, NLDC
- ✅ **Distribution**: DPDC, DESCO, BREB, NESCO, WZPDC
- ✅ **Consumers**: Industrial, Commercial, Agricultural, Residential

### 3. Interactive Features
- ✅ Click nodes to open detailed drill-down panel
- ✅ Auto-pan/zoom to selected nodes
- ✅ Mini-map with category color coding
- ✅ Zoom controls (in/out, fit view)
- ✅ Status badges (normal, warning, alert)
- ✅ Pulsing alert indicators for critical issues
- ✅ Edge labels showing power volumes

### 4. Visual Design
- ✅ Node borders: Left 8px colored bar matching category
- ✅ Color Scheme:
  - Government: Slate (#64748b)
  - Regulator: Green (#059669)
  - Generation: Teal (#0D9488)
  - Fuel: Red (#DC2626)
  - Transmission: Navy (#1E3A8A)
  - Distribution: Amber (#D97706)
  - Consumer: Purple (#7C3AED)

### 5. Data-Rich Content
- ✅ Node labels with entity names
- ✅ KPI metrics (MW, MMcfd, MMTPA, etc.)
- ✅ Last updated timestamps
- ✅ Status indicators
- ✅ Alert badges for critical issues
- ✅ Edge labels with power flow volumes

## 🔧 Technical Architecture

### Tech Stack
- **Framework**: Next.js 14.2 (React 18)
- **Language**: TypeScript 5.1
- **Graph Visualization**: React Flow 11.10
- **Layout Algorithm**: Dagre 0.8.5
- **Styling**: Tailwind CSS 3.3
- **Icons**: Lucide React 0.263
- **State Management**: React Hooks (Zustand optional)

### Component Hierarchy
```
ReactFlowProvider (app/page.tsx)
  └─ TreeView (components/TreeView.tsx)
      ├─ ReactFlow Canvas
      │   ├─ EntityNode (custom nodes)
      │   ├─ FlowEdge (custom edges)
      │   ├─ Background (blueprint style)
      │   ├─ Controls (zoom/pan)
      │   └─ MiniMap (overview)
      │
      ├─ Header Overlay
      ├─ Legend Panel
      ├─ Flow Types Info
      ├─ Status Indicator
      ├─ Drill Panel (side drawer)
      └─ Interactive Tips
```

## 📊 Data Model

### Node Structure
```typescript
{
  id: string;
  type: 'customNode';
  data: {
    label: string;                    // Entity name
    kpiValue: string | number;        // Primary metric
    kpiUnit: string;                  // Unit (MW, MMcfd, etc.)
    category: EntityCategory;         // Type of entity
    status?: 'normal' | 'warning' | 'alert';
    lastUpdated?: string;             // Timestamp
    icon?: IconName;                  // Lucide icon
    description?: string;             // Detailed info
  };
  position: { x: number; y: number }; // Auto-calculated by Dagre
}
```

### Edge Structure
```typescript
{
  id: string;
  source: string;           // Source node ID
  target: string;           // Target node ID
  data?: {
    flowVolume?: number;    // Power in MW (used for thickness)
    flowType?: 'power' | 'fuel' | 'subsidy';
    animated?: boolean;
    label?: string;
  };
}
```

## 🎨 Customization Guide

### Add a New Node
Edit `src/data/powerSectorData.ts`:
```typescript
{
  id: 'new-node-id',
  type: 'customNode',
  data: {
    label: 'New Entity Name',
    kpiValue: 1000,
    kpiUnit: 'MW',
    category: 'generation',
    icon: 'factory',
    status: 'normal',
    lastUpdated: 'Today',
  },
  position: { x: 0, y: 0 }, // Auto-calculated
}
```

### Add a New Edge
```typescript
{
  id: 'edge-new-connection',
  source: 'node-id-1',
  target: 'node-id-2',
  data: {
    flowVolume: 5000,
    flowType: 'power',
    animated: true,
    label: '5,000 MW'
  }
}
```

### Change Node Colors
Edit `src/components/nodes/EntityNode.tsx` - `getCategoryColors()`:
```typescript
case 'custom-category':
  return {
    border: '#YourHexColor',
    bg: 'bg-your-tailwind-class',
    badgeBg: 'bg-your-badge-class',
    badgeText: 'text-your-text-class',
    badgeBorder: 'border-your-border-class',
    icon: 'text-your-icon-class',
  };
```

## 🚀 Running in Development

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

The application will hot-reload on file changes.

## 🏗️ Production Build

```bash
npm run build
npm start
```

Production build is optimized and ready for deployment.

## 📝 Available Scripts

```bash
npm run dev       # Development server
npm run build     # Production build
npm start         # Start production server
npm run lint      # Run ESLint
```

## 🎓 Learning & Extension

The codebase is well-structured for extension:

1. **Add Real-time Data**: Replace static data with WebSocket/API calls in `powerSectorData.ts`
2. **Add Animations**: Extend `FlowEdge.tsx` with custom SVG animations
3. **Add Filtering**: Add filter controls in `TreeView.tsx` header
4. **Add Search**: Implement node search with highlighting
5. **Export Features**: Add PDF/PNG export functionality
6. **Mobile View**: Create responsive layout for mobile
7. **Dark/Light Theme**: Implement theme toggle in styles

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
npm run dev -- -p 3001
```

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### TypeScript Errors
```bash
# Rebuild type definitions
npm run build
```

## 📚 Documentation

- [React Flow Docs](https://reactflow.dev/)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Dagre Docs](https://dagrejs.github.io/)

## 🎯 Next Steps

1. **Run the dev server**: `npm run dev`
2. **Explore the dashboard**: Open http://localhost:3000
3. **Click nodes** to see the drill-down panel
4. **Zoom and pan** around the hierarchy
5. **Check the legend** in the top-left corner
6. **Review the code** in `src/components/TreeView.tsx`

## 📞 Support

For questions or issues:
- Check the code comments (extensively documented)
- Review the data structure in `powerSectorData.ts`
- Examine custom components in `nodes/` and `edges/` folders
- Refer to the main README.md for detailed documentation

---

**Happy exploring! The Bangladesh Power Sector Interactive Dashboard is ready to use.** ⚡🇧🇩
